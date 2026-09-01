# 代码小指挥官 · C++ 星际冒险

面向四年级零基础小学生的 C++ 信息学闯关学习系统。三阶段冒险地图、23 个关卡、徽章鼓励、捉 Bug 游戏与赛事航路。

## 快速开始

```bash
# 开发期：直接用浏览器打开多文件版本
cpp-adventure/src/index.html

# 交付合并：生成单文件产物到 dist/
node cpp-adventure/build/merge.js
# → dist/index.html（单文件、零依赖、离线可打开）
```

## 目录结构

```
cpp-adventure/
├── src/                        # 开发期源码（多文件）
│   ├── index.html              # HTML 骨架，引用外部 css/js
│   ├── styles/
│   │   └── main.css            # 全部样式（CSS 变量主题化）
│   └── scripts/
│       ├── data/
│       │   └── levels.js       # 23 关数据（三阶段）
│       ├── core/
│       │   ├── state.js        # 多用户状态 + localStorage 持久化
│       │   └── init.js         # 启动入口
│       └── modules/
│           ├── map.js          # 冒险地图渲染 + 关卡弹层
│           ├── keyboard.js     # 键盘指法训练
│           ├── focus.js        # 专注模式
│           ├── user.js         # 登录/切换/存档导入导出
│           ├── tabs.js         # 训练面板 Tab 切换
│           ├── errors.js       # 错题本
│           ├── english.js     # 编程英文（27 个 C++ 关键字）
│           ├── typing.js       # 打字热身
│           ├── math.js         # 数学脑力
│           ├── plan.js         # 家长规划问卷
│           ├── road.js         # 赛事航路
│           └── log.js          # 学习记录
├── build/
│   ├── split.js                # 拆分脚本（单文件 → 多文件）
│   └── merge.js                # 合并脚本（多文件 → 单文件）
└── dist/                       # 交付产物（单文件）
    └── index.html
```

## 关卡内容

| 阶段 | 关卡数 | 内容 |
|------|--------|------|
| 一 · 语法筑基 | 8 | 飞船/变量/cin/算术/if/switch/for/while |
| 二 · 算法入门 | 9 | 数组/字符串/枚举/模拟/排序/查找/进制/递归/模拟赛 |
| 三 · 小初衔接 | 6 | 找最大/二维数组/栈/队列/结构体/贪心 |

每关含：生活比喻讲解 + 教材对应 + 示例代码 + 捉 Bug 任务 + 10 题闯关测验。

## 设计契约

详见 `.design-suite/contract.json`：产品定位、7 区段规范、设计令牌（色彩/字体/形状/动效）、WCAG2.1 AA 无障碍目标、6 档响应式视口矩阵。

## 技术栈

- 原生 HTML + CSS + JavaScript（无框架、无构建依赖）
- 浏览器 localStorage 多用户持久化
- 零运行时依赖，离线可用

## 验证

```bash
# 语法检查所有 JS 模块
Get-ChildItem cpp-adventure/src/scripts -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }

# 关卡内容校验
node cpp-adventure/build/validate-levels.js
```