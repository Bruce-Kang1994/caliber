"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AppFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
              <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <rect width="512" height="512" rx="108" fill="#3730A3"/>
                <path d="M136 316 A150 150 0 1 1 376 316" stroke="rgba(255,255,255,0.25)" strokeWidth="36" strokeLinecap="round" fill="none"/>
                <path d="M136 316 A150 150 0 1 1 348 178" stroke="white" strokeWidth="36" strokeLinecap="round" fill="none"/>
                <line x1="256" y1="256" x2="340" y2="186" stroke="white" strokeWidth="14" strokeLinecap="round"/>
                <circle cx="256" cy="256" r="20" fill="white"/>
              </svg>
              Caliber
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-[200px]">
              {t("common.tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link href="/framework" className="hover:text-slate-900 transition-colors">
                  {t("common.framework")}
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="hover:text-slate-900 transition-colors">
                  {t("common.useCases")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-900 transition-colors">
                  {t("common.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link href="/blog" className="hover:text-slate-900 transition-colors">
                  {t("common.blog")}
                </Link>
              </li>
              <li>
                <Link href="/assess" className="hover:text-slate-900 transition-colors">
                  {t("common.startAssessment")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link href="/about" className="hover:text-slate-900 transition-colors">
                  {t("common.about")}
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-slate-900 transition-colors">
                  {t("common.signIn")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-6 text-sm text-slate-400 text-center">
          &copy; {new Date().getFullYear()} Caliber. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
