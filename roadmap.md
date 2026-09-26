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

### Phase 0：基础设施 — ✅ 完成
- [x] 摸清现状与社区主题情报
- [x] git init + 基线提交（分支 feat/liquid-glass-theme，远程 EVENYYF/flare-stack-blog；只推分支不碰 main，不触发部署）
- [x] 拉取 4 个参考主题
- [x] 对比分析（结论见"融合方案"）

### Phase 1：视觉升级（核心） — ✅ 完成
- [x] SVG `feDisplacementMap` 边缘折射（GlassFilter 组件 UA 检测 Chromium 后加 .lg-refract；社区无人做过，独家）
- [x] 亚像素 inset 镜面边缘光 + conic-gradient 棱镜色散边环
- [x] blur 28→14（折射开启时再减半）、透明渐变底替代 0.58 白底
- [x] 背景四色光斑 46s 缓慢漂移
- [x] 卡片鼠标跟随光晕（--lg-mx/--lg-my）+ ±5° 3D 倾斜 + 按压回弹
- [ ] 浏览器实际视觉验收（bun dev 后人工确认）

### Phase 2：评论区 — ✅ 完成（复用策略）
- [x] 直接 import default 主题 CommentSection（postId 自取数据），套 lg-glass 容器
- [ ] 后续可选：逐组件换玻璃皮

### Phase 3：功能补全 — ✅ 完成
- [x] TOC（复用 default TableOfContents，headers=post.toc，xl 屏浮动侧栏）
- [x] 相关文章（复用 default RelatedPosts + Suspense）
- [x] 图片缩放（ImageDisplay 内嵌 default ZoomableImage）
- [ ] 注册页去占位（视上游功能而定，暂缓）

### Phase 4：验证与收尾 — ✅ 完成
- [x] typecheck / biome lint / vitest 175 tests / vite build 全绿
- [ ] 视情况：向上游提 PR 或学 xinghui 发独立主题仓库+演示站

## 融合方案

对比结论（详见 git 历史中的分析）：
- **没有任何社区主题用了 feDisplacementMap 折射** → 这是 liquid-glass 的独家差异化
- WindGlass（最直接对手）配方：透明渐变底 + blur 18-20 + saturate(200%) brightness(1.15) + 0.5px 边框 + 亚像素 inset 高光 + conic 棱镜边环 + 四色 ambient 背景 → 已吸收进 v2
- amazing：鼠标跟随 ±15° 3D 倾斜 + --highlight-x/y 光晕跟踪 → 已收敛为 ±5° 吸收
- cuckoo/xinghui：常规 glassmorphism（blur 12px 变量化），无新招
- 评论区接线：default 的 CommentSection 只需 postId 自取数据，TOC 用 post.toc，RelatedPosts 用 slug + Suspense → 直接跨主题 import 复用

## 会话恢复指引

1. 读本文档 + `git log --oneline -20`
2. 用 Claude Code 的 TaskList 查任务状态（任务 #1-#7 对应上述 Phase）
3. 参考主题代码在 `F:\MY_CHERRY_WORKSPACE\theme-references\`（不在本仓库内，避免干扰构建）
