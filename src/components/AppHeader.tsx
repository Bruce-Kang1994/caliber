"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { StepIndicator } from "@/components/StepIndicator";
import { UserNav } from "@/components/UserNav";

interface AppHeaderProps {
  showNav?: boolean;
  showAuth?: boolean;
  showCta?: boolean;
  currentStep?: number | null;
  activePricingLink?: boolean;
}

export function AppHeader({
  showNav = false,
  showAuth = false,
  showCta = false,
  currentStep = null,
  activePricingLink = false,
}: AppHeaderProps) {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasRightItems = showAuth || showCta || showNav;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-6xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <rect width="512" height="512" rx="108" fill="#3730A3"/>
              <path d="M136 316 A150 150 0 1 1 376 316" stroke="rgba(255,255,255,0.25)" strokeWidth="36" strokeLinecap="round" fill="none"/>
              <path d="M136 316 A150 150 0 1 1 348 178" stroke="white" strokeWidth="36" strokeLinecap="round" fill="none"/>
              <line x1="256" y1="256" x2="340" y2="186" stroke="white" strokeWidth="14" strokeLinecap="round"/>
              <circle cx="256" cy="256" r="20" fill="white"/>
            </svg>
            Caliber
          </Link>
          {showNav && (
            <Link
              href="/pricing"
              className={`hidden sm:inline text-sm font-medium transition-colors ${
                activePricingLink
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t("common.pricing")}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {currentStep !== null && (
            <span className="hidden sm:inline">
              <StepIndicator current={currentStep} total={4} />
            </span>
          )}
          {/* Desktop nav items */}
          <span className="hidden sm:flex items-center gap-3">
            {(showAuth || showCta) && <UserNav />}
          </span>
          {/* Mobile hamburger */}
          {hasRightItems && (
            <button
              className="sm:hidden p-1.5 text-slate-600 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-3">
          {currentStep !== null && (
            <div className="text-sm text-slate-500">
              <StepIndicator current={currentStep} total={4} />
            </div>
          )}
          {showNav && (
            <Link
              href="/pricing"
              className={`block text-sm font-medium ${
                activePricingLink ? "text-blue-600" : "text-slate-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("common.pricing")}
            </Link>
          )}
          {(showAuth || showCta) && <UserNav />}
        </div>
      )}
    </header>
  );
}
