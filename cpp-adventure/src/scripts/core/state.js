/* ---------------- 状态（多用户登录 + 存档版本迁移） ------------ */
var SCHEMA_VERSION = 3;
var KEY = "cppsAdventureV2";
var OLD_KEY = "cppsAdventureV1";
var SDB = {users:{}, current:null};
var S = {passed:{}};
/* 数据安全状态：loadDB 解析/迁移失败时置标记，防止用空库覆盖真实存档 */
var __DB_LOAD_ERROR__ = false;

/* 判断一份存档里是否有「真实学习数据」：空壳用户（只有空 passed）不算。
 * 用于空库写保护、快照防呆、云端上传防呆，杜绝空数据覆盖/污染。 */
function dbHasReal(db){
  if (!db || !db.users || typeof db.users !== "object") return false;
  var names = Object.keys(db.users);
  if (!names.length) return false;
  return names.some(function(nm){
    var u = db.users[nm];
    if (!u || typeof u !== "object") return false;
    var keys = Object.keys(u);
    if (!keys.length) return false;
    /* 空壳：只有 passed 且为空 */
    if (keys.length === 1 && u.passed && Object.keys(u.passed).length === 0) return false;
    if (u.passed && Object.keys(u.passed).length > 0) return true;
    return true; /* 有 logs/errors/fp/金币/计划等任意学习字段 */
  });
}

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
  __DB_LOAD_ERROR__ = false;
  try { var raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.users){
    try { return migrate(raw); }
    catch(e){ __DB_LOAD_ERROR__ = true; try { console.error("[loadDB] 新存档迁移失败，已保护原始数据不覆盖", e); } catch(_){} }
  } } catch(e){}
  try { var old = JSON.parse(localStorage.getItem(OLD_KEY)); if (old && old.passed){
    try { return migrate(old); }
    catch(e){ __DB_LOAD_ERROR__ = true; try { console.error("[loadDB] 旧档迁移失败，已保护原始数据不覆盖", e); } catch(_){} }
  } } catch(e){}
  return {users:{}, current:null, schemaVersion:SCHEMA_VERSION};
}
function loadCurrentUser(){
  SDB = loadDB();
  if (SDB.current && SDB.users[SDB.current]) S = SDB.users[SDB.current];
  else S = {passed:{}};
  /* 只有当前用户记录确实存在时才写回，防止迁移/异常后用空对象覆盖真实数据 */
  if (!__DB_LOAD_ERROR__ && SDB.current && SDB.users[SDB.current]) saveS();
}
function ensureDefaultUser(){
  /* 加载/迁移异常：绝不静默建空用户覆盖，提示用户去恢复 */
  if (__DB_LOAD_ERROR__){
    setTimeout(function(){
      try { if (typeof baToast === "function") baToast("⚠️ 存档读取异常，原始数据已保护。请点 ☁️ 同步 → 本地自动备份 → 恢复找回。"); } catch(_){}
    }, 900);
    return;
  }
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
function bkupNow(reason, force){
  try {
    /* 防呆：非强制时，本机没有真实学习数据就不存快照，防止空快照占满 12 份历史 */
    if (!force){
      var chk = null;
      try { chk = JSON.parse(localStorage.getItem(KEY) || "null"); } catch(e){ chk = null; }
      if (!dbHasReal(chk)) return;
    }
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
          if (cur){
            var info = "";
            try {
              var db2 = JSON.parse((cur.value.data || {})[KEY] || "null");
              if (db2 && db2.users){
                var n = Object.keys(db2.users).length, p = 0, empty = 0;
                Object.keys(db2.users).forEach(function(nm){
                  var u = db2.users[nm] || {};
                  var pk = Object.keys(u.passed || {}).length;
                  p += pk;
                  if (!pk && Object.keys(u).length <= 1) empty++;
                });
                info = n + " 个账号 · 已过 " + p + " 关" + (empty === n ? "（空数据）" : "");
              } else { info = "（无主存档）"; }
            } catch(e){ info = ""; }
            all.push({ t: cur.value.t, reason: cur.value.reason || "", info: info });
            cur.continue();
          }
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
  /* 空库写保护：当前内存是空库/空壳，但浏览器里已有真实存档 → 拒绝覆盖。
   * 防止登录/退出/升级迁移异常后，用空数据把用户多年进度冲掉。 */
  try {
    if (!dbHasReal(SDB)){
      var prev = localStorage.getItem(KEY);
      var prevDb = null;
      try { prevDb = prev ? JSON.parse(prev) : null; } catch(e){ prevDb = null; }
      if (prev != null && dbHasReal(prevDb)){
        window.__SAVE_BLOCKED__ = true;
        try { console.error("[saveS] 空库写保护：拒绝用空数据覆盖已有存档（已自动记录现场）"); } catch(_){}
        try { bkupNow("blocked-save", true); } catch(_){}
        return false;
      }
    }
  } catch(e){}
  window.__SAVE_BLOCKED__ = false;
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
  return true;
}
loadCurrentUser();
function starsOf(){ return Object.keys(S.passed).length; }
function lvOf(n){ return Math.min(8, 1 + Math.floor(n / 5)); }
function isPassed(id){ return !!S.passed[id]; }
function isLocked(idx){ if (idx === 0) return false; return !isPassed(LEVELS[idx-1].id); }
function curIdx(){ for (let i = 0; i < LEVELS.length; i++){ if (!isPassed(LEVELS[i].id) && !isLocked(i)) return i; } return LEVELS.length; }
