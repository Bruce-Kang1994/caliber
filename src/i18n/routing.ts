import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh", "ja", "ko", "fr", "es"],
  defaultLocale: "en",
});
