/*
 * 测试辅助：用 vm 加载 JS 模块并注入 mock 浏览器 API。
 * 这样可以在 Node.js 中测试依赖 DOM/localStorage 的模块。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function createMockDOM() {
  const store = {};
  const localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
    _store: store,
  };

  const elements = {};
  function createElement(tag) {
    const el = {
      tag, children: [], attributes: {}, style: {}, classList: {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); },
        toggle(c) { this._set.has(c) ? this._set.delete(c) : this._set.add(c); },
      },
      textContent: "", innerHTML: "", value: "",
      appendChild(c) { this.children.push(c); return c; },
      removeChild(c) { this.children = this.children.filter(x => x !== c); },
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      setAttribute: (k, v) => { this.attributes[k] = v; },
      getAttribute: (k) => this.attributes[k] ?? null,
      blur: () => {},
      focus: () => {},
      scrollIntoView: () => {},
    };
    return el;
  }

  const document = {
    _elements: elements,
    getElementById: (id) => elements[id] ?? null,
    createElement,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createTextNode: (t) => ({ textContent: t }),
  };

  return { localStorage, document, window: {} };
}

function loadScripts(filenames, mockDOM, extraGlobals) {
  const sandbox = {
    window: mockDOM.window,
    document: mockDOM.document,
    localStorage: mockDOM.localStorage,
    console,
    Math,
    Date,
    JSON,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
    Error,
    parseInt,
    parseFloat,
    isNaN,
    setTimeout,
    clearTimeout,
    Blob: function() {},
    URL: { createObjectURL: () => "mock://url", revokeObjectURL: () => {} },
    FileReader: function() {},
  };
  if (extraGlobals) Object.assign(sandbox, extraGlobals);
  vm.createContext(sandbox);
  const srcDir = path.join(__dirname, "..", "src", "scripts");
  for (const f of filenames) {
    const code = fs.readFileSync(path.join(srcDir, f), "utf8");
    vm.runInContext(code, sandbox, { filename: f });
  }
  return sandbox;
}

module.exports = { createMockDOM, loadScripts };