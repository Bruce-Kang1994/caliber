"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { getContent, CARD_GRADIENTS, type ArchetypeKey } from "./content";

// ─── Question weights (locale-independent logic) ───
const WEIGHTS: { options: { weights: Partial<Record<ArchetypeKey, number>> }[] }[] = [
  { options: [{ weights: { "growth-hacker": 3, strategist: 1 } }, { weights: { strategist: 3, visionary: 1 } }, { weights: { craftsperson: 3, operator: 1 } }, { weights: { operator: 3, craftsperson: 1 } }] },
  { options: [{ weights: { visionary: 3, craftsperson: 1 } }, { weights: { "growth-hacker": 3, strategist: 1 } }, { weights: { craftsperson: 3, "growth-hacker": 1 } }, { weights: { operator: 3, strategist: 1 } }] },
  { options: [{ weights: { "growth-hacker": 3, craftsperson: 1 } }, { weights: { strategist: 3, visionary: 1 } }, { weights: { craftsperson: 3, operator: 1 } }, { weights: { operator: 3, "growth-hacker": 1 } }] },
  { options: [{ weights: { craftsperson: 3, operator: 1 } }, { weights: { strategist: 3, "growth-hacker": 1 } }, { weights: { "growth-hacker": 3, visionary: 1 } }, { weights: { operator: 3, strategist: 1 } }] },
  { options: [{ weights: { visionary: 3, strategist: 1 } }, { weights: { "growth-hacker": 3, operator: 1 } }, { weights: { strategist: 3, "growth-hacker": 1 } }, { weights: { craftsperson: 3, visionary: 1 } }] },
  { options: [{ weights: { craftsperson: 3, visionary: 1 } }, { weights: { "growth-hacker": 3, craftsperson: 1 } }, { weights: { strategist: 3, "growth-hacker": 1 } }, { weights: { operator: 3, strategist: 1 } }] },
  { options: [{ weights: { craftsperson: 3, "growth-hacker": 1 } }, { weights: { strategist: 3, operator: 1 } }, { weights: { visionary: 3, "growth-hacker": 1 } }, { weights: { operator: 3, craftsperson: 1 } }] },
  { options: [{ weights: { visionary: 3, craftsperson: 1 } }, { weights: { "growth-hacker": 3, strategist: 1 } }, { weights: { craftsperson: 3, operator: 1 } }, { weights: { strategist: 3, visionary: 1 } }] },
  { options: [{ weights: { craftsperson: 3, strategist: 1 } }, { weights: { "growth-hacker": 3, visionary: 1 } }, { weights: { strategist: 3, operator: 1 } }, { weights: { operator: 3, "growth-hacker": 1 } }] },
  { options: [{ weights: { craftsperson: 3, operator: 1 } }, { weights: { "growth-hacker": 3, strategist: 1 } }, { weights: { operator: 3, craftsperson: 1 } }, { weights: { strategist: 3, visionary: 1 } }] },
];

function calculateResults(answers: number[]) {
  const scores: Record<ArchetypeKey, number> = { craftsperson: 0, strategist: 0, "growth-hacker": 0, visionary: 0, operator: 0 };
  answers.forEach((optIdx, qIdx) => {
    for (const [key, w] of Object.entries(WEIGHTS[qIdx].options[optIdx].weights)) {
      scores[key as ArchetypeKey] += w;
    }
  });
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const sorted = (Object.entries(scores) as [ArchetypeKey, number][]).sort((a, b) => b[1] - a[1]);
  const percentages = {} as Record<ArchetypeKey, number>;
  sorted.forEach(([k, v]) => { percentages[k] = total > 0 ? Math.round((v / total) * 100) : 20; });
  return { primary: sorted[0][0], secondary: sorted[1][0], percentages, sorted };
}

// ─── Intro Screen ───
function IntroScreen({ onStart, locale }: { onStart: () => void; locale: string }) {
  const { archetypes, ui } = getContent(locale);
  const u = ui.intro;
  const keys: ArchetypeKey[] = ["craftsperson", "strategist", "growth-hacker", "visionary", "operator"];
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <p className="text-sm font-medium text-slate-400 tracking-wide mb-5">{u.badge}</p>
        <h1 className="text-4xl md:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.15]">{u.title}</h1>
        <p className="mt-5 text-base md:text-lg text-slate-500 leading-relaxed max-w-md mx-auto whitespace-pre-line">{u.subtitle}</p>
        <div className="mt-8">
          <Button size="lg" onClick={onStart} className="rounded-full px-10 h-12 text-sm font-medium">{u.startButton}</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
        {keys.map((key) => (
          <div key={key} className="group rounded-2xl border border-slate-200 bg-white p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-sm font-semibold text-slate-800 mb-1">{archetypes[key].name}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{archetypes[key].tagline}</div>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
            {u.noSignup}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            {u.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
            {u.instant}
          </span>
        </div>
        <p className="text-[11px] text-slate-300">{u.framework}</p>
      </div>
    </div>
  );
}

// ─── Question Screen ───
const OPT_LABELS = ["A", "B", "C", "D"];

function QuestionScreen({ index, total, selectedOption, onSelect, onNext, onPrev, locale }: {
  index: number; total: number; selectedOption: number | null;
  onSelect: (i: number) => void; onNext: () => void; onPrev: () => void; locale: string;
}) {
  const { questions, ui } = getContent(locale);
  const q = questions[index];
  const u = ui.quiz;
  const progress = ((index + 1) / total) * 100;
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      <div className="w-full bg-slate-100 h-1">
        <div className="h-full bg-slate-900 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex-1 flex flex-col px-6 py-8 md:py-12 max-w-[640px] mx-auto w-full">
        <div className="mb-8"><span className="text-xs font-medium text-slate-400">{index + 1} / {total}</span></div>
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed mb-8">{q.scenario}</h2>
        <div className="space-y-2.5 flex-1">
          {q.options.map((text, oi) => {
            const sel = selectedOption === oi;
            return (
              <button key={oi} onClick={() => onSelect(oi)}
                className={`w-full text-left rounded-xl px-4 py-3.5 border transition-all duration-150 cursor-pointer ${sel ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-semibold mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 ${sel ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>{OPT_LABELS[oi]}</span>
                  <span className="text-sm leading-relaxed">{text}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-10 flex items-center justify-between">
          <button onClick={onPrev} disabled={index === 0} className="text-sm text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">{u.prev}</button>
          <Button onClick={onNext} disabled={selectedOption === null} size="sm" className="rounded-full px-6 h-9 text-sm">
            {index === total - 1 ? u.viewResult : u.next}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Result Screen ───
function ResultScreen({ primary, secondary, percentages, sorted, onRestart, locale }: {
  primary: ArchetypeKey; secondary: ArchetypeKey;
  percentages: Record<ArchetypeKey, number>; sorted: [ArchetypeKey, number][];
  onRestart: () => void; locale: string;
}) {
  const { archetypes, ui } = getContent(locale);
  const p = archetypes[primary];
  const s = archetypes[secondary];
  const u = ui.result;
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveImage = useCallback(async () => {
    if (!shareCardRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareCardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `caliber-pm-${primary}.png`;
      a.click();
    } finally { setSaving(false); }
  }, [primary, saving]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `${p.name} — Caliber`, text: p.tagline, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [p.name, p.tagline]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      {/* Share card */}
      <div ref={shareCardRef} className="rounded-2xl overflow-hidden mb-8" style={{ background: CARD_GRADIENTS[primary] }}>
        <div className="px-8 py-12 md:py-16 text-center text-white">
          <p className="text-sm font-medium text-white/60 mb-6 tracking-wide">{u.yourType}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{p.name}</h1>
          <p className="text-base text-white/75 mb-8">{p.tagline}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {p.traits.map((t) => (<span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{t}</span>))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm font-semibold bg-white/20 rounded-full px-4 py-1">{percentages[primary]}% {u.match}</span>
            <span className="text-xs text-white/50">{u.secondary}: {s.name} {percentages[secondary]}%</span>
          </div>
          <p className="mt-6 text-[11px] text-white/30 tracking-wider">{u.brandmark}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button onClick={handleSaveImage} disabled={saving} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          {saving ? u.saving : u.saveImage}
        </button>
        <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
          {copied ? u.copied : u.share}
        </button>
        <button onClick={onRestart} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 transition-colors">{u.retest}</button>
      </div>

      {/* Description */}
      <p className="text-base text-slate-600 leading-[1.8] mb-8">{p.description}</p>

      {/* Distribution */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-6">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">{u.distribution}</h3>
        <div className="space-y-3">
          {sorted.map(([key]) => {
            const a = archetypes[key]; const pct = percentages[key]; const isPrimary = key === primary;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className={`text-sm w-28 shrink-0 ${isPrimary ? "font-semibold text-slate-900" : "text-slate-500"}`}>{a.name}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ease-out ${isPrimary ? "bg-slate-900" : "bg-slate-300"}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-xs w-8 text-right tabular-nums ${isPrimary ? "font-semibold text-slate-900" : "text-slate-400"}`}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Blind Spots */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-3">{u.strengths}</h3>
          <ul className="space-y-2.5">
            {p.strengths.map((str, i) => (<li key={i} className="flex items-start gap-2.5"><span className="text-emerald-500 mt-0.5 shrink-0 text-sm">+</span><span className="text-sm text-slate-600 leading-relaxed">{str}</span></li>))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-3">{u.blindSpots}</h3>
          <ul className="space-y-2.5">
            {p.blindSpots.map((b, i) => (<li key={i} className="flex items-start gap-2.5"><span className="text-amber-500 mt-0.5 shrink-0 text-sm">!</span><span className="text-sm text-slate-600 leading-relaxed">{b}</span></li>))}
          </ul>
        </div>
      </div>

      {/* Secondary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-10">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-sm font-semibold text-slate-800">{u.secondaryType}: {s.name}</span>
          <span className="text-xs text-slate-400">{percentages[secondary]}%</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          {u.secondaryDesc({ sName: s.name, pct: percentages[secondary], trait1: s.traits[0], trait2: s.traits[1], pName: p.name })}
        </p>
      </div>

      {/* CTA */}
      <div className="rounded-xl bg-slate-900 p-6 md:p-8 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">{u.ctaTitle}</h3>
        <p className="text-sm text-slate-400 mb-5 max-w-sm mx-auto">{u.ctaDesc}</p>
        <Link href="/assess"><Button size="sm" className="rounded-full px-6 bg-white text-slate-900 hover:bg-slate-100">{u.ctaButton}</Button></Link>
      </div>
      <p className="text-center text-[11px] text-slate-300 mt-8">{u.framework}</p>
    </div>
  );
}

// ─── Main Page ───
export default function ArchetypeQuizPage() {
  const locale = useLocale();
  const { questions } = getContent(locale);
  const totalQ = questions.length;
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(totalQ).fill(null));

  const handleSelect = useCallback((i: number) => { setAnswers((prev) => { const n = [...prev]; n[currentQ] = i; return n; }); }, [currentQ]);
  const handleNext = useCallback(() => { currentQ < totalQ - 1 ? setCurrentQ((p) => p + 1) : setPhase("result"); }, [currentQ, totalQ]);
  const handlePrev = useCallback(() => { if (currentQ > 0) setCurrentQ((p) => p - 1); }, [currentQ]);
  const handleRestart = useCallback(() => { setPhase("intro"); setCurrentQ(0); setAnswers(new Array(totalQ).fill(null)); }, [totalQ]);

  const result = useMemo(() => {
    if (phase !== "result") return null;
    const valid = answers.filter((a): a is number => a !== null);
    if (valid.length !== totalQ) return null;
    return calculateResults(valid);
  }, [phase, answers, totalQ]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <AppHeader showNav showAuth />
      <main className="flex-1">
        {phase === "intro" && <IntroScreen onStart={() => setPhase("quiz")} locale={locale} />}
        {phase === "quiz" && (
          <QuestionScreen index={currentQ} total={totalQ} selectedOption={answers[currentQ]}
            onSelect={handleSelect} onNext={handleNext} onPrev={handlePrev} locale={locale} />
        )}
        {phase === "result" && result && (
          <ResultScreen primary={result.primary} secondary={result.secondary}
            percentages={result.percentages} sorted={result.sorted} onRestart={handleRestart} locale={locale} />
        )}
      </main>
      {phase !== "quiz" && <AppFooter />}
    </div>
  );
}
