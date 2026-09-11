# ⚠️ 数据安全红线（Data Safety Rules）— 改本仓库代码前必读

> 本文件是**最高优先级约束**，优先级高于任何功能需求、优化建议或"顺手改动"。
> 任何 AI 模型、开发者、工具修改本仓库（`E:\htdocs\studyc`）代码时，**必须先完整读取本文件**，
> 改完后**必须运行验证命令**（见文末）。违反红线 = 事故，不是 bug。

---

## 一、为什么有这个文件（历史教训，不许重演）

学习数据（闯关进度、金币、错题本、打卡、真题等）存在**浏览器 localStorage**，是用户花了几个月积累的资产。

发生过的事故：
1. **空数据覆盖写回**：`loadCurrentUser()` 在"当前用户不存在"时曾无条件 `saveS()`，
   用空对象覆盖真实存档 → 用户进度全部清空。
2. **升级迁移连坐**：`loadDB()` 解析/迁移异常被 `catch` 静默吞掉 → 返回空库 →
   `ensureDefaultUser()` 建空用户 → 空库覆盖 localStorage → 旧数据被冲掉。
3. **修复不防呆**：只修了"users[current] 存在性检查"，没堵"空库写回""异常静默返回空"等同类路径。

**结论：任何"数据可能为空/异常/不存在"的代码路径，都必须先保护、后写回，宁可拒绝写，不可覆盖丢。**

---

## 二、铁律（绝对禁止，违反即事故）

| # | 禁止事项 | 为什么 |
|---|---------|--------|
| 1 | **禁止用空数据覆盖已有存档**：任何写主存档（`KEY = "cppsAdventureV2"`）的路径，如果内存中存档是空库/空壳用户，而 localStorage 里已有真实数据，**必须拒绝写入**（已有 `saveS()` 空库写保护，不得绕过/删除） | 空覆盖 = 数据永久丢失 |
| 2 | **禁止静默吞掉解析/迁移异常后返回空库**：`loadDB()` 必须保留 `__DB_LOAD_ERROR__` 标记，异常时不得继续走"建默认用户 + 写回"流程 | 异常 = 数据可能还在，不能当没有 |
| 3 | **禁止在 `saveS()` 之外裸写主存档**：不允许出现 `localStorage.setItem(KEY, ...)` 绕过 `saveS()`（`saveS()` 内含空库保护、快照、云钩子三道闸） | 绕过保护 = 回归事故 |
| 4 | **禁止删除主存档或清空 localStorage**：不得出现 `localStorage.removeItem(KEY)`、`localStorage.clear()` 且无"先备份 + 用户确认" | 删除是最不可逆的操作 |
| 5 | **禁止把空数据写进备份**：快照（`bkupNow`）、云端上传（`csPush`）都必须先做 `dbHasReal()` 检查，空数据不许进备份、不许覆盖云端 | 否则 12 份快照被空数据占满，恢复入口报废 |
| 6 | **禁止覆盖类操作不留后悔药**：恢复快照、导入文件、云端恢复覆盖本机前，必须先 `bkupNow("pre-xxx", true)` 留当前状态一份 | 用户恢复错了能反悔 |
| 7 | **禁止把"空壳账号"当成"有数据"**：`csHasLocalData()` 等判断必须用 `dbHasReal()`（空 `passed` 的账号不算真实数据） | 否则空设备不会触发自动恢复 |

## 三、必须做法（每个改代码的模型都要做到）

1. **写主存档只能走 `saveS()`**，`saveS()` 里的三道闸（空库写保护 → localStorage 写入 → 快照+云钩子）任何一道都不能删。
2. **版本升级（migrate）必须向后兼容**：老格式数据要能无损迁移到新格式；迁移失败 → 置 `__DB_LOAD_ERROR__` → 保护原始数据 → 提示用户去恢复，**绝不静默当空**。
3. **新增 localStorage 键要进快照**：`bkupNow` 自动备份全部键（除 `sc_cloud`），新键无需额外处理；但新键若有敏感内容，要在 `bkupNow`/`csSnapshot` 里排除。
4. **判断"有没有数据"一律用 `dbHasReal()`**（`state.js` 定义，全局可用），不要自己写 `users.length > 0` 之类的简化判断。
5. **改完数据相关代码，必须跑：**
   ```
   cd cpp-adventure && npm test
   node build/check-data-safety.js   ← 空库写保护/迁移异常/快照防呆功能实测（模拟浏览器）
   node build/validate-oj.js
   node build/merge.js
   ```
   其中 `npm test` 内含 `tests/data-safety.test.js` 数据安全静态校验，**任何一条失败 = 改动被否决**。
6. **动 `state.js` / `sync.js` / `cloud-sync.js` / `user.js` / `init.js` 任何一个文件时**，默认假设自己是"最后一个犯错的人"，先读本文件，再读 `src/scripts/core/state.js` 全文件，想清楚每条写回路径再动手。

## 四、数据存储地图（改代码前先认清）

| 存储 | 键/位置 | 内容 | 备注 |
|------|---------|------|------|
| localStorage 主存档 | `cppsAdventureV2`（旧版 `cppsAdventureV1`） | 全部账号的学习进度（SDB） | 唯一主仓库，写入必须走 `saveS()` |
| localStorage 其他键 | `cppsOjV1`/`cppsOjCustomV1`（真题）、`studentCheckIn*`（打卡）、`ba_*`（题库）、`sc_cloud`（云端配置）等 | 各功能数据 | `sc_cloud` 不进快照/云端快照 |
| IndexedDB 快照 | 库 `sc_snapshots` / 表 `snaps` | localStorage 全量快照，保留最近 12 份 | 自动每 30 秒一次；恢复/导入前强制留底 |
| 云端（可选） | Cloudflare Worker + KV（用户配置 `sc_cloud`） | 全量快照，防换设备/清缓存 | 空数据禁止上传覆盖云端 |

## 五、已加固的防线（现状，勿回退）

- `saveS()`：空库写保护（`dbHasReal` 判定，拒绝空覆盖 + 记录现场快照）
- `loadDB()` / `loadCurrentUser()` / `ensureDefaultUser()`：迁移异常 → `__DB_LOAD_ERROR__` → 不建空用户、不写回、提示恢复
- `bkupNow()`：非强制模式空数据不存快照（防占满 12 份）；`bkupList()` 返回每份快照的账号/关卡概要
- `sync.js`：恢复快照 / 导入文件前自动留底（`pre-restore` / `pre-import`）
- `cloud-sync.js`：`csHasLocalData` 用 `dbHasReal`；`csPush` 空数据不上传
- `user.js`：`doLogin` 在 `__DB_LOAD_ERROR__` 时禁止新建账号

## 六、恢复数据操作指引（写给用户/模型）

数据意外清空时，按顺序尝试（无需技术背景）：
1. 打开网站 → 点 **☁️ 同步** → **本地自动备份** → 看快照列表（每份标注"账号数 · 已过关数"）→ 点「恢复」；
2. 没快照 → 找电脑上下载过的存档文件（`studyc-*.json` / `cpp冒险存档_*.json`）→ ☁️ 同步 → **从文件导入**；
3. 配置过云端 → ☁️ 同步 → **☁️ 云端同步** → **从云端恢复**；
4. 以上都没有 → 数据无法找回（所以备份/防呆比什么都重要）。

---

*本文件与 `cpp-adventure/src/scripts/core/state.js` 配套生效。修改任何一方，另一方必须同步审视。*
