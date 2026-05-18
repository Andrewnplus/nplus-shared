export interface MetaInput {
  /** Page-specific title segment (will be combined with siteName). */
  title: string;
  /** Brand / site name shown after the title. */
  siteName: string;
  /** Separator between title and siteName. Defaults to " · ". */
  separator?: string;
  description: string;
  /** Absolute or root-relative URL for the OG image. */
  image?: string;
  /** Canonical URL for this page. */
  url: URL | string;
  /** Set to true on /404 etc. */
  noindex?: boolean;
  /** "website" or "article". */
  ogType?: "website" | "article";
}

export interface MetaOutput {
  fullTitle: string;
  canonical: string;
  description: string;
  ogType: "website" | "article";
  ogImage: string | undefined;
  noindex: boolean;
}

/**
 * Build SEO meta values for a page. Pure function — no DOM, no Astro coupling.
 * Use in a layout's frontmatter, then pass the output into <meta> tags.
 */
export function buildMeta(input: MetaInput): MetaOutput {
  const sep = input.separator ?? " · ";
  const fullTitle = input.title ? `${input.title}${sep}${input.siteName}` : input.siteName;
  return {
    fullTitle,
    canonical: input.url.toString(),
    description: input.description,
    ogType: input.ogType ?? "website",
    ogImage: input.image,
    noindex: input.noindex ?? false,
  };
}
