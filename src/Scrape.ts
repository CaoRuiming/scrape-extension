import DataStoreService from "./DataStoreService.js";
import { getScraperFromName, Scraper } from "./Scrapers.js";
import SettingsService from "./SettingsService.js";
import { getActiveTabId } from "./Util.js";

/**
 * Run the currently active {@link Scraper} on the active tab and saves the
 * scraped data into browser local storage ({@link DataStore}).
 */
export async function scrape(): Promise<{
  id: string;
  content: string;
}> {
  const { scraperArg, currentScraperName } =
    await SettingsService.getSettings();
  const scraper = getScraperFromName(currentScraperName);
  const { result: content } = (
    await chrome.scripting.executeScript({
      target: { tabId: await getActiveTabId() },
      func: scraper.getContent,
      args: [scraperArg],
    })
  )[0];

  const { result: id } = (
    await chrome.scripting.executeScript({
      target: { tabId: await getActiveTabId() },
      func: scraper.getId,
    })
  )[0];

  if (!id || !content) {
    throw new Error("No results from scrape");
  }

  await DataStoreService.saveScrapedData(id, content);

  return { id, content };
}

/**
 * Retrieve the scrape id for the currently active {@link Scraper} on the active
 * tab.
 * @returns Scrape id that can be used to index into {@link DataStore}.
 */
export async function getScrapeId(): Promise<string> {
  const { currentScraperName } = await SettingsService.getSettings();
  const scraper = getScraperFromName(currentScraperName);
  const { result: id } = (
    await chrome.scripting.executeScript({
      target: { tabId: await getActiveTabId() },
      func: scraper.getId,
    })
  )[0];

  if (!id) {
    throw new Error("Unable to get scrape id for active tab");
  }

  return id;
}
