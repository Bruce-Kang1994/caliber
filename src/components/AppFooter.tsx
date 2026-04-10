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

        {/* Author bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span>{t("common.builtBy")}</span>
            <a
              href="https://kangxin.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t("common.builtByName")}
            </a>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">{t("common.openExperiment")}</span>
          </div>
          <div className="flex items-center gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/Bruce-Kang1994"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" clipRule="evenodd" />
              </svg>
            </a>
            {/* Email */}
            <a
              href="mailto:bruce@motiful.ai"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </a>
            {/* Personal site */}
            <a
              href="https://kangxin.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Personal website"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.468.73-3.563" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
