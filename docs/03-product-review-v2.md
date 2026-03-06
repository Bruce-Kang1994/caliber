# Caliber 全方位产品评审报告 V2

> **产品负责人视角 · 协同前端/UI/后端工程师**
> **对标 Exponent + Granola + 2026 SaaS设计规范**
> **评审日期**: 2026-03-04
> **代码审查基准**: Phase 1-3 全部 16 个任务已完成
> **项目路径**: `/Users/kangxin/Desktop/pm-assessment/`
> **技术栈**: Next.js 16.1.6 · React 19 · TypeScript · Tailwind 4 · Supabase · next-intl 4.8 · Recharts 3.7

---

## 一、产品名称与品牌

### "Caliber" — 评估结论：可用，不需要改

**优势：**
- 语义精准：caliber = 能力水准，直接映射产品核心（PM能力诊断）
- 短小好记，2音节，全球通用
- 天然造句："What's Your PM Caliber?" 有挑衅感，适合社交传播

**风险：**
- SEO竞争激烈（Caliber Financial、Dodge Caliber等同名产品），需靠长尾词 "PM capability assessment" 获客
- 中日韩用户对英文品牌名接受度高（tech产品常见），不构成障碍

**Tagline建议：**
- 当前 "What's Your PM Caliber?" 作为 Hero headline 保留
- 品牌层面增加一句通用 tagline："Measure. Grow. Land the Role."

---

## 二、产品定位（vs Exponent竞品分析）

### 定位地图

```
                     面试准备
                        |
                   [Exponent]
                   课程+题库+模拟面试
                        |
 社区/课程 ──────────────+──────────────── AI自动化
                        |
                   [Caliber]
                   AI诊断+个性化报告
                        |
                     自我认知
```

### 核心结论：Caliber和Exponent是互补关系，不是竞争关系

用户旅程：
1. "我想做PM / 升PM" → 意识觉醒
2. "我现在水平如何？" → **Caliber（诊断工具）**
3. "我需要补什么？" → Caliber报告告诉你
4. "怎么练习？" → **Exponent（训练工具）**
5. "我进步了吗？" → **Caliber（重新诊断）**

### Caliber的独特楔子（Exponent没有的）

| 能力 | Exponent | Caliber |
|------|----------|---------|
| 评估基于 | 知识测试（题库答题） | 真实经历（简历/项目） |
| 角色差异化 | 按公司分面试指南 | 15维度×5角色权重 |
| AI个性化 | 无 | 每次评估唯一结果 |
| 即时结果 | 需完成课程 | 5分钟出报告 |

### 定位文案建议

**当前**（en.json `landing.heroTitle`）：
> "Know Your PM Caliber Before Your Next Interview"

**问题**：`"Before Your Next Interview"` 限制了使用场景，很多PM是为职业成长而非面试

**建议改为**：
> "Know exactly where you stand — and what to do next — in 5 minutes"

涉及文件：4个locale文件的 `landing.heroTitle` 字段

---

## 三、功能完整度评估

> 以下基于对 pm-assessment 项目全部源码的逐文件审查，每个功能标注了实际实现位置和状态。

### 3.1 已完成功能 ✅

| # | 功能 | 实现位置 | 实现质量 | 备注 |
|---|------|---------|---------|------|
| 1 | **5角色选择** | `src/app/[locale]/assess/page.tsx` | 完整 | B2B/C2C/AI/Growth/Data PM，角色配置在 `constants.ts` PM_ROLES（6-42行） |
| 2 | **简历PDF上传+AI解析** | `src/app/api/parse-resume/route.ts` + `input/page.tsx` 55-105行 | 完整 | 用 pdf-parse 提取文本 → OpenAI/DeepSeek 解析结构化 → 自动填入表单 |
| 3 | **手动输入（渐进式展示）** | `input/page.tsx` 280-468行 | 完整 | 先显示基础信息（公司/职位/职责），点击"Add more detail"展开项目/成就区域（expandedExps状态控制） |
| 4 | **15维度AI评估** | `src/app/api/analyze/route.ts` + `src/lib/prompts.ts` | 完整 | Zod schema验证返回格式，15维度分数(1-5)、加权总分、优劣势列表等，错误时有fallback |
| 5 | **角色专属权重** | `constants.ts` ROLE_WEIGHTS（143-229行） | 完整 | 每个角色15维度各有1-5权重，如B2B的system-architecture=5，AI PM的ai-product-design=5 |
| 6 | **PM原型分配** | `constants.ts` assignArchetype（251-268行） | 有Bug | 5种原型（Craftsperson/Strategist/Growth Hacker/Visionary/Operator），但Growth Hacker计算有bug（见第四节） |
| 7 | **5大类雷达图** | `src/components/RadarChart.tsx` + `report/page.tsx` 78-83行 | 完整 | 5类：Product Skills / Business Acumen / AI Expertise / Soft Skills / Global Readiness，用Recharts的RadarChart渲染 |
| 8 | **维度分数网格** | `report/page.tsx` 204-244行 | 完整 | 按5大类分组展示15个维度分数，高分(≥4)绿色标记，低分(≤2)琥珀色标记 |
| 9 | **优劣势+行动建议** | `report/page.tsx` 248-325行 | 完整 | Top Strengths（绿色卡片+证据引用）+ Key Growth Areas（琥珀色卡片+upgrade建议+action items列表） |
| 10 | **被低估经历挖掘** | `report/page.tsx` 328-356行 | 完整 | Undervalued Experiences 蓝色卡片列表 |
| 11 | **缺失要素提示** | `report/page.tsx` 358-387行 | 完整 | Missing Elements 灰色卡片列表 |
| 12 | **下一步行动计划** | `report/page.tsx` 389-411行 | 完整 | 深色背景卡片，编号步骤列表 |
| 13 | **PDF导出** | `report/page.tsx` 95-133行 | 完整 | html2canvas截图 → jsPDF生成多页PDF，文件名含日期 |
| 14 | **社交分享** | `report/page.tsx` 136-151行 | 完整 | Web Share API（移动端）+ 剪贴板复制（桌面端）fallback |
| 15 | **Auth（Google+邮箱）** | `src/app/[locale]/auth/page.tsx` + `src/hooks/useAuth.ts` + Supabase | 完整 | Google OAuth + 邮箱/密码注册登录，Supabase SSR集成 |
| 16 | **评估历史** | `src/app/[locale]/history/page.tsx` + `history/[id]/page.tsx` | 完整 | 列表展示历史评估记录，支持查看详情和删除 |
| 17 | **分享报告** | `src/app/[locale]/share/[token]/page.tsx` | 基本完成 | 通过token加载共享报告，但有3处硬编码英文（见第四节） |
| 18 | **后台管理** | `src/app/[locale]/admin/page.tsx` + `src/app/api/admin/route.ts` | 完整 | 总用户数/总评估数/今日评估/平均分 + 最近用户/评估列表 + 角色分布 |
| 19 | **4语言国际化** | `src/messages/{en,zh,ja,ko}.json` + next-intl | 基本完成 | 4份locale文件各290行，覆盖所有页面文案，但StepIndicator和Share页有遗漏（见下方） |
| 20 | **Rate Limiting** | `src/lib/rate-limit.ts` | 基本可用 | 内存计数器（非Redis），重启清零，足够MVP阶段 |
| 21 | **3层定价页面** | `src/app/[locale]/pricing/page.tsx` | UI完成 | Free/$4.99/Pro $19，含FAQ折叠区。但纯展示无实际门控或支付逻辑 |
| 22 | **App Header** | `src/components/AppHeader.tsx` | 完整 | 响应式Header，移动端汉堡菜单，语言切换器，step indicator，用户导航 |
| 23 | **App Footer** | `src/components/AppFooter.tsx` | 完整 | 简洁Footer，版权信息+Pricing/Login链接 |
| 24 | **语言切换器** | `src/components/LanguageSwitcher.tsx` | 完整 | 4语言切换下拉菜单 |

### 3.2 关键缺失 ❌

| 优先级 | 缺失功能 | 问题描述 | 影响 | 涉及文件 |
|--------|---------|---------|------|---------|
| **P0** | **付费内容门控** | 报告页（`report/page.tsx`）无任何付费墙逻辑。所有用户——无论是否付费——看到**完整15维度分析+全部证据+行动建议+PDF导出**。Pricing页面声称Free版只给"总分+原型+雷达图+Top1摘要"，但代码中完全没有实现这个限制。 | **无收入路径。Free版体验和$4.99版完全一样，用户没有付费理由。** | `report/page.tsx` 需添加tier判断 + 模糊/锁定UI |
| **P0** | **支付集成** | Stripe/LemonSqueezy均未接入。Pricing页面的"Get Full Report"和"Upgrade to Pro"按钮只是UI展示，点击无操作。无checkout流程、无webhook回调、无订阅管理。 | **即使实现了付费墙，也无法收钱。** | 需新建API routes + webhook |
| **P0** | **Email收集是假的** | `report/page.tsx` 第434行：`sessionStorage.setItem("caliberEmail", email)` — Email只存在浏览器sessionStorage中。用户关闭标签页数据就没了。没有任何后端存储。 | **用户数据完全丢失，无法做后续营销。** | `report/page.tsx` 第424-435行 |
| **P0** | **OG Meta标签** | `layout.tsx` 只有基础title和description，没有Open Graph图片、Twitter Card标签。`public/`目录下也没有og-image文件。 | **用户分享到Twitter/LinkedIn/微信时无预览图，点击率极低。** | `layout.tsx` metadata对象 |
| **P1** | **Error Boundary** | 无全局错误边界组件。AI API调用失败（网络超时、API Key过期、JSON解析失败等）时，用户直接看到React白屏。 | **AI调用失败=产品崩溃，用户流失。** | 需新建ErrorBoundary组件 + layout.tsx |
| **P1** | **Step标签未国际化** | `StepIndicator.tsx` 第11行：`const STEP_SHORT = ["Role", "Input", "Analyze", "Report"]` 硬编码英文字符串。尽管文件已 import `useTranslations`（第3行），但Step标签没有使用它。 | **中日韩用户在评估流程中看到英文步骤标签，体验割裂。** | `StepIndicator.tsx` 第11行 + 4个locale文件 |
| **P1** | **Share页面硬编码英文** | `share/[token]/page.tsx` 有3处硬编码英文：①第13-19行 `ROLE_LABELS` 对象用英文角色名；②第21-27行 `getScoreLevel` 函数返回英文等级名（"Expert"/"Advanced"等）；③第173行CTA文案 "Want to know your own PM caliber?" | **分享页是社交传播的落地页。非英文用户打开看到英文=第一印象差。** | `share/[token]/page.tsx` |
| **P2** | **sessionStorage数据丢失** | `report/page.tsx` 第41行：评估结果存在 `sessionStorage` 中。刷新页面数据还在，但打开新标签页访问报告URL则数据消失，重定向回 `/assess`。 | **用户无法书签保存报告、无法在多设备查看。** 但已登录用户的数据存入了Supabase，所以主要影响未登录用户。 | `report/page.tsx` 第40-58行 |

### 3.3 不应该做的功能（避免 Feature Creep）

| 功能 | 原因 |
|------|------|
| 课程/题库 | 那是Exponent的领域，Caliber是诊断工具不是训练工具 |
| 模拟面试 | 架构完全不同（实时对话 vs 一次性报告），技术栈不匹配 |
| 招聘/内推 | 需要双边网络效应，现阶段用户基数为0，太早 |
| 社区论坛 | 无用户基础，运营成本高 |
| 简历重写 | Pricing页面写了"coming soon"可以保留，但本质上是另一个产品，别现在做 |

---

## 四、产品逻辑评审

### Bug：Growth Hacker 原型计算错误

**文件**：`src/lib/constants.ts` 第260行

```typescript
// 第252-253行：
const business = getCategoryAverage(scores, "business");

// 第260行（BUG）：
{ key: "growth-hacker", score: (business + getCategoryAverage(scores, "business")) / 2, label: "The Growth Hacker" }
```

**问题分析**：
- `business` 变量（第253行）已经是 `getCategoryAverage(scores, "business")` 的值
- 第260行又调用了一次同样的函数，取平均
- `(business + business) / 2 = business`，即 Growth Hacker 的分数 === Strategist 的分数
- 在 sort 排序中，两者永远并列，Growth Hacker 永远不会被优先分配

**影响**：一个真正擅长增长的PM（growth=4.5, data-driven=4.0），如果商业类别平均分（含growth和data-driven）高于其他类别，会被分配为 "The Strategist" 而非 "The Growth Hacker"。

**建议修复**：Growth Hacker 应突出 growth、data-driven、commercialization 三个维度，而非简单取 business 类别平均：
```typescript
{ key: "growth-hacker", score: (scores["growth"] ?? 0) * 0.35 + (scores["data-driven"] ?? 0) * 0.35 + (scores["commercialization"] ?? 0) * 0.3 }
```

---

### 问题：输入质量无底线

**文件**：`src/app/[locale]/assess/input/page.tsx` 第176行

```typescript
const hasValidExperience = experiences.some(
  (exp) => exp.company.trim() && exp.title.trim()
);
```

- 用户只填 "Google" + "PM" 就能提交（company + title 非空即可）
- AI 会因缺乏证据全面给低分（1.0-2.0），用户看到40分以下的报告，体验极差
- 没有任何提示告诉用户"信息太少会影响评估质量"

**建议**：增加最小内容检查（总输入至少100字符，或至少1个项目有 actions/results 填写），不足时显示提示文案。

---

### 问题：免费版给太多，没有付费动力

**当前状态**：Free 用户看到完整 15 维度分析 + 全部证据 + 行动建议 + PDF导出

**Pricing 页面声称 Free 只给**：总分 + 原型 + 5类雷达图 + Top1 优劣势摘要

两者完全不一致。代码中零门控逻辑。

**建议付费墙设计**：

| 内容 | Free | Single $4.99 | Pro $19/月 |
|------|------|-------------|-----------|
| 总分 + 原型 + 5类雷达图 | ✅ | ✅ | ✅ |
| Top1优势 + Top1劣势（摘要） | ✅ | ✅ | ✅ |
| 15维度详细分数 | 模糊处理 | ✅ | ✅ |
| 证据引用 + 评分说明 | 锁定 | ✅ | ✅ |
| 被低估经历挖掘 | 锁定 | ✅ | ✅ |
| 行动计划 | 锁定 | ✅ | ✅ |
| PDF导出 | 锁定 | ✅ | ✅ |
| 评估历史 | 最近1次 | 最近1次 | 全部 |
| 对比追踪 | ❌ | ❌ | ✅ |

---

### 问题：分数58/100心理感受差

- 西方教育体系下，60分以下 = 不及格
- 大多数用户会落在40-70区间
- 当前 `report/page.tsx` 第173行展示方式：`text-7xl` 超大裸数字"58"，视觉冲击很强，但情感冲击是负面的

**建议**：弱化裸数字，强化原型标签和等级名称
- 当前："58/100" 大字 + 小 badge "Competent"
- 建议：原型 + 等级作为主展示（"The Craftsperson · Competent Level"大标题），"58/100" 降为辅助信息
- 未来数据够了可以加百分位："Top 35% of AI PMs"

---

### 问题："国际化"雷达类别只有1个维度

**文件**：`constants.ts` 第234-240行 `DIMENSION_CATEGORIES`

```typescript
"product-hard": ["requirement-analysis", "product-design", "system-architecture", "zero-to-one"],  // 4个维度
"business": ["data-driven", "business-decomposition", "commercialization", "growth"],               // 4个维度
"ai": ["ai-product-design", "ai-tech-understanding", "ai-tool-application"],                        // 3个维度
"soft": ["user-research", "project-management", "self-awareness"],                                  // 3个维度
"international": ["cross-cultural"],                                                                 // 只有1个维度
```

5大类雷达图中，"Global Readiness" 只含 "cross-cultural" 1个维度。其他类别3-4个。这导致：
- 雷达图上这个轴的分数波动大（1个维度 vs 4个维度的平均值）
- 对大多数非跨国背景的PM，这个轴永远是短板，雷达图形状固定偏向一侧

**建议**：将 "cross-cultural" 并入 "Soft Skills"，变成4类雷达图（Product / Business / AI / Soft+Global），或给 international 补2个维度（如 "market-localization"、"remote-collaboration"）。

---

## 五、UI设计评审（对标2026规范）

### Landing Page — 主要问题：太像模板，缺少产品感

| 问题 | 现状（代码实证） | 2026标准 | 建议 |
|------|-----------------|---------|------|
| **Hero无产品预览** | `page.tsx` 第25-57行：纯文字Hero区（标题+副标题+两个按钮），无任何产品截图或交互预览 | 交互式产品demo/截图 | 在CTA下方添加一个"样本报告"动态预览卡，展示雷达图+分数+原型 |
| **Stats Bar是功能参数** | `page.tsx` 第59-73行：4个stat分别是"15维度/5角色/AI/5分钟"，纯产品参数 | 社会证明（用户数/公司logo） | 无真实用户数据时改为价值主张："Based on top tech hiring rubrics" 等 |
| **无动画** | 只有Features区的 `group-hover:scale-110 transition-transform`，无入场动画 | 滚动触发reveal、数字count-up | 添加Intersection Observer触发的渐入动画 |
| **Features太文字化** | `page.tsx` 第76-123行：3个feature各含图标+标题+描述文字，无产品截图 | 带截图/GIF的功能展示 | 每个feature下方配一个mini组件预览（权重对比条/评分示例/建议卡片） |
| **CTA层级不清** | 第44-55行："Get Started"和"Pricing"两个按钮平级展示 | 一个主CTA + 辅助链接 | 强化主CTA视觉权重（大按钮+阴影），Pricing改为文字链接 |

### 色彩系统 — 安全但无辨识度

**代码实证**：`globals.css` 第58行 `--primary: oklch(0.546 0.245 262.881)` — 这是标准蓝紫色

- Blue+Slate是80%SaaS产品的默认选择
- 语义化色彩（emerald=优势, amber=劣势）在报告页用得合理，保留
- **建议**：Primary偏移至深靛蓝(indigo-600)或蓝绿(teal-600)，增加一个暖色调CTA色(coral/金色)打破"模板感"

### 字体 — Geist Sans = "Next.js默认项目"信号

**代码实证**：`layout.tsx` 第5行 `import { Geist } from "next/font/google"` + 第9行 `const geistSans = Geist({...})`

- Geist是Vercel出品的字体，行内人一眼识别"这是Next.js默认模板"
- **建议字体组合**：
  - 方案A：全站 **Inter**（现代感强，可读性好）
  - 方案B：标题 **Instrument Serif** + 正文 **Inter**（Granola风格的"高级感"）

### 移动端 — 具体问题

| 问题 | 代码位置 | 说明 |
|------|---------|------|
| 报告页分数 `text-7xl` 过大 | `report/page.tsx` 第173行 | iPhone上高约2.25英寸，占屏幕1/3，过于夸张 |
| 雷达图固定420px高 | `RadarChart.tsx` 第20行 `h-[420px]` | 小屏幕上标签文字可能重叠 |
| How It Works连线移动端隐藏 | `page.tsx` 第196行 `className="hidden md:block"` | 步骤间视觉断裂，缺少移动端的垂直连接线替代方案 |
| Share页分数同样text-7xl | `share/[token]/page.tsx` 第105行 | 同report页问题 |

### 暗色模式

**代码实证**：`globals.css` 第85-117行定义了完整的 `.dark` CSS变量集

- 变量已定义但无激活机制（没有 `useTheme` 或主题切换按钮）
- **建议：MVP不做暗色模式**，减少测试面。未来通过 `next-themes` + 系统偏好检测实现

---

## 六、与竞品的优劣势对比

### vs Exponent

| 维度 | Exponent | Caliber | 评价 |
|------|----------|---------|------|
| 用户规模 | 500K+ | 0 | Exponent碾压 |
| 产品类型 | 训练平台 | 诊断工具 | **不同赛道** |
| AI应用 | 无核心AI功能 | AI是产品核心 | **Caliber优势** |
| 社会证明 | FAANG logos + 大学合作 | 无 | Exponent碾压 |
| PM框架 | 4大技能 + 面试题型 | 15维度×5角色权重 | **Caliber更精细** |
| 个性化 | 按公司分面试指南 | AI逐人分析真实经历 | **Caliber优势** |
| 变现 | 订阅制（成熟） | 未实现 | Exponent领先 |
| 内容深度 | 课程+题库+视频 | 单次报告 | Exponent更丰富 |
| 用户留存 | 高（课程+社区） | 低（一次性使用） | **Caliber核心挑战** |

### Caliber的战略位置：Exponent的前置工具

最佳增长策略：与Exponent等平台建立推荐关系
- "你的增长能力得分2.0 → 推荐Exponent的Growth PM课程"
- 报告NextSteps中嵌入合作伙伴链接（潜在affiliate收入）

---

## 七、执行计划

### Phase 4A：关键Bug修复 + 基础完善（1天）

| # | 任务 | 涉及文件 | 优先级 |
|---|------|---------|--------|
| 1 | 修复Growth Hacker原型计算bug | `constants.ts:260` | P0 |
| 2 | Step标签国际化（删除STEP_SHORT硬编码） | `StepIndicator.tsx` + 4个locale文件 | P1 |
| 3 | Share页面i18n修复（3处硬编码英文） | `share/[token]/page.tsx` + locale文件 | P1 |
| 4 | 添加OG Meta标签（openGraph + twitter card） | `layout.tsx` + `public/og-image.png` | P0 |
| 5 | 输入页最小内容质量检查（≥100字符） | `input/page.tsx` + locale文件 | P1 |
| 6 | 报告页分数动画（从0计数到最终值） | `report/page.tsx` | P2 |
| 7 | 移动端修复：报告数字响应式缩小、雷达图高度响应式 | `report/page.tsx`, `RadarChart.tsx`, `share/[token]/page.tsx` | P1 |

### Phase 4B：Landing Page升级（1-2天）

| # | 任务 | 涉及文件 |
|---|------|---------|
| 1 | Hero区域添加样本报告交互预览（雷达图+分数+原型） | `page.tsx` + locale文件 |
| 2 | Stats Bar改为价值主张或信任信号 | `page.tsx` + 4个locale文件 |
| 3 | Features区域配产品Mini组件预览 | `page.tsx` |
| 4 | 添加滚动触发的渐入动画（useInView hook） | `page.tsx` + 新utility文件 |
| 5 | 字体升级：Geist → Inter | `layout.tsx` + `globals.css` |
| 6 | 定位文案更新（去掉"Before Your Next Interview"场景限制） | 4个locale文件 |

### Phase 4C：付费墙 + 商业化（2-3天）

| # | 任务 | 涉及文件 |
|---|------|---------|
| 1 | 报告页实现内容门控（Free用户看摘要，模糊/锁定详细内容） | `report/page.tsx` + 新subscription.ts |
| 2 | Email收集连接Supabase（替换sessionStorage假存储） | `report/page.tsx` + 新API route |
| 3 | Stripe/LemonSqueezy支付集成 | 新API routes + pricing页 |
| 4 | Error Boundary全局错误边界组件 | 新组件 + layout.tsx |

### 验证清单

每个Phase完成后：
1. `npx tsc --noEmit` 确认无类型错误
2. `npm run build` 确认构建通过
3. `npm run dev` 手动走完整流程（选角色 → 填信息 → AI分析 → 报告）
4. Chrome DevTools移动端视口测试（iPhone 14 Pro 390×844, iPad 820×1180）
5. 切换4种语言，确认无missing key报错
6. 检查付费墙：未登录/Free用户只能看到摘要版报告

---

## 附录：文件变更汇总

| Phase | 新建文件 | 修改文件 |
|-------|---------|---------|
| 4A | — | `constants.ts`, `StepIndicator.tsx`, `share/[token]/page.tsx`, `layout.tsx`, `input/page.tsx`, `report/page.tsx`, `RadarChart.tsx`, 4个locale文件 |
| 4B | `src/hooks/useInView.ts` | `page.tsx`(landing), `layout.tsx`, `globals.css`, 4个locale文件 |
| 4C | `src/lib/subscription.ts`, `src/app/api/collect-email/route.ts`, `src/components/ErrorBoundary.tsx` | `report/page.tsx`, `layout.tsx`, 4个locale文件 |

**总计**：新建3个文件，修改约15个文件
