# Caliber 项目文档

文档按产品生命周期排序，编号即阅读顺序。

| # | 文件 | 说明 | 状态 |
|---|------|------|------|
| 01 | [prd.md](01-prd.md) | **产品需求文档** -- 问题定义、目标用户、MVP 功能范围、商业模式、Bruce 真实案例验证 | 当前 |
| 02 | [assessment-framework-v1-archived.md](02-assessment-framework-v1-archived.md) | **评估框架 v1（已归档）** -- 初版 15 维度 + 5 分类 + 评分标准 + 岗位权重。已被 v2 替代，仅留作历史参考 | 已归档 |
| 03 | [product-review-v2.md](03-product-review-v2.md) | **全方位产品评审报告** -- 品牌定位、功能完整度审计、产品逻辑 Bug、UI 设计评审、竞品分析、执行计划 | 当前 |
| 04 | [algorithm-audit-v2.md](04-algorithm-audit-v2.md) | **算法模型审计报告** -- 16 维度重设计、80 条行为锚定量表(BARS)、角色权重矩阵、资历分层、复合原型系统、理论溯源。**这是当前生效的评估框架** | 当前 |
| 05 | [implementation-guide.md](05-implementation-guide.md) | **实施指南** -- 产品评审报告的逐任务落地方案，含精确的文件路径、行号、代码片段 | 当前 |
| 06 | [skill-comparison.md](06-skill-comparison.md) | **前端 Skill 对比报告** -- ui-ux-pro-max vs theme-factory 对比评测、市场全景图、推荐组合 | 当前 |

## 版本说明

- **评估框架**：v1（15 维度 5 分类）-> v2（16 维度 4+1 分类）。v2 定义在 `04-algorithm-audit-v2.md`，代码实现在 `src/lib/constants.ts`
- **产品评审**：仅 V2 版本，对应的实施任务在 `05-implementation-guide.md` 中跟踪

## 命名规则

- 编号 `01-06`：按产品生命周期排序（需求 -> 框架 -> 评审 -> 审计 -> 实施 -> 工具选型）
- 文件名用英文 kebab-case：方便 git 和命令行操作，中文文件名在终端容易出问题
- `archived` 后缀：表示该文档已被新版替代，不再指导开发
