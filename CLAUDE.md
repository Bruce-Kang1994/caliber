# Caliber — PM Assessment Tool

## Project Overview

Caliber is an AI-powered Product Manager assessment tool. Users input their work experience (text/resume), and an AI (OpenAI) evaluates them across 15 PM dimensions, producing a detailed report with scores, radar chart, archetype, strengths, weaknesses, and next steps.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui + tw-animate-css
- **i18n**: next-intl (4 locales: en, zh, ja, ko)
- **AI**: OpenAI API (GPT) for assessment analysis
- **Auth/DB**: Supabase (SSR)
- **PDF**: html2canvas + jsPDF for report export
- **Charts**: Recharts (radar chart)
- **Fonts**: Geist Sans/Mono

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Theme variables (primary, accent-warm, etc.)
│   ├── [locale]/
│   │   ├── page.tsx             # Landing page
│   │   ├── assess/
│   │   │   ├── page.tsx         # Assessment entry
│   │   │   ├── onboarding/     # Role selection
│   │   │   ├── input/          # Experience input (text/resume)
│   │   │   ├── analyzing/     # AI processing screen
│   │   │   └── report/        # Assessment report
│   │   ├── pricing/            # Pricing page
│   │   ├── history/            # Assessment history
│   │   ├── admin/              # Admin panel
│   │   ├── auth/               # Auth pages
│   │   └── share/[token]/      # Shareable report links
│   └── api/
│       ├── analyze/            # AI assessment endpoint
│       ├── parse-resume/       # Resume parsing
│       ├── assessments/        # CRUD for assessments
│       └── admin/              # Admin API
├── components/
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   ├── RadarChart.tsx          # Recharts-based radar
│   ├── LanguageSwitcher.tsx
│   ├── StepIndicator.tsx
│   ├── UserNav.tsx
│   ├── ErrorBoundary.tsx
│   └── ui/                    # shadcn components
├── lib/
│   ├── constants.ts            # 15 dimensions, 5 categories, weights
│   ├── types.ts                # AssessmentResult, DimensionKey, etc.
│   ├── prompts.ts              # AI prompt templates
│   ├── mock-data.ts            # Dev/test mock data
│   └── supabase/               # Supabase client helpers
├── hooks/
│   └── useInView.ts            # Intersection Observer hook
├── i18n/                       # next-intl config
└── messages/
    ├── en.json
    ├── zh.json
    ├── ja.json
    └── ko.json
```

## Key Data Types

```typescript
// AssessmentResult (from lib/types.ts)
{
  weightedScore: number;          // 0-100
  archetype?: string;             // craftsperson | strategist | growth-hacker | visionary | operator
  scores: Record<DimensionKey, number>;       // 15 dimensions, each 0-5
  justifications: Record<DimensionKey, string>; // AI explanation per dimension
  topStrengths: StrengthItem[];
  topWeaknesses: WeaknessItem[];
  undervaluedExperiences: string[];
  missingElements: string[];
  nextSteps: string[];
  summary: string;
}
```

## Design System

### Colors (globals.css)

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `oklch(0.45 0.22 272)` | Deep indigo — buttons, links, accents |
| `--accent-warm` | `oklch(0.72 0.18 55)` | Coral gold — reserved for landing CTA |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red — errors |

### Score Level Colors

| Level | Score | Text | Background |
|-------|-------|------|------------|
| Expert | 86-100 | violet-600 | violet-50 |
| Advanced | 71-85 | blue-600 | blue-50 |
| Competent | 51-70 | emerald-600 | emerald-50 |
| Developing | 31-50 | amber-600 | amber-50 |
| Entry Level | 0-30 | slate-600 | slate-50 |

### Dimension Score Colors (in report grid)

- Strength (≥4): emerald tones
- Weak (≤2): amber tones
- Normal: slate tones

## Design Philosophy

- **16Personalities warmth + Linear restraint**: Archetype-first (not score-first), warm personality insights before cold numbers
- **Report hero card**: Shows archetype name prominently, score is secondary inline text
- **Landing page**: CSS stagger animations on hero, hover effects on cards
- **Dimension grid**: Clickable to expand AI justifications per dimension

## Assessment Flow

1. **Landing** (`/`) → CTA
2. **Onboarding** (`/assess/onboarding`) → Select target role type
3. **Input** (`/assess/input`) → Paste experience or upload resume
4. **Analyzing** (`/assess/analyzing`) → 4-step progress animation while AI works
5. **Report** (`/assess/report`) → Full results with archetype, radar, strengths, weaknesses, actions

Data flows via `sessionStorage` (`assessmentResult`, `assessmentInput`).

## Conventions

- Use `t()` from `useTranslations()` for all user-facing text
- i18n keys follow `section.key` pattern (e.g., `report.archetypeLabel`)
- All 4 locale files must stay in sync
- Use shadcn/ui components from `@/components/ui/`
- FadeInSection component for scroll-reveal animations
- tw-animate-css classes (`animate-in`, `fade-in`, `slide-in-from-bottom-3`) for entry animations

---

## Version History

### Phase 5 — Design Refinement (2026-03-04)

**Design direction**: 16Personalities warmth + Linear restraint

#### Changes:

1. **Color system** (`src/app/globals.css`)
   - `--primary`: `oklch(0.546 0.245 262.881)` → `oklch(0.45 0.22 272)` (deeper indigo, more professional)
   - `--ring`: updated to match new primary
   - Added `--accent-warm: oklch(0.72 0.18 55)` (coral gold, for landing CTA use)
   - Added `--color-accent-warm` to theme inline block for Tailwind access

2. **Report hero card restructure** (`src/app/[locale]/assess/report/page.tsx`)
   - **Before**: Giant score (text-7xl) dominates → small archetype name at bottom
   - **After**: Archetype name as hero (text-3xl/4xl) → decorative divider → description → level badge → score as inline text-sm
   - Fallback: preserves original score-first layout when no archetype is returned
   - Intent: 58-score user sees "The Craftsperson" first (positive identity), not "58/100" (failure feeling)

3. **Landing page micro-animations** (`src/app/[locale]/page.tsx`)
   - Hero stagger: 4 elements fade-in with 150ms delay intervals (trust badge → h1 → subtitle → buttons)
   - Sample report card: `hover:-translate-y-1 hover:shadow-2xl` lift effect
   - 3 feature cards: outer `hover:shadow-md hover:-translate-y-0.5` + inner mini preview `group-hover:scale-[1.02]`

4. **Dimension expand** (`src/app/[locale]/assess/report/page.tsx`)
   - Added `expandedDimensions` state (`Set<string>`)
   - Each dimension row in the score grid is now clickable (cursor-pointer + chevron icon)
   - Click toggles expand/collapse showing `result.justifications[dimKey]` text
   - Smooth animation with `animate-in fade-in slide-in-from-top-1`
   - Prepares for future paywall (free: top 3 only, paid: all)

### Phase 1-4 — Initial Build (pre-2026-03-04)

Core product built from scratch:
- Next.js 16 app with 4-locale i18n support (en/zh/ja/ko)
- OpenAI-powered 15-dimension PM assessment engine
- 5 PM archetypes (Craftsperson, Strategist, Growth Hacker, Visionary, Operator)
- Full report with radar chart, strengths, weaknesses, undervalued experiences, missing elements, next steps
- Supabase auth + assessment history storage
- PDF export and share functionality
- Pricing page with free/pro tiers
- Admin panel
- Resume upload + parsing (pdf-parse)
- Responsive design with shadcn/ui components
- Score count-up animation on report page
- FadeInSection scroll-reveal animations on landing
