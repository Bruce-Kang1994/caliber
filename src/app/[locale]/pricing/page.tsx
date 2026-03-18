"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-5 h-5 text-blue-500 shrink-0 mt-0.5"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  const t = useTranslations();
  const [loading, setLoading] = useState<"single" | "pro" | null>(null);

  const freeFeatures = t.raw("pricing.freePlanFeatures") as string[];
  const singleFeatures = t.raw("pricing.singlePlanFeatures") as string[];
  const proFeatures = t.raw("pricing.proPlanFeatures") as string[];

  const faqs = [
    { q: t("pricing.faq1Q"), a: t("pricing.faq1A") },
    { q: t("pricing.faq2Q"), a: t("pricing.faq2A") },
    { q: t("pricing.faq3Q"), a: t("pricing.faq3A") },
    { q: t("pricing.faq4Q"), a: t("pricing.faq4A") },
  ];

  async function handleCheckout(plan: "single" | "pro") {
    setLoading(plan);
    try {
      const currentLocale = window.location.pathname.match(/^\/(en|zh|ja|ko|fr|es)/)?.[1] || "en";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          locale: currentLocale,
          from: document.referrer.includes("/assess/report") ? "report" : "pricing",
        }),
      });

      if (res.status === 401) {
        // Not logged in — redirect to sign in
        window.location.href = `/${currentLocale}/auth`;
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || t("common.error"));
      }
    } catch {
      alert(t("common.error"));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader showNav showAuth showCta activePricingLink />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {t("pricing.title")}
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* 3-Tier Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="border-slate-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg text-slate-700">
                {t("pricing.freePlan")}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900">
                  {t("pricing.freePlanPrice")}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {t("pricing.freePlanDesc")}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {freeFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <CheckIcon />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/assess" className="block">
                  <Button variant="outline" className="w-full">
                    {t("pricing.currentPlan")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Single Report Plan — Highlighted */}
          <Card className="border-blue-200 ring-2 ring-blue-600 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-3 py-1">
                {t("pricing.mostPopular")}
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg text-blue-700">
                {t("pricing.singlePlan")}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900">
                  {t("pricing.singlePlanPrice")}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {t("pricing.singlePlanDesc")}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {singleFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <CheckIcon />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  className="w-full"
                  onClick={() => handleCheckout("single")}
                  disabled={loading !== null}
                >
                  {loading === "single" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("pricing.getFullReport")}
                    </span>
                  ) : (
                    t("pricing.getFullReport")
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-slate-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg text-slate-700">
                {t("pricing.proPlan")}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900">
                  {t("pricing.proPlanPrice")}
                </span>
                <span className="text-slate-500 text-sm">
                  {t("pricing.proPlanPeriod")}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {t("pricing.proPlanDesc")}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {proFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <CheckIcon />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleCheckout("pro")}
                  disabled={loading !== null}
                >
                  {loading === "pro" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      {t("pricing.upgrade")}
                    </span>
                  ) : (
                    t("pricing.upgrade")
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16" />

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t("pricing.faq")}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
