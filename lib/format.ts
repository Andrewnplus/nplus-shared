/**
 * Format a date for display.
 * @param style "short" → "Mar 17, 2026"; "long" → "March 17, 2026"; "iso" → "2026.03.17"
 */
export function formatDate(d: Date, style: "short" | "long" | "iso" = "short"): string {
  if (style === "iso") return d.toISOString().slice(0, 10).replace(/-/g, ".");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  });
}
