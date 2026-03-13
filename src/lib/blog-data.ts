export interface BlogPost {
  slug: string;
  date: string;
  readTime: number; // minutes
  category: string;
  categoryColor: string;
  coverGradient: string; // tailwind gradient classes
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "scientific-pm-assessment",
    date: "2026-03-10",
    readTime: 8,
    category: "methodology",
    categoryColor: "indigo",
    coverGradient: "from-indigo-500 to-violet-600",
  },
  {
    slug: "ai-era-pm-skills",
    date: "2026-03-07",
    readTime: 6,
    category: "trends",
    categoryColor: "emerald",
    coverGradient: "from-emerald-500 to-cyan-600",
  },
  {
    slug: "pm-growth-ladder",
    date: "2026-03-04",
    readTime: 10,
    category: "career",
    categoryColor: "violet",
    coverGradient: "from-violet-500 to-purple-600",
  },
  {
    slug: "data-driven-decision",
    date: "2026-03-01",
    readTime: 7,
    category: "skills",
    categoryColor: "cyan",
    coverGradient: "from-cyan-500 to-blue-600",
  },
  {
    slug: "cross-cultural-pm",
    date: "2026-02-26",
    readTime: 5,
    category: "leadership",
    categoryColor: "amber",
    coverGradient: "from-amber-500 to-orange-600",
  },
];
