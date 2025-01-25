import { downloadBlob } from "./Util.js";

export interface DataStore {
  /**
   * Mapping of scraped page ids to scraped page contents.
   */
  scrapedData: Record<string, string>;
}
const DEFAULT_DATASTORE: DataStore = Object.freeze({
  scrapedData: {},
});

const STORAGE_KEY = "datastore";

/**
 * Service class containing static methods for interacting with scraped data
 * stored in browser local storage.
 */
export default class DataStoreService {
  /**
   * Retreives the whole {@link DataStore} object from browser local storage.
   * @returns {@link DataStore} object.
   */
  static async getDataStore(): Promise<DataStore> {
    const { [STORAGE_KEY]: dataStore } =
      await chrome.storage.local.get(STORAGE_KEY);
    return { ...DEFAULT_DATASTORE, ...dataStore };
  }

  /**
   * Saves/overwrites a {@link DataStore} object into browser local storage.
   * @param dataStore {@link DataStore} object to save.
   */
  static async saveDataStore(dataStore: DataStore): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: dataStore });
  }

  /**
   * Saves the given scraped {@link content} under the given {@link id} to the
   * {@link DataStore} saved in browser local storage.
   * @param id ID/name of scraped content to save.
   * @param content Scraped content to save.
   */
  static async saveScrapedData(id: string, content: string): Promise<void> {
    const oldDataStore = await DataStoreService.getDataStore();
    const { scrapedData: oldScrapedData } = oldDataStore;
    await DataStoreService.saveDataStore({
      ...oldDataStore,
      scrapedData: { ...oldScrapedData, [id]: content },
    });
  }

  /**
   * Exports {@link DataStore.scrapedData} from browser local storage to a JSON
   * file.
   */
  static async exportScrapedData(): Promise<void> {
    const { scrapedData } = await DataStoreService.getDataStore();
    const blob: Blob = new Blob([JSON.stringify(scrapedData)], {
      type: "application/json",
    });
    await downloadBlob(blob, "ScrapedData.json");
  }
}
