import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

function deepMerge(base: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };

  for (const [key, value] of Object.entries(overrides)) {
    const existing = result[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing)
    ) {
      result[key] = deepMerge(existing as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const baseMessages = (await import("../messages/en.json")).default;
  const localeMessages =
    locale === "en"
      ? {}
      : (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages: deepMerge(baseMessages as Record<string, unknown>, localeMessages as Record<string, unknown>),
  };
});
