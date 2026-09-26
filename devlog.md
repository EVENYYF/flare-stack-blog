# Liquid Glass 主题开发日志

> 规则：每轮开发结束后追加一节，记录做了什么、为什么、踩了什么坑。
> ⚠️ 本文件与 roadmap.md 存放于**仓库外**（F:\MY_CHERRY_WORKSPACE\liquid-glass-dev\），
> 因为仓库内的开发文档曾被协作 agent 误删。仓库内只保留主题本体文件。
> 配套：[roadmap.md](./roadmap.md)（阶段计划）· 开发分支 feat/liquid-glass-theme · 推送分支（另一 agent 维护）feat/liquid-glass-theme-clean

## 2026-07-06 · Phase 0：情报与基建

- 摸底：主题骨架完整但自评"效果一般"——本质是传统 glassmorphism（blur 28px + 白雾叠层），缺 Apple Liquid Glass 的折射/边缘光/交互形变
- 调研社区：上游 708★ 只带 default/fuwari；社区 4 个第三方主题全部拉到 `theme-references/` —— WindGlass（PR #115 开放中，最直接对手，玻璃风+功能全）、Cuckoo（PR #61 死于 CI）、amazing（PR #102 未合并，动画库）、xinghui（独立仓库+演示站）
- **关键发现：没有任何社区主题做了 SVG 位移滤镜折射 → 定为本主题的差异化主打**
- 基建：git init → 基于 fork main 建 `feat/liquid-glass-theme` 分支 → 推送 EVENYYF/flare-stack-blog；确认 deploy.yml 只在 push main 时部署，**开发分支零风险**

## 2026-07-07 · v2：玻璃材质重写 + 功能补全

提交 `4f568a1`、`c09f106`：

- 折射 v1：`feTurbulence + feDisplacementMap`（噪声波纹式），GlassFilter 组件 UA 检测 Chromium 加 `.lg-refract`
- 配方重写（吸收 WindGlass）：透明渐变底替代 0.58 白底、blur 28→14、`saturate(1.9) brightness(1.12)`、亚像素 inset 边缘光、conic 棱镜边环
- 背景：四色光斑 46s 漂移（玻璃后要有东西可折射）
- 交互（吸收 amazing 并收敛）：卡片 ±5° 3D 倾斜 + 光晕跟随（--lg-mx/--lg-my）
- 功能：评论区/TOC/相关文章/图片缩放，全部跨主题 import default 组件套玻璃壳，先能用后换皮
- 验证：typecheck/lint/175 tests/build 全绿（Cuckoo 死于 CI 的前车之鉴）

## 2026-07-07 · v3 / v3.1：透镜化与液态过渡

提交 `0088261`、`1bb741b`：

- **真透镜折射**：位移图从噪声换成径向编码（R=X 位移、G=Y 位移、中心 72% 中性）——边缘弯折、中心通透
- **物理色散**：R/G/B 三通道 36/42/48 差异位移后 arithmetic 合成，边缘出现真实彩虹色散
- 光带扫过（specular sweep）、果冻按压（不等比 squish）、`content-visibility` 滚动优化
- **液态形变过渡**：卡片与文章页头部共享 `post-hero-*` viewTransitionName + `view-transition-class` 圈定（避免波及 root），点卡片时玻璃面板形变放大成文章头
- 教训：`::view-transition-group(*)` 全局选择器会让整页快照圆角闪烁，必须用 class 圈定

## 2026-07-07 · 本地预览环境（踩坑实录）

- wrangler 要登录 → `CLOUDFLARE_REMOTE_BINDINGS=false` 走本地 Miniflare + `db:migrate:local`
- paraglide 产物残缺致依赖扫描失败 → `bun run i18n:compile` 重编（1215 文件）
- Node 默认堆 1.4G OOM → `NODE_OPTIONS=--max-old-space-size=6144` + 清 node_modules/.vite；dev server 偶发崩溃，重启即可
- 测试数据：注册 admin@test.local 后直改 D1 提权；发布走 CF Workflow 本地不执行 → 直改 D1（**published_at 单位是秒**，存毫秒会变成"公元 5 万年定时发布"而 404）+ public_content_json=content_json + 清 KV 缓存
- 完整启动命令：`THEME=liquid-glass CLOUDFLARE_REMOTE_BINDINGS=false NODE_OPTIONS=--max-old-space-size=6144 bun run dev`

## 2026-07-08 · 登录表单"缺失"的真相

- 现象：登录页只有 GitHub 按钮 → 初判"主题没做邮箱表单"，**错**
- 真相：表单一直都在，被 `isEmailConfigured` 门控（system_config 需配齐 email.host/username/password/senderAddress，上游设计：发不了验证邮件就不开邮箱登录）
- 解法（零代码改动）：本地 D1 插假 SMTP 配置 + 清 "system" KV 缓存键；浏览器实测邮箱登录全流程通过
- 注意：假 SMTP 发不了真邮件，本地注册验证/忘记密码流程走不通属正常

## 2026-07-08 · 协作分工与文档迁移

- 用户引入另一个"主题整理 agent"：它建了 `feat/liquid-glass-theme-clean` 分支负责**直接推送主题**，期间切走了工作目录分支并使开发文档"消失"
- 应对：开发文档（devlog/roadmap/截图）全部迁至仓库外 `F:\MY_CHERRY_WORKSPACE\liquid-glass-dev\`；我的开发分支 `feat/liquid-glass-theme` 用 `git rm` 移除仓内文档（提交 f9f19c1）
- **分工约定：我在 feat/liquid-glass-theme 上开发；clean 分支归整理 agent，我不碰；开发环境类文件（测试数据脚本、假 SMTP、本地库操作）一律不进主题提交**

## 2026-07-08 · v4：界面完善

提交 `f9f19c1`（文档迁出）、`dba8296`：

- 注册页：去掉"暂未开放注册"占位，按契约实现完整表单（昵称/邮箱/密码/确认密码、isSuccess 成功态、turnstilePending 禁用）
- 文章页：玻璃返回顶部按钮 + SVG 阅读进度环（滚动 >400px 浮现）
- 导航栏滚动收缩：h-16→h-12、max-w-6xl→4xl（iOS 风格）
- 骨架屏：animate-pulse → 玻璃高光带 shimmer（.lg-shimmer）
- 移动端：touchstart 触点光晕（.lg-touched，650ms 自动消退）
- 坑：另一 agent 的分支切换动了 vite.config.ts → vite 热重启丢了本地模式开关，卡"wrangler 登录"重启循环 → 杀进程重启解决
- 验证：typecheck/lint/175 tests 全绿；注册页/导航栏浏览器实测正常

## 2026-07-08 · v5：用户反馈修复（部署实用性）

提交 `55c8d0f`。用户部署到真实博客后反馈的两个问题：

- **hero 硬编码文案**：主页"像 iPhone 玻璃一样轻盈的阅读界面"是写死的 → 全部改为消费 `siteConfig`（`useRouteContext({ from: "__root__" })`）：hero 标题=站点名、描述=站点描述、eyebrow=作者；导航栏品牌与圆标 logo 也改为站点名（取前 2 字）；footer 改为 © 年份·站点名·作者 + Powered by
- **缺夜间模式切换**：复用项目公共 `ThemeToggle`（自带 clip-path 圆形扩散过渡、亮/暗/跟随系统三态），套 lg-control 玻璃壳放进导航栏，顺手替换了原先没有 onClick 的 Menu 死按钮
- 实测：切换后 html class 在 light/dark 间正确变化，深色玻璃截图存 screenshots/dark-mode.png
- 经验：主题里任何面向访客的文案都必须走 siteConfig 或 paraglide i18n，不允许硬编码

## 2026-07-08 · v6 / v6.1：评论区玻璃换皮 + 无障碍

提交 `a3caac0`、`a782199`：

- 评论区脱离 default 皮：11 个组件复制进 `liquid-glass/components/comments/` 自持，逻辑零改动
- 换皮清单：编辑器容器（rounded-[22px] 玻璃）、工具栏（胶囊玻璃）、插入弹窗（lg-glass 面板）、评论卡高亮/头像/分隔线（白基色 hairline）、折叠回复条（胶囊）、全部按钮（lg-control）
- 意外之喜：comment-render 引 `../../content/image-display` → 评论里的图片自动获得玻璃相框+点击缩放
- 键盘焦点环：lg-control / lg-glass-interactive 的 :focus-visible 显式 outline（玻璃件默认 outline 不可见）
- 实测：管理员登录发评论成功，玻璃样式截图 screenshots/comments-glass.png
- 移动端复核（代码层）：底部导航 bottom-3 + BackToTop bottom-24 无重叠
- 工艺备忘：批量换皮用 sed 精确串替换比逐文件 Edit 快得多；`&` 在 sed 替换串里要转义

## 待办池

- [ ] 候选花活（做成可选）：磁吸液态光标、全屏搜索圆形扩散、打字机
- [ ] 移动端真机/视口截图验证（agent-browser viewport 命令这版不可用）
- [ ] 性能抽查：低端机大量 backdrop-filter 的滚动帧率
- [ ] 收尾：向上游提 PR（对照 PR #115 WindGlass 的规格）或独立主题仓库+演示站

## 2026-07-09 · 主题发布同步至 clean 分支

- 应用户要求，把最新主题（v6.1）同步到 `feat/liquid-glass-theme-clean` 分支（提交 `a35e1b2`），供合并进 main 部署
- 方法：`git checkout feat/liquid-glass-theme -- src/features/theme/themes/liquid-glass`——v3.1 之后所有演进都在主题目录内，一条命令即完整同步；clean 分支排除的上游杂项（login.tsx/vite.config 等）保持不动
- 合并即部署，故推送前跑了全套验证：typecheck / lint / 175 tests / build 全绿
- 流程沉淀：以后发布 = "checkout 主题目录 → 全套验证 → 提交 clean 分支"；若某轮改了主题目录外的接线文件（registry/blog.config/schema），同步时把那些路径一并列入

## 2026-07-09 · v6.2：线上玻璃失效根因修复（重要）

提交 dev `7843d26` / clean `1c174fb`。用户部署到 forone.cc.cd 后模糊/折射全无：

- **诊断弯路**：先误判"构建丢了整个主题 CSS"两次（坑1：压缩后 CSS 是单行，`grep -c` 按行计数恒为 1；坑2：验证构建没带 THEME=liquid-glass，检查的是 default 产物）
- **真根因（双重叠加）**：① lightningcss 压缩把手写的 `backdrop-filter` + `-webkit-backdrop-filter` 对"优化"成只剩 -webkit- 版；② Chrome 148 实测 `CSS.supports('-webkit-backdrop-filter')=false`（不支持该前缀别名）→ 线上零模糊零折射；本地 dev 不压缩故一切正常
- **修复**：源码只写标准 `backdrop-filter`，值装进变量（--lg-bf / --lg-bf-control），工具链自动补前缀 → 产物标准+前缀双属性并存；vite preview 生产实测 computed 恢复 `url(#lg-refraction) blur(7px) saturate(1.9)`
- **经验**：涉及浏览器前缀的属性一律只写标准版让构建链管前缀；验证生产表现必须 `THEME=xxx build + vite preview`，dev server 不可信
- 附带：BackToTop/阅读进度环从右下角移到右侧竖直居中（用户反馈右下角被误解为"页面底部"且移动端易被遮挡），隐藏动画改横向滑出
- 用户需重新合并 clean 分支部署生效

## 2026-07-09 · v6.3：级联层陷阱——主题类踩掉定位工具类

提交 dev `cf9018c` / clean `60a820e`。用户反馈进度环仍不悬浮、TOC 不吸附不可滚（线上排查于 forone.cc.cd）：

- **根因**：Tailwind v4 的工具类在 `@layer utilities` 里，我的主题 CSS 无层——**无层规则天然压过一切层内规则**，与特异性、书写顺序无关。`.lg-control{position:relative}`（光带扫过引入）踩掉进度环的 `fixed`；`.lg-glass{position:relative;overflow:hidden}` 踩掉 TOC 的 `sticky`。该 bug 从 v4 起就存在（dev 同样命中），当时没做滚动态实测漏掉了
- **第一次修复失败**：`:where()` 降特异性无效——无层 vs 有层的较量根本不看特异性
- **正确修复**：默认定位/裁剪声明移入 `@layer components { :where(...) }`（components 层在 utilities 之前）→ 工具类永远可覆盖；TOC 面板加 `max-h-[calc(100vh-9rem)] overflow-y-auto` 支持长目录内滚
- 生产 preview 实测：btn=fixed 贴视口右中、toc=sticky、overflowY=auto、折射完好
- **铁律**：主题基类只放视觉皮肤；定位/溢出这类"布局语义"要么进低优先级层，要么交给 markup。凡涉及滚动/吸附/悬浮的改动，必须 `THEME=xxx build + vite preview` 滚动态实测
