import {
  getScraperFromName,
  Scraper,
  ScraperName,
  SCRAPERS,
} from "./Scrapers.js";

export interface Settings {
  /**
   * Name of the currently active scraper.
   */
  currentScraperName: ScraperName;
  scraperArg: string;
}
const DEFAULT_SCRAPER = SCRAPERS[0];
const DEFAULT_SETTINGS: Settings = Object.freeze({
  currentScraperName: DEFAULT_SCRAPER.name,
  scraperArg: DEFAULT_SCRAPER.defaultArg,
});

const STORAGE_KEY = "settings";

/**
 * Service class containing static methods for interacting with settings.
 */
export default class SettingsService {
  /**
   * Retreives a Settings object from browser local storage.
   * @returns Settings object.
   */
  static async getSettings(): Promise<Settings> {
    const { [STORAGE_KEY]: settings } =
      await chrome.storage.local.get(STORAGE_KEY);
    return { ...DEFAULT_SETTINGS, ...settings };
  }

  /**
   * Saves a Settings object into browser local storage.
   * @param settings Settings object to save.
   */
  static async saveSettings(settings: Settings): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  }
}
