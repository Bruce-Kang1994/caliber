"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function BlogListPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AppHeader showNav showAuth />

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          {t("blog.title")}
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          {t("blog.subtitle")}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid gap-6">
          {BLOG_POSTS.map((post, i) => {
            const categoryColorMap: Record<string, string> = {
              indigo: "bg-indigo-100 text-indigo-700",
              emerald: "bg-emerald-100 text-emerald-700",
              violet: "bg-violet-100 text-violet-700",
              cyan: "bg-cyan-100 text-cyan-700",
              amber: "bg-amber-100 text-amber-700",
            };
            const badgeClass = categoryColorMap[post.categoryColor] || "bg-slate-100 text-slate-700";

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Color bar top */}
                  <div className={`h-1.5 bg-gradient-to-r ${post.coverGradient}`} />
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeClass}`}>
                        {t(`blog.categories.${post.category}`)}
                      </span>
                      <span className="text-xs text-slate-400">{post.date}</span>
                      <span className="text-xs text-slate-400">
                        {t("blog.readTime", { min: post.readTime })}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {t(`blog.${post.slug}.title`)}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {t(`blog.${post.slug}.excerpt`)}
                    </p>
                    <span className="inline-block mt-4 text-sm font-medium text-indigo-600 group-hover:underline">
                      {t("blog.readMore")} →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
