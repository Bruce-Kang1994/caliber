---
name: product-review
description: "Comprehensive product review engine -- audits a built product from PM lead perspective. Covers brand, positioning, feature completeness, product logic bugs, UI design review, competitive analysis, and prioritized execution plan. Distilled from real SaaS product review methodology."
metadata:
  author: bruce
  version: "1.0"
  last-updated: "2026-03-05"
  origin: "Distilled from Caliber project full product review report V2"
---

# Product Review -- Comprehensive Product Audit Engine

> Built product in, structured audit report out.
> Systematic review from product lead perspective, coordinating frontend/UI/backend concerns.

## Activation

When the user says any of the following, activate this skill:

- "Review this product" / "Audit this product"
- "product-review" / "product review"
- "Give me a full product assessment"
- "What's wrong with this product?"
- "Review before launch" / "Pre-launch review"
- Any request to evaluate a product's completeness, quality, or market readiness

## Core Principles

1. **Code-evidenced.** Every finding must reference exact file paths and line numbers. No vague claims.
2. **Prioritized.** Every issue gets a P0/P1/P2 severity. Don't bury critical bugs under nice-to-haves.
3. **Constructive.** For every problem found, provide a concrete fix suggestion with file paths.
4. **Scope-aware.** Distinguish between "must fix before launch" vs "nice to have" vs "don't build this."
5. **User-empathetic.** Evaluate from real user's perspective, not just code quality.

## Execution Pipeline

Run through all phases sequentially. Output a single structured report at the end.

---

### Phase 1: Codebase Reconnaissance

**Claude does:**
- Read the project's CLAUDE.md / README for context (tech stack, architecture, conventions)
- `Glob` to map the full file structure
- Identify: framework, styling, i18n setup, auth, database, API routes, deployment target
- Count: total pages, components, API endpoints, locale files

**Output:** Mental model of the codebase (no document yet)

---

### Phase 2: Brand & Positioning Audit

**Claude evaluates:**

| Aspect | What to check |
|--------|---------------|
| **Product name** | Memorable? Globally pronounceable? SEO-friendly? Trademark conflicts? |
| **Tagline/Hero copy** | Does it communicate value in < 10 words? Does it limit use cases unnecessarily? |
| **Positioning** | Who is the target user? What's the core differentiator? Where does it sit vs competitors? |
| **Competitive landscape** | Web search 3-5 closest alternatives. Map: what they do well, what gaps exist, where this product fits |

**Output format:**
```
### Brand & Positioning
- Name: [assessment]
- Tagline: [current] -> [suggested improvement if needed]
- Positioning: [complementary/competitive] with [competitor names]
- Unique wedge: [what this product has that competitors don't]
```

---

### Phase 3: Feature Completeness Audit

**Claude does:**
- Read every page, component, and API route
- Categorize each feature into one of three buckets:

| Status | Meaning | Action |
|--------|---------|--------|
| **Complete** | Fully implemented and working | Document with file path + quality note |
| **Critical Gap** | Missing but essential for launch/revenue | Flag as P0/P1 with impact description |
| **Don't Build** | Feature that would cause scope creep | Explicitly list with reason to avoid |

**Output format:**
```
### Feature Completeness

#### Completed (N features)
| # | Feature | File Path | Quality | Notes |
|---|---------|-----------|---------|-------|

#### Critical Gaps (N issues)
| Priority | Missing Feature | Impact | Suggested Fix | Files to Change |
|----------|----------------|--------|---------------|-----------------|

#### Don't Build (scope protection)
| Feature | Why Not |
|---------|---------|
```

**Common critical gaps to check for:**
- Payment integration (if pricing page exists but no checkout)
- Content gating / paywall logic (if freemium model claimed)
- Email/data collection (is it actually persisted or fake?)
- OG meta tags for social sharing
- Error boundaries / crash recovery
- Rate limiting
- Input validation minimums

---

### Phase 4: Product Logic Audit

**Claude does:**
- Read core business logic files (algorithms, calculations, scoring, state management)
- Look for these specific bug patterns:

| Pattern | How to detect |
|---------|---------------|
| **Duplicate computation** | Same function called twice, result used redundantly |
| **Dead code paths** | Conditions that can never be true |
| **State inconsistency** | Data stored in sessionStorage/localStorage that should be in DB |
| **Hardcoded strings in i18n app** | Strings not going through translation function |
| **Promise/Free mismatch** | Pricing page claims limits that code doesn't enforce |
| **Input quality floor** | Can users submit garbage input and get bad results? |

**For each bug found:**
```
### Bug: [descriptive name]
- **File:** `path/to/file.ts` line XX
- **Current code:** [snippet]
- **Problem:** [what's wrong]
- **Impact:** [user-facing consequence]
- **Fix:** [suggested code change]
```

**User psychology check:**
- If the product scores/evaluates users: is the result presentation empathetic?
- Does a mediocre score feel like failure or like guidance?
- Is positive identity shown before negative numbers?

---

### Phase 5: UI Design Audit

**Claude evaluates against modern SaaS standards:**

| Aspect | What to check |
|--------|---------------|
| **Hero section** | Has product preview/demo? Or just text? Interactive element? |
| **Social proof** | Real metrics or placeholder stats? Trust signals? |
| **CTA hierarchy** | One clear primary CTA per screen? Or competing buttons? |
| **Animations** | Entry animations? Scroll-triggered reveals? Micro-interactions? Or static? |
| **Color system** | Distinctive or generic? Semantic colors for states (success/warning/error)? |
| **Typography** | Default framework font or intentional choice? Hierarchy clear? |
| **Mobile** | Test at 390px width. Font sizes, touch targets (44px min), layout breaks? |
| **Dark mode** | CSS variables defined? Toggle mechanism exists? Or skip for MVP? |
| **Accessibility** | ARIA labels? Focus states? Color contrast (4.5:1 minimum)? Keyboard nav? |

**Output format:**
```
### UI Design Review

| Issue | Current State (code evidence) | Standard | Suggestion |
|-------|------------------------------|----------|------------|
```

---

### Phase 6: Competitive Matrix

**Claude does:**
- Based on Phase 2 research, build a detailed comparison matrix

**Output format:**
```
### Competitive Analysis

| Dimension | Competitor A | This Product | Assessment |
|-----------|-------------|-------------|------------|

### Strategic Position
- This product's role: [diagnostic tool / training platform / marketplace / etc.]
- Best growth strategy: [partnership / SEO / community / etc.]
```

---

### Phase 7: Execution Plan

**Claude synthesizes all findings into a prioritized action plan:**

```
### Execution Plan

#### Phase A: Critical Fixes (1 day)
| # | Task | Files | Priority |
|---|------|-------|----------|

#### Phase B: [Theme] (N days)
| # | Task | Files |
|---|------|-------|

#### Phase C: [Theme] (N days)
| # | Task | Files |
|---|------|-------|

### Validation Checklist (after each phase)
1. `npx tsc --noEmit` -- no type errors
2. `npm run build` -- build passes
3. Full user flow walkthrough
4. Mobile viewport test (390x844)
5. [App-specific checks]
```

---

### Phase 8: Report Assembly

**Claude outputs the complete report with this structure:**

```markdown
# [Product Name] Comprehensive Product Review

> **Reviewer perspective:** Product Lead
> **Review date:** [date]
> **Tech stack:** [stack summary]
> **Code review scope:** [what was reviewed]

---

## 1. Brand & Positioning
[Phase 2 output]

## 2. Feature Completeness
[Phase 3 output]

## 3. Product Logic Audit
[Phase 4 output]

## 4. UI Design Review
[Phase 5 output]

## 5. Competitive Analysis
[Phase 6 output]

## 6. Execution Plan
[Phase 7 output]

## Appendix: File Change Summary
| Phase | New Files | Modified Files |
|-------|-----------|----------------|
```

Save the report to `docs/product-review-[date].md`.

---

## Severity Definitions

| Level | Meaning | Example |
|-------|---------|---------|
| **P0** | Blocks launch or revenue. Fix immediately. | No payment integration but pricing page exists |
| **P1** | Degrades user experience significantly. Fix before launch. | Hardcoded strings in i18n app, missing error handling |
| **P2** | Nice to have. Fix when time allows. | Animation polish, dark mode, minor copy improvements |

## Scope Control

This skill audits **what exists**. It does NOT:
- Rewrite the product
- Add new features
- Refactor code

It produces a report with findings and recommendations. The user decides what to act on.
