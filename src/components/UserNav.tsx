"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function UserNav() {
  const t = useTranslations();
  const router = useRouter();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth">
          <Button size="sm" variant="ghost" className="text-slate-600">
            {t("common.signIn")}
          </Button>
        </Link>
        <Link href="/assess">
          <Button size="sm">{t("common.getStarted")}</Button>
        </Link>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = user.user_metadata?.avatar_url;
  const initial = displayName[0]?.toUpperCase() || "U";

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:bg-slate-100 transition-colors p-1 pr-3"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={32}
            height={32}
            unoptimized
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {initial}
          </div>
        )}
        <span className="text-sm font-medium text-slate-700 hidden sm:block">
          {displayName}
        </span>
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          <Link
            href="/assess"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {t("common.getStarted")}
          </Link>
          <Link
            href="/history"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {t("nav.history")}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {t("nav.admin")}
            </Link>
          )}
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            {t("nav.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
