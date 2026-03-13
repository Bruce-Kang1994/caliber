"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const t = useTranslations();
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f5f5f7]">
        <AppHeader showNav showAuth />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <h1 className="text-2xl font-bold text-slate-900">404</h1>
          <p className="mt-2 text-slate-500">Article not found</p>
          <Link href="/blog" className="mt-6">
            <Button variant="outline" className="rounded-full">
              {t("blog.backToList")}
            </Button>
          </Link>
        </div>
        <AppFooter />
      </div>
    );
  }

  const categoryColorMap: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    violet: "bg-violet-100 text-violet-700",
    cyan: "bg-cyan-100 text-cyan-700",
    amber: "bg-amber-100 text-amber-700",
  };
  const badgeClass = categoryColorMap[post.categoryColor] || "bg-slate-100 text-slate-700";

  const content = t(`blog.${post.slug}.content`);
  // Render markdown-like content: ## headings, **bold**, \n\n paragraphs
  const renderContent = (raw: string) => {
    if (!raw) return <p className="text-slate-400 italic">Content coming soon...</p>;

    return raw.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold text-slate-900 mt-10 mb-4">
            {block.slice(3)}
          </h2>
        );
      }
      // Handle bold **text**
      const parts = block.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-base text-slate-600 leading-relaxed mb-4">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AppHeader showNav showAuth />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          {t("blog.backToList")}
        </Link>

        {/* Header */}
        <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${post.coverGradient} mb-6`} />
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeClass}`}>
            {t(`blog.categories.${post.category}`)}
          </span>
          <span className="text-xs text-slate-400">{post.date}</span>
          <span className="text-xs text-slate-400">
            {t("blog.readTime", { min: post.readTime })}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          {t(`blog.${post.slug}.title`)}
        </h1>
        <p className="mt-4 text-lg text-slate-500 leading-relaxed">
          {t(`blog.${post.slug}.excerpt`)}
        </p>

        {/* Divider */}
        <div className="my-10 h-px bg-slate-200" />

        {/* Content */}
        <div className="prose-caliber">
          {renderContent(content)}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-white rounded-2xl border border-slate-200/60 text-center">
          <h3 className="text-lg font-bold text-slate-900">
            {t("landing.ctaTitle")}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {t("landing.ctaSubtitle")}
          </p>
          <Link href="/assess" className="mt-5 inline-block">
            <Button size="lg" className="rounded-full px-8">
              {t("common.getStarted")}
            </Button>
          </Link>
        </div>
      </article>

      <AppFooter />
    </div>
  );
}
