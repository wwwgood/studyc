/* 补丁：①选项按钮内联布局兜底（缓存旧CSS也不挤） ②key与文本间加空格 */
const fs = require("fs");
const qp = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\modules\\qtypes.js";
let t = fs.readFileSync(qp, "utf8");

const old1 = '      \'<span class="qt-opt-key">\' + String.fromCharCode(65 + i) + \'</span><span class="qt-opt-text">\' + o + \'</span></button>\';';
const new1 = '      \'<span class="qt-opt-key">\' + String.fromCharCode(65 + i) + \'</span> <span class="qt-opt-text">\' + o + \'</span></button>\';';
if (t.indexOf(old1) < 0) throw new Error("choice 未命中");
t = t.split(old1).join(new1);

const old2 = '        \'<span class="qt-opt-key">\' + String.fromCharCode(65 + oi) + \'</span><span class="qt-opt-text">\' + o + \'</span></button>\';';
const new2 = '        \'<span class="qt-opt-key">\' + String.fromCharCode(65 + oi) + \'</span> <span class="qt-opt-text">\' + o + \'</span></button>\';';
if (t.indexOf(old2) < 0) throw new Error("reading 未命中");
t = t.split(old2).join(new2);

/* 选项按钮内联布局兜底：CSS 未加载/缓存旧版时也保持竖排+间距 */
const old3 = '    html += \'<button class="qt-opt" type="button" data-p="\' + prefix + \'" data-i="\' + i + \'" onclick="qtPick(this)">\' +';
const new3 = '    html += \'<button class="qt-opt" type="button" style="display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;text-align:left;margin:6px 0;padding:11px 14px;" data-p="\' + prefix + \'" data-i="\' + i + \'" onclick="qtPick(this)">\' +';
if (t.indexOf(old3) < 0) throw new Error("内联①未命中");
t = t.split(old3).join(new3);

const old4 = '        html += \'<button class="qt-opt" type="button" data-p="\' + prefix + \'" data-s="\' + si + \'" data-i="\' + oi + \'" onclick="qtPick(this)">\' +';
const new4 = '        html += \'<button class="qt-opt" type="button" style="display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;text-align:left;margin:6px 0;padding:11px 14px;" data-p="\' + prefix + \'" data-s="\' + si + \'" data-i="\' + oi + \'" onclick="qtPick(this)">\' +';
if (t.indexOf(old4) < 0) throw new Error("内联②未命中");
t = t.split(old4).join(new4);

fs.writeFileSync(qp, t, "utf8");
console.log("qtypes 选项渲染已加固");
