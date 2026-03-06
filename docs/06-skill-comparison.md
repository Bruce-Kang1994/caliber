# Frontend Design Skill 评估报告

> 生成日期: 2026-03-04
> 评估项目: Caliber (PM Assessment SaaS)
> 技术栈: Next.js 16 + Tailwind CSS + shadcn/ui + Lucide Icons

---

## 一、B vs C 变体裁判评分

### 评分维度（满分 10 分）

| 维度 | Variant B (ui-ux-pro-max) | Variant C (theme-factory) | 说明 |
|------|:---:|:---:|------|
| **与产品调性匹配度** | 9 | 7 | Caliber 是专业评估工具，B 的"信任蓝+干净白底"更匹配 PM 群体的审美预期 |
| **与 Exponent 参考一致性** | 9 | 6 | B 的纯白 Hero + 蓝紫强调色几乎 1:1 对标 Exponent；C 的渐变紫偏科技创业 |
| **视觉独特性** | 6 | 8 | C 的渐变文字、点阵网格、三色体系更有辨识度；B 偏标准 SaaS |
| **无障碍 / 可用性** | 10 | 7 | B 有完整 ARIA 标签、focus-visible、4.5:1 对比度、44px 触控目标 |
| **代码工程质量** | 9 | 8 | B 语义化 HTML 更严谨，C 也不错但装饰性元素偏多 |
| **移动端响应式** | 9 | 8 | 两者都做了响应式，B 的断点处理更系统化 |
| **转化率潜力** | 9 | 7 | B 的 CTA 用翡翠绿独立于蓝色主色，视觉层级更清晰；C 的玫红 CTA 在紫色系中不够突出 |
| **可维护性 / 可扩展** | 9 | 7 | B 的设计系统（颜色语义、间距规范）扩展性更强；C 的主题绑定过紧 |
| **加载性能** | 8 | 7 | C 有更多装饰性浮动元素和渐变，略重 |
| **整体印象** | 9 | 8 | B = 专业可信赖；C = 现代有个性 |
| **总分** | **87/100** | **73/100** | |

### 裁判结论

**B (ui-ux-pro-max) 胜出**，原因：

1. **产品-设计匹配**：PM 做能力评估时心态是"求职/自我提升"，需要的是**信任感和专业感**，而非科技酷炫感
2. **Exponent 对标**：你选的参考就是一个典型的 Swiss Minimalist SaaS，B 最接近这个方向
3. **转化优化**：蓝色主色 + 绿色 CTA 是 SaaS 领域经过验证的高转化组合（Stripe、Linear、Vercel 都用类似模式）
4. **无障碍领先**：对出海产品尤其重要，欧美市场对 a11y 有法律要求

**C (theme-factory) 的价值**：如果你将来做一个更偏 2C 的科技产品（比如 PostMem），C 的"Tech Innovation"主题会更合适。

---

## 二、市场上所有 Frontend Design Skill 全景图

### 官方 Anthropic Skills（anthropics/skills 仓库, 83k+ Stars）

| Skill | 用途 | 适合场景 |
|-------|------|----------|
| **frontend-design** | 视觉方向 + 排版 + 配色 + 动效 | 任何需要独特视觉的前端项目 |
| **web-artifacts-builder** | 复杂多组件 React 产物 | Claude.ai artifacts, 复杂交互原型 |
| **theme-factory** | 主题生成 + 风格一致性 | PPT、文档、快速原型 |
| **brand-guidelines** | 品牌规范遵守 | 已有品牌体系的项目 |
| **canvas-design** | 可视化艺术生成 | 插画、图表、视觉素材 |
| **algorithmic-art** | 算法生成艺术 | 创意/实验项目 |

### 第三方重点 Skills

| Skill | Stars | 用途 | 核心优势 |
|-------|-------|------|----------|
| **obra/superpowers** | 70k | 全流程工作框架（含 UI 优化子技能） | 自动触发 UI 优化、动效修复、无障碍检查 |
| **ui-ux-pro-max** | 37k | 跨平台 UI/UX 设计系统 | 99 条 UX 规则、97 套配色、57 套字体、13 个技术栈 |
| **design-motion-principles** | 146 | 动效审计（3 位设计师视角） | Emil Kowalski/Jakub Krehel/Jhey Tompkins 三种风格 |
| **Shadcnblocks-Skill** | 10 | 2500+ shadcn/ui 预制区块 | 不重新造轮子，直接选用成熟组件 |
| **accessibility-agents** | 156 | WCAG 2.2 AA 合规（25 个专业 Agent） | 出海产品法律合规保障 |
| **claudedesignskills** | 4 | 3D/动画/滚动交互 (Three.js, GSAP) | 高级交互效果 |
| **elite-frontend-ux** | Gist | 视觉设计 + UX 工程合一 | frontend-design 的增强版 |

### 元资源目录（发现更多 Skill 的入口）

| 资源 | Stars | 链接 |
|------|-------|------|
| awesome-claude-skills | 8.2k | github.com/travisvn/awesome-claude-skills |
| awesome-claude-code | 26k | github.com/hesreallyhim/awesome-claude-code |
| awesome-agent-skills | 9.2k | github.com/VoltAgent/awesome-agent-skills |

---

## 三、综合排名（针对 SaaS Landing Page 场景）

### Tier 1 — 必装（视觉 + 工程双引擎）

| 排名 | Skill | 角色 | 理由 |
|:---:|-------|------|------|
| 1 | **ui-ux-pro-max** | 视觉主导 | 37k stars，最全面的 SaaS 设计系统，97 套配色 + 无障碍规范 + 多技术栈支持。B 变体效果已验证 |
| 2 | **frontend-design** (官方) | 创意方向 | Anthropic 官方，防止"AI 味"千篇一律。当需要突破标准模板时启用 |

### Tier 2 — 强烈推荐（精细化打磨）

| 排名 | Skill | 角色 | 理由 |
|:---:|-------|------|------|
| 3 | **design-motion-principles** | 动效审计 | 让 Claude 用 3 位顶级设计师的标准检查动画质量，避免"过度动效"或"死板无动效" |
| 4 | **Shadcnblocks-Skill** | 组件库 | 项目已用 shadcn/ui，这个 skill 让 Claude 从 2500+ 成熟区块中选用，而非从零写 |

### Tier 3 — 按需安装

| 排名 | Skill | 角色 | 理由 |
|:---:|-------|------|------|
| 5 | **accessibility-agents** | 合规检查 | 出海产品上线前必须过一遍 WCAG 2.2 AA |
| 6 | **obra/superpowers** | 全流程框架 | 如果你希望 Claude 在整个开发过程中自动触发 UI 优化 |

---

## 四、具体建议：你应该怎么做

### 推荐方案：2+1 组合

**主力组合（日常开发）：**
1. **ui-ux-pro-max** — 作为默认视觉规范，保证所有页面干净、专业、可用
2. **frontend-design** (官方) — 已安装，当需要"跳出标准模板"时手动启用

**加分项（上线前打磨）：**
3. **design-motion-principles** — Landing Page 完成后用它做一次动效审计

### 为什么不需要 theme-factory？

theme-factory 的 10 个预设主题更适合**快速原型/PPT/文档**，不适合需要精细打磨的 SaaS Landing Page。你已经有 ui-ux-pro-max 提供更专业的设计系统，theme-factory 的价值被覆盖了。

### 安装方式

```bash
# ui-ux-pro-max（如果还没安装）
cd /Users/kangxin/Desktop/pm-assessment
mkdir -p .claude/skills/ui-ux-pro-max
# 从 GitHub 下载 SKILL.md 到 .claude/skills/ui-ux-pro-max/SKILL.md

# design-motion-principles
mkdir -p .claude/skills/design-motion-principles
# 从 GitHub 下载 SKILL.md 到 .claude/skills/design-motion-principles/SKILL.md
```

---

## 五、下一步行动

1. **确认选择 B 方案** → 将 B 变体的设计语言应用到主 Landing Page
2. **保留 C 方案备用** → 将来 PostMem 等 2C 产品可以复用 Tech Innovation 主题
3. **安装推荐的 2+1 Skill 组合**
4. **删除 /compare 目录**（对比完成后清理）

---

*报告由 Claude Opus 4.6 生成，基于实际代码对比 + 市场调研*
