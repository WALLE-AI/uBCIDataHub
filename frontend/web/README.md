# BCI DataHub 门户原型

## 本地预览

从项目根目录运行：

```powershell
node frontend/web/scripts/serve.mjs
```

打开 `http://127.0.0.1:4173`。页面采用原生 HTML、CSS 与 JavaScript 模块，无运行时第三方依赖。请通过 HTTP 访问，直接双击 HTML 时浏览器可能限制模块加载。

## 页面与架构图

- `门户设计.html`：首页、场景、质量示例、五层技术架构、合作入口。
- 首页首屏明确“脑机接口高质量数据集平台”定位；`#capabilities` 六项能力展示输入、功能、交付与流程示例；`#solutions` 展示医院、科研与产业用户路径，以及本地、云端、混合部署。
- `数据资源.html`：关键词、组合筛选、排序、分页及 URL 状态恢复。
- `数据集详情.html?id=stroke-mi`：合成样例预览与下载、资源结构、质量限制、使用条件、版本与原始来源。
- `使用指南.html`：结构、评估、接入及原型边界说明。
- 首页 `#standards`：两项国标与 BIDS 卡片直达官方原文；平台白皮书尚未编制，标为筹备中、名称暂定，不提供预览。
- `documents/*.html`：四份独立阅读页，支持打印 / 另存为 PDF；禁用 JavaScript 时首页链接仍能进入阅读页。
- `门户设计-原始参考.html`：改造前的门户文件。
- `脑际接口高质量数据产品调研.html`：原始调研，未改动。
- `assets/神经信号基础模型-五层技术架构.svg`：独立可缩放技术架构图，可直接打开、下载或编辑。
- `assets/神经信号基础模型-五层技术架构.png`：浏览器验证脚本生成的位图导出。

五层图展示模型服务、评估基准、预训练与微调、数据供给和算力调度；层间标出交付制品，右侧标出贯穿治理能力。图中接口属于目标契约，不表示实际服务已实现。

## 更新与验证

生成源为 `scripts/build-portal.mjs`，真实外部资源目录为 `assets/datasets.js`，标准与白皮书内容为 `assets/standards.js`。重新生成会更新四个门户页面、四个文档阅读页、SVG 和六套合成样例，不覆盖已经保留的原始参考文件。

## 样例数据

六个场景均在资源卡片提供“预览样例”入口，详情页 `#sample-data` 支持通道切换、时间窗口、事件定位及数值表格。`samples/<资源ID>/` 各有 `signal.csv`、`events.csv`、`sample.json` 和 `README.txt`，可直接下载。共24个文件，约1.3 MB。

样例全部由 `scripts/build-samples.mjs` 确定性生成，12秒、256 Hz，通道与演示事件按场景区分。它们不是原始研究数据片段，不包含患者信号，也不继承外部数据的许可；只用于页面交互与文件解析测试。页面、CSV行、JSON元数据及说明文件均标注合成来源。样例参数不用于补全外部资源的未知元数据。

```powershell
node frontend/web/scripts/build-portal.mjs
node frontend/web/scripts/verify-data.mjs
```

浏览器验证需要本机 Microsoft Edge 和开发依赖，先启动本地预览服务，再运行：

```powershell
npm.cmd ci --prefix frontend/web --ignore-scripts --no-audit --no-fund
node frontend/web/scripts/verify-ui.mjs
node frontend/web/scripts/verify-standards.mjs
node frontend/web/scripts/verify-capabilities.mjs
node frontend/web/scripts/verify-samples.mjs
```

验证脚本覆盖搜索筛选、URL 与详情返回、分页、空状态、申请校验、模拟失败重试、移动端导航、减少动效和无脚本阅读。脚本同时导出架构 PNG，在根目录 `.build/portal-review/` 保存截图与验证结果。

标准入口验证覆盖四张卡片的原文目标、新窗口打开、无中间弹窗、移动布局与本地白皮书正文。外部网络在本地交互测试中拦截，仅验证跳转目标；官网预览行为受官方服务控制。

能力展示内容来自 `assets/capabilities.js`，交互位于 `assets/capability-interactions.js`，样式位于 `assets/capabilities.css`。能力切换支持键盘、可分享的锚点链接和无脚本阅读；咨询入口会带入当前能力的建设需求。来源对应关系见 `平台能力设计映射.md`。

首页直接链接原文，不经过本地题录说明页。原有本地标准阅读说明作为参考文件保留。两项国标名称、日期和状态于 2026-11-16 核对。平台白皮书尚未编制，先前自动整理的正文已移除，旧地址仅展示筹备状态。

## 原型边界

所有数据集、人数、时长与质量结果均为演示数据。申请仅在页面内演示，不发送信息、不保存联系方式，也不生成真实受理编号。目录中“开放资源”没有实际信号文件，其按钮指向明确的下载说明。真实目录、认证、授权、审批和模型服务需另行接入与验收。
