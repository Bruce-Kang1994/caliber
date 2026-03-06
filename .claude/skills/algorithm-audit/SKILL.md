---
name: algorithm-audit
description: "Algorithm & evaluation model audit engine -- audits scoring systems, assessment frameworks, recommendation algorithms, or any product that evaluates/ranks/scores users or items. Covers framework benchmarking, expert simulation, BARS design, weight matrices, seniority calibration, and archetype/classification systems."
metadata:
  author: bruce
  version: "1.0"
  last-updated: "2026-03-05"
  origin: "Distilled from Caliber PM assessment algorithm audit report V2"
---

# Algorithm Audit -- Evaluation Model Audit Engine

> Scoring system in, validated framework out.
> For any product that evaluates, ranks, scores, or classifies users/items.

## Activation

When the user says any of the following, activate this skill:

- "Audit the algorithm" / "Review the scoring model"
- "algorithm-audit" / "model audit"
- "Is my evaluation framework valid?"
- "Check if my scoring system is fair/accurate"
- "Review my assessment dimensions / weights / rubric"
- Any request to validate a scoring, ranking, or classification system

## Applicability

This skill applies to ANY product that contains:
- Scoring rubrics (e.g., skill assessments, performance reviews)
- Weighted dimension models (e.g., PM evaluation, credit scoring)
- Classification/archetype systems (e.g., personality types, user segments)
- Ranking algorithms (e.g., recommendation engines, leaderboards)
- Evaluation frameworks (e.g., hiring rubrics, quality audits)

## Core Principles

1. **Theory-grounded.** Every dimension must trace to a published framework or research. "We made it up" is a finding, not a feature.
2. **Behaviorally anchored.** Scores without behavioral descriptions are meaningless. If score 3 vs 4 can't be distinguished by observable behavior, the scale is broken.
3. **Expert-validated.** Simulate domain expert review. Real experts would ask hard questions -- the audit should too.
4. **Bias-aware.** Check for cultural bias, recency bias, level/seniority conflation, and dimensional overlap.
5. **Actionable output.** Don't just find problems -- provide the redesigned model.

## Execution Pipeline

---

### Phase 1: Model Extraction

**Claude does:**
- Read all files that define the evaluation model:
  - Dimension definitions (what is being measured)
  - Scoring scales (how scores are assigned)
  - Weight matrices (how dimensions are weighted for different contexts/roles)
  - Classification/archetype assignment logic
  - AI prompts that instruct scoring (if AI-powered)
- Map the complete model:

```
Model Summary:
- Dimensions: [N] across [M] categories
- Scale: [range, e.g., 1-5]
- Roles/contexts: [N] with distinct weight profiles
- Classification system: [archetypes/types/tiers]
- Scoring method: [AI / formula / manual / hybrid]
- Behavioral anchors: [yes/no]
- Seniority/level differentiation: [yes/no]
- Theoretical sources cited: [yes/no]
```

---

### Phase 2: Industry Framework Benchmarking

**Claude does:**
- Web search for 3-6 authoritative frameworks in the same domain
- For each framework, extract: author/source, dimensions, categories, scoring method, role differentiation

**Output format:**
```
### Industry Framework Comparison

| Framework | Author/Source | Dimensions | Categories | Has Scoring | Has Role Differentiation |
|-----------|--------------|------------|------------|-------------|-------------------------|

### Key Findings
- Industry standard dimension count: [range]
- Industry standard category count: [range]
- Most authoritative framework: [name] -- [why]
- Dimensions this product HAS that industry lacks: [list]
- Dimensions industry HAS that this product lacks: [list]
```

---

### Phase 3: Expert Panel Simulation

**Claude does:**
- Simulate 8-12 domain expert reviews from diverse perspectives
- Each expert should have a distinct background that brings unique critique
- Rate the model on a 1-5 scale from each expert's perspective

**Expert template:**
```
| # | Expert Background | Rating | Core Critique |
|---|-------------------|--------|---------------|
```

**Then synthesize consensus issues (raised by 3+ experts):**
```
### Consensus Issues

| Issue | Raised By | Severity | Resolved in Redesign? |
|-------|-----------|----------|-----------------------|
```

**And top suggested additions:**
```
### Most Requested Additions

| Suggested Dimension/Change | Raised By | Recommendation |
|---------------------------|-----------|----------------|
```

---

### Phase 4: Structural Defect Diagnosis

**Claude checks for these specific defect patterns:**

| Defect | How to detect | Severity |
|--------|---------------|----------|
| **No theoretical source** | Dimensions don't reference any published framework | Critical |
| **No behavioral anchors** | Score levels (e.g., 1-5) have no behavioral descriptions | Critical |
| **No seniority/level calibration** | Same rubric for junior and senior (score 3 means different things) | Serious |
| **Dimensional overlap** | Two dimensions measure essentially the same thing | Medium |
| **Orphan category** | A category with only 1 dimension (skews aggregate scores) | Medium |
| **Stale weights** | Weights don't reflect current industry reality | Medium |
| **Information-destroying classification** | Continuous data compressed to single label with no nuance | Medium |
| **Computation bugs** | Duplicate calculations, unreachable conditions, formula errors | Critical |
| **Cultural bias** | Framework assumes single cultural context | Low-Medium |
| **Missing key dimension** | Dimension that all major frameworks include but this model lacks | Serious |

**For each defect found:**
```
### Defect: [name]
- **Severity:** [Critical/Serious/Medium/Low]
- **Evidence:** [file path + line number + code snippet]
- **Impact:** [what goes wrong for users]
- **Fix:** [specific recommendation]
```

---

### Phase 5: Redesigned Model

**Claude produces the improved model. For each component:**

#### 5.1 Dimension Redesign

```
| Category | # | Dimension Key | Dimension Name | Source/Theory | Change Type |
|----------|---|---------------|----------------|---------------|-------------|
```

Change types: `Kept` / `New` / `Merged` (from X+Y) / `Renamed` / `Restructured`

Provide rationale for each change.

#### 5.2 Behavioral Anchoring (BARS)

For EVERY dimension, write behavioral descriptions for each score level:

```
### [Dimension Name] ([dimension-key])

| Score | Behavioral Description |
|-------|----------------------|
| 1.0 | [Observable behavior at lowest level] |
| 2.0 | [Observable behavior at basic level] |
| 3.0 | [Observable behavior at competent level] |
| 4.0 | [Observable behavior at advanced level] |
| 5.0 | [Observable behavior at expert level] |
```

**BARS writing rules:**
- Each description must be about observable behavior, not traits
- Each level must be clearly distinguishable from adjacent levels
- Level 3 = independently competent (the anchor point)
- Level 1 = absence of the capability
- Level 5 = industry-recognized excellence + organizational impact

#### 5.3 Weight Matrix

If the model has role/context differentiation:

```
| # | Dimension | Role A | Role B | Role C | ... |
|---|-----------|--------|--------|--------|-----|
```

Document any weight changes from original with rationale.

#### 5.4 Seniority Calibration (if applicable)

Define how the same score means different things at different levels:

```
| Level | Name | Experience Range | Score 3.0 Means |
|-------|------|------------------|-----------------|
```

#### 5.5 Classification/Archetype System (if applicable)

If the model classifies users into types:

```
| Archetype | Calculation Formula |
|-----------|-------------------|
```

If the original system is too simplistic (single label), recommend compound output:
```
Primary: XX% [Type A] / Secondary: YY% [Type B]
```

#### 5.6 Scoring Formula

Document the mathematical formula for aggregate scores:
```
weightedScore = Sum(dimension_score x role_weight) / Sum(role_weight x max_score) x 100
```

---

### Phase 6: Theory Source Declaration

**Claude provides a citable statement for the product's about/methodology page:**

```
> "[Product name]'s evaluation framework synthesizes [Framework A] by [Author],
> [Framework B] by [Author], and [Framework C], extended for [domain-specific additions]."
```

**Plus per-dimension source tracing:**
```
| Dimension | Primary Source | Secondary Source |
|-----------|---------------|-----------------|
```

---

### Phase 7: Implementation Changelog

**Claude maps every change to specific files:**

```
### Changes Required

| Change | Affected File(s) | Status |
|--------|-----------------|--------|
```

---

### Phase 8: Report Assembly

**Save to `docs/algorithm-audit-[date].md` with this structure:**

```markdown
# [Product Name] Algorithm Model Audit Report

> **Version:** [v1 -> v2]
> **Date:** [date]
> **Audit scope:** [dimensions, weights, scoring, archetypes, theory]

---

## 1. Executive Summary
[Model stats: before vs after]

## 2. Industry Framework Benchmarking
[Phase 2 output]

## 3. Expert Panel Review
[Phase 3 output]

## 4. Structural Defects Found
[Phase 4 output]

## 5. Redesigned Model
[Phase 5 output -- all subsections]

## 6. Theory Sources
[Phase 6 output]

## 7. Implementation Changelog
[Phase 7 output]

## Appendix: Scoring Formula
[Mathematical specification]
```

---

## When NOT to Use This Skill

- Product doesn't score, rank, evaluate, or classify anything
- The "algorithm" is just basic CRUD logic
- The scoring is purely cosmetic / gamification (not decision-driving)

For general product quality review, use the `product-review` skill instead.
