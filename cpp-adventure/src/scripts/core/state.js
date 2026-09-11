/* ---------------- 状态（多用户登录 + 存档版本迁移） ------------ */
var SCHEMA_VERSION = 3;
var KEY = "cppsAdventureV2";
var OLD_KEY = "cppsAdventureV1";
var SDB = {users:{}, current:null};
var S = {passed:{}};

/* 迁移函数链：MIGRATIONS[n] 把版本 n 的存档升级到 n+1 */
var MIGRATIONS = {
  1: function(data){
    return {users:{"指挥官": data}, current:"指挥官", schemaVersion:2};
  },
  2: function(data){
    Object.keys(data.users || {}).forEach(function(nm){
      var s = data.users[nm];
      if (!s.logs) s.logs = [];
      if (!s.errors) s.errors = [];
      if (!s.fp) s.fp = {ok:0, err:0};
    });
    data.schemaVersion = 3;
    return data;
  }
};

function migrate(data){
  var v = data.schemaVersion || (data.users ? 2 : 1);
  while (v < SCHEMA_VERSION){
    data = MIGRATIONS[v] ? MIGRATIONS[v](data) : (data.schemaVersion = v + 1, data);
    v = data.schemaVersion;
  }
  return data;
}

function loadDB(){
  try { var raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.users) return migrate(raw); } catch(e){}
  try { var old = JSON.parse(localStorage.getItem(OLD_KEY)); if (old && old.passed) return migrate(old); } catch(e){}
  return {users:{}, current:null, schemaVersion:SCHEMA_VERSION};
}
function loadCurrentUser(){
  SDB = loadDB();
  if (SDB.current && SDB.users[SDB.current]) S = SDB.users[SDB.current];
  else S = {passed:{}};
  /* 只有当前用户记录确实存在时才写回，防止迁移/异常后用空对象覆盖真实数据 */
  if (SDB.current && SDB.users[SDB.current]) saveS();
}
function ensureDefaultUser(){
  if (!SDB.current || !SDB.users[SDB.current]){
    var nm = "小指挥官";
    if (!SDB.users[nm]) SDB.users[nm] = {passed:{}};
    SDB.current = nm;
    S = SDB.users[nm];
    saveS();
  }
}

/* ---------- 本地自动双备份（IndexedDB 冗余快照）----------
 * 学习数据仍存 localStorage（主仓库），另存一份完整快照到 IndexedDB，
 * 保留最近 12 份历史。即使 localStorage 被浏览器清理或程序写坏，
 * 也能从快照恢复，数据不再丢失。
 */
var BK_BD = null;
function bkupOpen(){
  return new Promise(function(resolve, reject){
    if (BK_BD) return resolve(BK_BD);
    try {
      var req = indexedDB.open("sc_snapshots", 1);
      req.onupgradeneeded = function(e){
        var db = e.target.result;
        if (!db.objectStoreNames.contains("snaps")){
          var st = db.createObjectStore("snaps", { keyPath: "t" });
          st.createIndex("t", "t", { unique: true });
        }
      };
      req.onsuccess = function(e){ BK_BD = e.target.result; resolve(BK_BD); };
      req.onerror = function(){ resolve(null); };
    } catch(e){ resolve(null); }
  });
}
function bkupWrite(snap){
  return bkupOpen().then(function(db){
    if (!db) return;
    return new Promise(function(resolve){
      try {
        var tx = db.transaction("snaps", "readwrite");
        tx.objectStore("snaps").put(snap);
        /* 只保留最近 12 份 */
        var rq = tx.objectStore("snaps").index("t").openCursor(null, "prev");
        var skip = 0, del = [];
        rq.onsuccess = function(){
          var cur = rq.result;
          if (cur){
            skip++;
            if (skip > 12) del.push(cur.primaryKey);
            cur.continue();
          } else if (del.length){
            var t2 = db.transaction("snaps", "readwrite");
            del.forEach(function(k){ try { t2.objectStore("snaps").delete(k); } catch(e){} });
          }
          resolve();
        };
        rq.onerror = function(){ resolve(); };
      } catch(e){ resolve(); }
    });
  });
}
function bkupNow(reason){
  try {
    var data = {};
    for (var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if (!k || k === "sc_cloud") continue;
      data[k] = localStorage.getItem(k);
    }
    if (Object.keys(data).length === 0) return;
    var snap = { t: Date.now(), reason: reason || "save", data: data };
    bkupWrite(snap);
  } catch(e){}
}
function bkupList(){
  return bkupOpen().then(function(db){
    if (!db) return [];
    return new Promise(function(resolve){
      try {
        var all = [];
        var rq = db.transaction("snaps", "readonly").objectStore("snaps").index("t").openCursor(null, "prev");
        rq.onsuccess = function(){
          var cur = rq.result;
          if (cur){ all.push({ t: cur.value.t, reason: cur.value.reason || "" }); cur.continue(); }
          else resolve(all);
        };
        rq.onerror = function(){ resolve([]); };
      } catch(e){ resolve([]); }
    });
  });
}
function bkupRestore(t){
  return bkupOpen().then(function(db){
    if (!db) return false;
    return new Promise(function(resolve){
      try {
        var rq = db.transaction("snaps", "readonly").objectStore("snaps").get(t);
        rq.onsuccess = function(){
          var snap = rq.result;
          if (!snap || !snap.data){ resolve(false); return; }
          Object.keys(snap.data).forEach(function(k){
            try { localStorage.setItem(k, snap.data[k]); } catch(e){}
          });
          resolve(true);
        };
        rq.onerror = function(){ resolve(false); };
      } catch(e){ resolve(false); }
    });
  });
}
var BKUP_LAST = 0;
function saveS(){
  if (SDB.current){ SDB.users[SDB.current] = S; }
  try {
    localStorage.setItem(KEY, JSON.stringify(SDB));
    window.__SAVE_FAIL__ = false;
  } catch(e){
    window.__SAVE_FAIL__ = true;
    try { console.error("存档保存失败（存储空间不足？）", e); } catch(_){}
  }
  /* 本地自动快照：30 秒内最多备份一次，防止每答一题都写库 */
  try {
    var now = Date.now();
    if (now - BKUP_LAST > 30000){ BKUP_LAST = now; bkupNow("save"); }
  } catch(e){}
  /* 云端自动备份钩子：配置了云端后，进度变化 5 秒内自动上传 */
  try { if (typeof csMarkDirty === "function") csMarkDirty(); } catch(_){}
}
loadCurrentUser();
function starsOf(){ return Object.keys(S.passed).length; }
function lvOf(n){ return Math.min(8, 1 + Math.floor(n / 5)); }
function isPassed(id){ return !!S.passed[id]; }
function isLocked(idx){ if (idx === 0) return false; return !isPassed(LEVELS[idx-1].id); }
function curIdx(){ for (let i = 0; i < LEVELS.length; i++){ if (!isPassed(LEVELS[i].id) && !isLocked(i)) return i; } return LEVELS.length; }
