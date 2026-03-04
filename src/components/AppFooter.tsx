"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AppFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Caliber. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <Link href="/pricing" className="hover:text-slate-900 transition-colors">
            {t("common.pricing")}
          </Link>
          <Link href="/auth" className="hover:text-slate-900 transition-colors">
            {t("common.signIn")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
