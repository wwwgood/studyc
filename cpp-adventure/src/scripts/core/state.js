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
  if (SDB.current) saveS();
}
function saveS(){ if (SDB.current){ SDB.users[SDB.current] = S; } try { localStorage.setItem(KEY, JSON.stringify(SDB)); } catch(e){} }
loadCurrentUser();
function starsOf(){ return Object.keys(S.passed).length; }
function lvOf(n){ return Math.min(8, 1 + Math.floor(n / 5)); }
function isPassed(id){ return !!S.passed[id]; }
function isLocked(idx){ if (idx === 0) return false; return !isPassed(LEVELS[idx-1].id); }
function curIdx(){ for (let i = 0; i < LEVELS.length; i++){ if (!isPassed(LEVELS[i].id) && !isLocked(i)) return i; } return LEVELS.length; }
