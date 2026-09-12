const fs = require("fs");
const vm = require("vm");

const code = fs.readFileSync(__dirname + "/../src/scripts/modules/papers.js", "utf8");

// 模拟最小 DOM 环境
function makeElement(id) {
  return {
    id: id,
    innerHTML: "",
    style: {},
    className: "",
    classList: { add(){}, remove(){}, toggle(){} },
    setAttribute(){},
    getAttribute(){ return null; },
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    addEventListener(){},
    remove(){},
  };
}
const elements = {};
const sandbox = {
  console,
  localStorage: {
    _store: {},
    getItem(k){ return this._store[k] !== undefined ? this._store[k] : null; },
    setItem(k, v){ this._store[k] = String(v); },
    removeItem(k){ delete this._store[k]; },
    key(){ return null; },
    get length(){ return Object.keys(this._store).length; }
  },
  indexedDB: undefined,
  document: {
    getElementById(id){ if (!elements[id]) elements[id] = makeElement(id); return elements[id]; },
    querySelector(){ return makeElement("q"); },
    createElement(){ return makeElement("c"); },
    body: makeElement("body"),
  },
  window: { addEventListener(){}, },
  confirm: () => true,
  URL: { createObjectURL: () => "blob:x", revokeObjectURL(){} },
  Blob: function(){},
  FileReader: function(){},
  Audio: function(){},
  atob: (s) => Buffer.from(s, "base64").toString("binary"),
  setTimeout: () => 0,
  clearTimeout: () => 0,
  Promise,
  Date,
  JSON,
  Math,
  parseInt,
  parseFloat,
  String,
  Array,
  Object,
  IDBKeyRange: { bound(){ return {}; } },
};
sandbox.window = sandbox;
sandbox.indexedDB = undefined;

try {
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "papers.js" });

  // 场景1：无专题无试卷
  sandbox.ppRender();
  console.log("S1 (empty):", elements["ppList"] && elements["ppList"].innerHTML.slice(0, 60).replace(/\n/g, " "));

  // 场景2：建两个专题 + 3张试卷（2张归专题A，1张不归类）
  const cats = [ {id:"c1",name:"四年级上册专项试卷"}, {id:"c2",name:"期末冲刺"} ];
  sandbox.ppSaveCats(cats);
  const papers = [
    { id:"p1", name:"期中检测卷1", pages:7, pdfSize:2500000, audios:[{name:"a.mp3"}], catId:"c1" },
    { id:"p2", name:"期中检测卷2", pages:6, pdfSize:2100000, audios:[], catId:"c1" },
    { id:"p3", name:"月考试卷", pages:4, pdfSize:900000, audios:[], catId:"" },
  ];
  sandbox.ppSaveMeta(papers);
  sandbox.ppRender();
  const html = elements["ppList"].innerHTML;
  console.log("S2 blocks:", (html.match(/pp-cat-block/g) || []).length, "expected 3");
  console.log("S2 has c1:", html.includes("四年级上册专项试卷"), "| has c2 shown?:", html.includes("期末冲刺"));
  console.log("S2 cards:", (html.match(/pp-card-main/g) || []).length, "expected 3");
  console.log("S2 uncat:", html.includes("未归类"));

  // 场景3：改试卷的专题
  sandbox.ppModifyCat("p3", "c2");
  sandbox.ppRender();
  const html3 = elements["ppList"].innerHTML;
  console.log("S3 c2 now has card:", (html3.match(/期末冲刺/g) || []).length > 0, "| uncat gone:", !html3.includes("未归类"));

  // 场景4：添加试卷时读专题下拉选项
  const catOpts = sandbox.ppCatOptionsHTML();
  console.log("S4 cat options:", catOpts.length, "opts, has both cats:", catOpts.includes("四年级上册专项试卷") && catOpts.includes("期末冲刺"));

  console.log("ALL TESTS DONE");
} catch (e) {
  console.error("ERROR:", e.message);
  console.error(e.stack);
}