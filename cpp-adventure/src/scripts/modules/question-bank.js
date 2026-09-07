/* ---------------- 题库引擎 question-bank.js ----------------
 * 统一题库管理：随机选题、按模块/知识点筛选、去重、统计。
 * 数据在 QB_DATA（question-bank.js），支持后续导入真实真题扩充。
 */

var QB_USED = {}; // 本次会话已用题目ID，避免重复

/* 重置已用记录 */
function qbResetUsed(){ QB_USED = {}; }

/* 获取题库中符合条件的题目 */
function qbQuery(module, topicId, subject){
  if (typeof QB_DATA === "undefined") return [];
  return QB_DATA.questions.filter(function(q){
    if (subject && q.subject !== subject) return false;
    if (module && q.module !== module) return false;
    if (topicId !== undefined && topicId !== null && q.topicId !== topicId) return false;
    return true;
  });
}

/* 随机选 count 道题，排除已用的 */
function qbSelect(module, topicId, count, excludeIds, subject){
  var pool = qbQuery(module, topicId, subject);
  var used = excludeIds || [];
  var available = pool.filter(function(q){
    return !QB_USED[q.id] && used.indexOf(q.id) < 0;
  });
  // 如果不够，放宽限制（允许重复使用）
  if (available.length < count){
    available = pool.filter(function(q){ return used.indexOf(q.id) < 0; });
  }
  if (available.length === 0) return [];
  // Fisher-Yates 随机抽取
  var result = [];
  var arr = available.slice();
  for (var i = 0; i < Math.min(count, arr.length); i++){
    var j = i + Math.floor(Math.random() * (arr.length - i));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    result.push(arr[i]);
    QB_USED[arr[i].id] = true;
  }
  return result;
}

/* 题库统计 */
function qbStats(){
  if (typeof QB_DATA === "undefined") return { total: 0 };
  var byModule = {};
  var bySource = {};
  var byTopic = {};
  QB_DATA.questions.forEach(function(q){
    byModule[q.module] = (byModule[q.module] || 0) + 1;
    bySource[q.source] = (bySource[q.source] || 0) + 1;
    var key = q.module + "_" + q.topicId;
    byTopic[key] = (byTopic[key] || 0) + 1;
  });
  return {
    total: QB_DATA.questions.length,
    byModule: byModule,
    bySource: bySource,
    byTopic: byTopic
  };
}

/* 添加题目到题库（运行时，不持久化；持久化需通过 build/import-questions.js） */
function qbAdd(question){
  if (typeof QB_DATA === "undefined") return;
  if (!question.id) question.id = "qb" + Date.now() + Math.floor(Math.random() * 1000);
  QB_DATA.questions.push(question);
}

/* 获取某模块/专题的题目数量 */
function qbCount(module, topicId){
  return qbQuery(module, topicId).length;
}