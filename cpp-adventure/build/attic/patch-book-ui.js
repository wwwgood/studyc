const fs = require("fs");
const CRLF = "\r\n";

/* ① english.css：教材精讲区块样式 */
const cp = "E:\\htdocs\\studyc\\cpp-adventure\\src\\styles\\english.css";
let c = fs.readFileSync(cp, "utf8");
const oldC = ".eq-motto{background:linear-gradient(150deg,#F0FFF8,#E8FBF2); border:1.5px solid #10B981; color:#065F46; border-radius:12px; padding:9px 13px; font-size:14px; font-weight:700; margin-bottom:14px;}";
const newC = oldC + "\n.eq-book{background:#FFFDF5; border:1.5px solid #EAB308; border-left:5px solid #EAB308; border-radius:12px; padding:12px 14px; font-size:14px; line-height:1.85; color:#4A3A00; margin-bottom:14px; max-height:38vh; overflow-y:auto;}\n.eq-book-title{font-size:13px; font-weight:800; color:#92400E; margin-bottom:6px; letter-spacing:.5px;}";
if (c.indexOf(oldC) < 0) throw new Error("css 未命中");
c = c.split(oldC).join(newC);
fs.writeFileSync(cp, c, "utf8");
console.log("① css 教材区块样式");

/* ② english-quest.js：渲染 book 区块 + 映射表 */
const ep = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\modules\\english-quest.js";
let e = fs.readFileSync(ep, "utf8");
const oldR = "'<div class=\"eq-cap-bubble\">' + l.body + '</div>' +";
const newR = "'<div class=\"eq-cap-bubble\">' + l.body + '</div>' +\n      (l.book ? '<div class=\"eq-book\"><div class=\"eq-book-title\">📖 教材精讲（《小学英语语法100例》）</div>' + l.book + '</div>' : '') +";
if (e.indexOf(oldR) < 0) throw new Error("渲染未命中");
e = e.split(oldR).join(newR);

const oldM = '  ["反身代词", null],';
const newM = '  ["代词总览与分类", null],\r\n  ["反身代词", null],';
if (e.indexOf(oldM) < 0) throw new Error("映射未命中");
e = e.split(oldM).join(newM);
fs.writeFileSync(ep, e, "utf8");
console.log("② 渲染 + 映射完成");
