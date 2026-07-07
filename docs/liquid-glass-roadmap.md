# Liquid Glass 主题开发路线图

> 本文档是分段开发的进度锚点：任何会话中断后，读本文档 + `git log` 即可恢复上下文继续开发。
> 每完成一小步就 git commit；每完成一个 Phase 就更新本文档的进度标记。

## 背景

- 本项目 fork 自 [du2333/flare-stack-blog](https://github.com/du2333/flare-stack-blog)（上游只有 default / fuwari 两个主题）
- 自研 `liquid-glass` 主题（`src/features/theme/themes/liquid-glass/`）目标：Apple 2025 WWDC Liquid Glass 视觉风格
- 现状自评"效果一般"：当前实现是传统 glassmorphism（blur 28px + 半透明白底 + 白色高光叠层），缺折射、边缘光、交互形变
- 主题开发规范见 `docs/theme-guide.md`（Theme Contract）

## 参考主题（拉取到 `F:\MY_CHERRY_WORKSPACE\theme-references\`）

| 主题 | 来源 | 值得借鉴 |
|------|------|----------|
| WindGlass | MarkJun236/flare-stack-blog @ feat/theme-WindGlass（PR #115 开放中） | 同为液态玻璃风、功能完整（评论/友链/认证）、光晕交互、打字机效果 |
| xinghui | yu7398133/flare-stack-blog-theme-xinghui @ main（独立主题仓库） | glassmorphism 实现、独立仓库+演示站的发布模式 |
| amazing | ujnxs123/flare-stack-blog-lucifer @ dev0（PR #102 未合并） | 磁吸液态光标、Canvas 粒子背景、3D 玻璃倾斜卡片、极光背景等 15+ 动画 |
| Cuckoo | SkyDream01/flare-stack-blog @ dev（PR #61 未合并，死于 CI） | 玻璃态设计、动态背景；教训：CI 必须过 |

## 阶段计划与进度

### Phase 0：基础设施 — ⏳ 进行中
- [x] 摸清现状与社区主题情报
- [ ] git init + 基线提交
- [ ] 拉取 4 个参考主题
- [ ] 对比分析产出融合方案（补充到本文档"融合方案"一节）

### Phase 1：视觉升级（核心） — ⬜ 未开始
- [ ] SVG `feDisplacementMap` 位移滤镜实现边缘折射（Chromium `backdrop-filter: url()`；Safari/Firefox 降级回 blur 方案）
- [ ] 多层 inset box-shadow 镜面边缘光
- [ ] 降 blur（28px → 8-12px）、降白色高光叠层（::before opacity 0.72 过重），消除"白雾感"
- [ ] 背景增加缓慢漂移的彩色光斑（玻璃后要有内容可折射）
- [ ] 指针交互：hover 光泽跟随、按压形变
- 验收：与 WindGlass 截图 / xinghui 演示站对比，折射感明显优于纯 blur

### Phase 2：评论区 — ⬜ 未开始
- [ ] 参考 default 主题 11 个评论组件 + WindGlass 的适配方式接入
- [ ] 文章页 `pages/post/page.tsx`（现 78 行 vs default 209 行）挂载评论区
- 策略：先复用逻辑跑通，再套玻璃皮

### Phase 3：功能补全 — ⬜ 未开始
- [ ] 文章目录 TOC（参考 default `table-of-contents.tssx`）
- [ ] 相关文章（config 已配 `relatedPostsLimit: 3`，页面未渲染）
- [ ] zoomable-image 图片缩放
- [ ] 注册页去占位（视上游功能而定）

### Phase 4：验证与收尾 — ⬜ 未开始
- [ ] lint / typecheck / build / tests 全绿（对齐上游 CI，Cuckoo 主题就死在 CI）
- [ ] 视情况：向上游提 PR 或学 xinghui 发独立主题仓库+演示站

## 融合方案

（Phase 0 分析完成后填写）

## 会话恢复指引

1. 读本文档 + `git log --oneline -20`
2. 用 Claude Code 的 TaskList 查任务状态（任务 #1-#7 对应上述 Phase）
3. 参考主题代码在 `F:\MY_CHERRY_WORKSPACE\theme-references\`（不在本仓库内，避免干扰构建）
