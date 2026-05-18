const CJK_CHARS_PER_MIN = 300;
const ENGLISH_WORDS_PER_MIN = 200;
const CJK = /[一-鿿㐀-䶿]/g;

/**
 * Estimate reading time for mixed Chinese/English text.
 * Returns minutes (minimum 1).
 */
export function readingTime(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!?\[.*?\]\(.*?\)/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>|-]/g, "");

  const cjkCount = cleaned.match(CJK)?.length ?? 0;

  const withoutCjk = cleaned.replace(CJK, " ");
  const englishCount = withoutCjk.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)).length;

  const minutes = cjkCount / CJK_CHARS_PER_MIN + englishCount / ENGLISH_WORDS_PER_MIN;
  return Math.max(1, Math.round(minutes));
}
