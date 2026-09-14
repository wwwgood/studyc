const fs = require("fs");
const CRLF = "\r\n";
const p = "E:\\htdocs\\studyc\\cpp-adventure\\tests\\english.test.js";
let t = fs.readFileSync(p, "utf8");

const oldA = 'test("英语关卡总数 103 例（100 原例 + 3 综合模拟）", () => {' + CRLF + '  assert.strictEqual(EQ.lessons.length, 103);' + CRLF + '});';
const newA = 'test("英语关卡总数 104 例（100 原例 + 代词总览 1 + 3 综合模拟）", () => {' + CRLF + '  assert.strictEqual(EQ.lessons.length, 104);' + CRLF + '});';
if (t.indexOf(oldA) < 0) { console.log("A 未命中"); process.exit(1); }
t = t.split(oldA).join(newA);

const oldB = "  const want = { 1: 9, 2: 8, 3: 11, 4: 6, 5: 10, 6: 8, 7: 10, 8: 6, 9: 12, 10: 6, 11: 8, 12: 6, 13: 3 };";
const newB = "  const want = { 1: 9, 2: 8, 3: 12, 4: 6, 5: 10, 6: 8, 7: 10, 8: 6, 9: 12, 10: 6, 11: 8, 12: 6, 13: 3 };";
if (t.indexOf(oldB) < 0) { console.log("B 未命中"); process.exit(1); }
t = t.split(oldB).join(newB);
fs.writeFileSync(p, t, "utf8");
console.log("english.test.js 断言已更新");
