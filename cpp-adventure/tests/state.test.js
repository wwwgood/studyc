const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createMockDOM, loadScripts } = require("./helpers");

function freshContext(store) {
  const mock = createMockDOM();
  if (store) Object.assign(mock.localStorage._store, store);
  const ctx = loadScripts(["data/levels.js", "core/state.js"], mock);
  return { mock, ctx };
}

test("新用户返回空数据库", () => {
  const { ctx } = freshContext(null);
  assert.equal(Object.keys(ctx.SDB.users).length, 0);
  assert.equal(ctx.SDB.current, null);
  assert.equal(ctx.SDB.schemaVersion, ctx.SCHEMA_VERSION);
});

test("V2 存档（无 schemaVersion）自动迁移到 V3", () => {
  const v2Data = {
    users: { "小明": { passed: { 1: true, 2: true }, mathScore: 10 } },
    current: "小明",
  };
  const { ctx } = freshContext({ cppsAdventureV2: JSON.stringify(v2Data) });
  assert.equal(ctx.SDB.schemaVersion, 3);
  assert.equal(ctx.SDB.current, "小明");
  assert.equal(ctx.SDB.users["小明"].passed[1], true);
  assert.ok(Array.isArray(ctx.SDB.users["小明"].logs), "迁移后应有 logs 数组");
  assert.ok(Array.isArray(ctx.SDB.users["小明"].errors), "迁移后应有 errors 数组");
  assert.ok(ctx.SDB.users["小明"].fp, "迁移后应有 fp 对象");
});

test("V1 存档（单用户格式）迁移到 V3 多用户格式", () => {
  const v1Data = { passed: { 1: true }, mathScore: 5 };
  const { ctx } = freshContext({ cppsAdventureV1: JSON.stringify(v1Data) });
  assert.equal(ctx.SDB.schemaVersion, 3);
  assert.equal(ctx.SDB.current, "指挥官");
  assert.ok(ctx.SDB.users["指挥官"], "V1 数据应迁移到'指挥官'用户");
  assert.equal(ctx.SDB.users["指挥官"].passed[1], true);
});

test("V3 存档（已有 schemaVersion）不重复迁移", () => {
  const v3Data = {
    users: { "小红": { passed: { 3: true }, logs: [{ t: "test" }], errors: [], fp: { ok: 5, err: 1 } } },
    current: "小红",
    schemaVersion: 3,
  };
  const { ctx } = freshContext({ cppsAdventureV2: JSON.stringify(v3Data) });
  assert.equal(ctx.SDB.schemaVersion, 3);
  assert.equal(ctx.SDB.users["小红"].logs.length, 1);
  assert.equal(ctx.SDB.users["小红"].logs[0].t, "test");
});

test("saveS 持久化到 localStorage", () => {
  const { ctx, mock } = freshContext(null);
  ctx.SDB = { users: { "测试": { passed: { 1: true } } }, current: "测试", schemaVersion: 3 };
  ctx.S = ctx.SDB.users["测试"];
  ctx.saveS();
  const saved = JSON.parse(mock.localStorage._store.cppsAdventureV2);
  assert.equal(saved.current, "测试");
  assert.equal(saved.users["测试"].passed[1], true);
  assert.equal(saved.schemaVersion, 3);
});

test("损坏的存档数据优雅降级", () => {
  const { ctx } = freshContext({ cppsAdventureV2: "not-json" });
  assert.equal(Object.keys(ctx.SDB.users).length, 0);
  assert.equal(ctx.SDB.current, null);
});

test("starsOf 返回通关数", () => {
  const { ctx } = freshContext(null);
  ctx.S = { passed: { 1: true, 2: true, 3: true } };
  assert.equal(ctx.starsOf(), 3);
});

test("lvOf 等级计算", () => {
  const { ctx } = freshContext(null);
  assert.equal(ctx.lvOf(0), 1);
  assert.equal(ctx.lvOf(5), 2);
  assert.equal(ctx.lvOf(25), 6);
  assert.equal(ctx.lvOf(100), 8);
});

test("isPassed 和 isLocked 逻辑", () => {
  const { ctx } = freshContext(null);
  ctx.S = { passed: { 1: true } };
  assert.equal(ctx.isPassed(1), true);
  assert.equal(ctx.isPassed(2), false);
  assert.equal(ctx.isLocked(0), false, "第一关永远不锁");
  assert.equal(ctx.isLocked(1), false, "第二关在第一关通过后不锁");
  assert.equal(ctx.isLocked(2), true, "第三关在第二关未通过时锁定");
});