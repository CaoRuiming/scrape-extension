import SettingsService from "./SettingsService.js";
import { getActiveTabId } from "./Util.js";

/**
 * Scraping script that is injected into the active tab. Saves result to
 * clipboard and logs to console.
 * @param queryString
 * @returns scraped text
 */
function scrapeFunc(queryString: string): string {
  const result = Array.from(document.body.querySelectorAll(queryString))
    .map((x) => x.textContent)
    // remove suspiciously short lines
    .filter((x) => x?.length && x.length > 2)
    .join("\n")
    // collapse consecutive newlines
    .replaceAll(/(\n)((.{1})?(\n))*/g, "\n");
  navigator.clipboard.writeText(result);
  console.log(result);
  return result;
}

export async function scrape(): Promise<void> {
  const { queryString } = await SettingsService.getSettings();
  const { result } = (
    await chrome.scripting.executeScript({
      target: { tabId: await getActiveTabId() },
      func: scrapeFunc,
      args: [queryString],
    })
  )[0];

  if (!result) {
    throw new Error("No results from scrape");
  }
}
