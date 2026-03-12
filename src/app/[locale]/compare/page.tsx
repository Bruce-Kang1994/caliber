"use client";

import { Link } from "@/i18n/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { ArrowRight, Palette, Layout, Layers } from "lucide-react";

const variants = [
  {
    id: "frontend-design",
    name: "Variant A — Frontend Design",
    philosophy: "Bold, unexpected, anti-generic",
    description:
      "Warm coral + amber palette, asymmetric layouts, decorative geometric shapes, serif headings, creative hover effects. Feels like a design portfolio.",
    color: "from-orange-400 to-rose-400",
    bgTint: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    icon: Palette,
  },
  {
    id: "ui-ux-pro-max",
    name: "Variant B — UI/UX Pro Max",
    philosophy: "Swiss Minimalist, systematic, accessible",
    description:
      "Trust blue + emerald CTA, clean white backgrounds, strict grid, semantic HTML, ARIA labels, 4.5:1 contrast. Closest to the Exponent reference.",
    color: "from-blue-500 to-cyan-400",
    bgTint: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: Layout,
  },
  {
    id: "theme-factory",
    name: 'Variant C — Theme Factory ("Tech Innovation")',
    philosophy: "Cohesive violet tech theme, modern startup",
    description:
      "Deep violet + cyan + rose, dot-grid patterns, gradient text effects, consistent theme system. Professional tech startup feel.",
    color: "from-violet-500 to-purple-500",
    bgTint: "bg-violet-50",
    borderColor: "border-violet-200",
    textColor: "text-violet-700",
    icon: Layers,
  },
];

export default function CompareOverviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader showNav showAuth showCta />

      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Scale Showdown: 3 Visual Skills Compared
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Same product, same content, three completely different design
            approaches. Click each variant to see the full Landing Page, then
            pick your favorite.
          </p>
        </div>

        <div className="grid gap-6">
          {variants.map((v) => {
            const Icon = v.icon;
            return (
              <Link
                key={v.id}
                href={`/compare/${v.id}`}
                className={`group block rounded-2xl border ${v.borderColor} ${v.bgTint} p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center shrink-0 text-white shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {v.name}
                      </h2>
                    </div>
                    <p className={`text-sm font-medium ${v.textColor} mb-2`}>
                      {v.philosophy}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-400 group-hover:text-slate-700 transition-colors shrink-0 mt-1">
                    View
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 p-5 rounded-xl bg-slate-50 border border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">Rollback:</span>{" "}
            These variants live in <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/compare/*</code>.
            The original landing page is untouched. Run{" "}
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
              git tag pre-scale-comparison
            </code>{" "}
            to see the rollback point.
          </p>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
