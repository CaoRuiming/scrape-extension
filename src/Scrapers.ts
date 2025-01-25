export interface Scraper {
  /**
   * User-facing name for the Scraper.
   */
  name: string;
  /**
   * User-facing description for the Scraper. Describes how the Scraper works
   * and what kinds of args, if any, it can accept.
   */
  description: string;
  /**
   * Default value for the arg passed to {@link getContent} if applicable.
   */
  defaultArg: string;
  /**
   * Returns a string identifying/naming the scraped content. This function will
   * be injected into the tab to be scraped, so references to interfaces like
   * {@link document} and {@link window} may be used in the function.
   * @returns A string naming/identifying the scraped content.
   */
  getId: () => string;
  /**
   * Returns desired scraped content as a string. This function will be injected
   * into the tab to be scraped, so references to interfaces like
   * {@link document} and {@link window} may be used in the function.
   * @param arg Optional string arg provided by user to customize scraping
   * behavior.
   * @returns The scraped content as a string.
   */
  getContent: (arg?: string) => string;
}

const TextScraper = {
  name: "Text Scraper",
  description:
    "Extracts all paragraphs of text from a given document. Defaults to selecting elements that match the 'p' CSS selector, but can optionally accept a custom CSS selector as an arg.",
  defaultArg: "p",
  getId: () => document.title,
  getContent: (queryString?: string) => {
    return (
      Array.from(document.body.querySelectorAll(queryString || "p"))
        .map((x) => x.textContent)
        // remove suspiciously short lines
        .filter((x) => x?.length && x.length > 2)
        .join("\n")
        // collapse consecutive newlines
        .replaceAll(/(\n)((.{1})?(\n))*/g, "\n")
        .trim()
    );
  },
} as const satisfies Scraper;

const ImageUrlScraper = {
  name: "Image URL Scraper",
  description:
    "Extracts all image source urls from a given document. Defaults to selecting image elements that match the 'img' CSS selecor, but can optionally accept a custom CSS selecor as an arg.",
  defaultArg: "img",
  getId: () => document.title,
  getContent: (queryString?: string) => {
    return Array.from(document.querySelectorAll(queryString || "img"))
      .map((el: Element) => (el instanceof HTMLImageElement ? el.src : ""))
      .filter((x: string) => !!x)
      .join("\n");
  },
} as const satisfies Scraper;

/**
 * All {@link Scraper}s that can be used by this extension.
 */
export const SCRAPERS = [TextScraper, ImageUrlScraper] as const;

export type ScraperName = (typeof SCRAPERS)[number]["name"];

/**
 * Returns the {@link Scraper} corresponding to the given {@link scraperName}.
 * If no corresponding Scraper is found, return the first Scraper in
 * {@link SCRAPERS}.
 * @returns The {@link Scraper} with the given {@link scraperName}.
 */
export function getScraperFromName(scraperName: ScraperName): Scraper {
  return SCRAPERS.find((s) => s["name"] === scraperName) || SCRAPERS[0];
}
