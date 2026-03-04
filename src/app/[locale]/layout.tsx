import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import { routing } from "@/i18n/routing";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://caliber.pm"),
  title: "Caliber — What's Your PM Caliber?",
  description:
    "AI-powered capability assessment across 15 dimensions, tailored to your target PM role. Get evidence-based scores and a personalized upgrade plan.",
  openGraph: {
    title: "Caliber — What's Your PM Caliber?",
    description:
      "AI-powered capability assessment across 15 dimensions, tailored to your target PM role.",
    siteName: "Caliber",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caliber — What's Your PM Caliber?",
    description:
      "AI-powered capability assessment across 15 dimensions, tailored to your target PM role.",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
