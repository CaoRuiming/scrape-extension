import DataStoreService from "./DataStoreService.js";
import { create } from "./Dom.js";
import { getScrapeId, scrape } from "./Scrape.js";
import { getScraperFromName, ScraperName, SCRAPERS } from "./Scrapers.js";
import SettingsService from "./SettingsService.js";
import { notify, errorToString } from "./Util.js";

/**
 * Component that can trigger a page scrape, display scraped data in an editable
 * textarea, and save manual edits to scraped data.
 */
export const scrapeComponent: HTMLElement = (() => {
  const scrapedDataEditor: HTMLTextAreaElement = create("textarea", {
    attributes: {
      type: "number",
      step: "1",
      placeholder: "Scraped data for current tab",
      rows: "10",
    },
    onCreate: async (textarea) => {
      const { scrapedData: storedScrapedData } =
        await DataStoreService.getDataStore();
      const scrapeId = await getScrapeId();
      textarea.value = storedScrapedData[scrapeId] ?? "";
    },
  });
  const saveEditedScrapedDataButton: HTMLButtonElement = create("button", {
    content: "Save Scraped Data",
    attributes: {
      title: "Save the text in the editor as this tab's scraped content",
    },
    onClick: async () => {
      try {
        const scrapeId = await getScrapeId();
        await DataStoreService.saveScrapedData(
          scrapeId,
          scrapedDataEditor.value,
        );
      } catch (error) {
        notify("Save failed: ", errorToString(error));
      }
      notify("Save successful!");
    },
  });
  const scrapeButton: HTMLButtonElement = create("button", {
    content: "Scrape",
    attributes: { title: "Scrape the current tab!" },
    onClick: async () => {
      let scrapedId: string;
      try {
        const { id, content } = await scrape();
        scrapedId = id;
        scrapedDataEditor.value = content;
      } catch (error) {
        notify("Scrape failed: ", errorToString(error));
        return;
      }
      notify(`Scrape successful for "${scrapedId}"!`);
    },
  });
  return create("div", {
    content: [scrapeButton, scrapedDataEditor, saveEditedScrapedDataButton],
  });
})();

let scraperArgInput: HTMLInputElement;

/**
 * Component for viewing and editing the arg string that will be passed to the
 * currently active {@link Scraper} when a scrape is initiated.
 */
export const scraperArgComponent: HTMLElement = (() => {
  scraperArgInput = create("input", {
    attributes: { type: "text", placeholder: "Scraper arg" },
    onCreate: async (input) => {
      input.value = (await SettingsService.getSettings()).scraperArg;
    },
  });
  const scraperArgButton: HTMLButtonElement = create("button", {
    content: "Save Scraper Arg",
    attributes: {
      title: "Save the current string as the Scraper arg",
    },
    onClick: async () => {
      try {
        const oldSettings = await SettingsService.getSettings();
        const scraperArg = scraperArgInput.value;
        await SettingsService.saveSettings({ ...oldSettings, scraperArg });
      } catch (error) {
        notify("Save failed: ", errorToString(error));
        return;
      }
      notify("Successfully saved new Scraper arg");
    },
  });
  return create("div", { content: [scraperArgInput, scraperArgButton] });
})();

/**
 * Component that displays the currently active {@link Scraper}, lists all
 * available Scrapers, and allows the user to change active scrapers.
 */
export const scraperSelectorComponent: HTMLSelectElement = (() => {
  return create("select", {
    attributes: {
      name: "scraper",
      required: "true",
    },
    onCreate: async (select) => {
      const { currentScraperName } = await SettingsService.getSettings();
      select.value = currentScraperName;
    },
    onChange: async (event) => {
      try {
        const selectElement = event.target as HTMLSelectElement;
        const newScraperName = selectElement.value as ScraperName;
        const newScraper = getScraperFromName(newScraperName);
        const oldSettings = await SettingsService.getSettings();
        await SettingsService.saveSettings({
          ...oldSettings,
          scraperArg: newScraper.defaultArg,
          currentScraperName: newScraperName,
        });
        scraperArgInput.value = newScraper.defaultArg;
      } catch (error) {
        notify("Failed to change Scrapers: " + errorToString(error));
      }
    },
    content: SCRAPERS.map((scraper) =>
      create("option", {
        attributes: { value: scraper.name, title: scraper.description },
        content: scraper.name,
      }),
    ),
  });
})();

/**
 * A button that opens the extension's options page in a new tab.
 */
export const scrapeSettingsComponent: HTMLButtonElement = create("button", {
  content: "Scrape Options",
  attributes: { title: "Open the options page for Scrape extension" },
  onClick: () => {
    chrome.tabs.create({ active: true, url: "/html/options.html" });
  },
});

/**
 * A button that exports all currently saved scraped data to a JSON file.
 */
export const scrapeDataExportComponent: HTMLButtonElement = create("button", {
  content: "Scrape Data Export",
  attributes: {
    title: "Export all currently saved scraped data as a text file",
  },
  onClick: async () => {
    try {
      await DataStoreService.exportScrapedData();
    } catch (error) {
      notify("Export failed: ", errorToString(error));
    }
  },
});

/**
 * A button that exports all currently saved scraped data to a JSON file and
 * clears all scraped data saved in browser local storage.
 */
export const scrapeDataClearComponent: HTMLButtonElement = create("button", {
  content: "Export and Clear Scraped Data",
  attributes: {
    title: "Export all currently saved scraped data and then empty it",
  },
  onClick: async () => {
    try {
      await DataStoreService.exportScrapedData();
      await DataStoreService.saveDataStore({ scrapedData: {} });
    } catch (error) {
      notify("Clear failed: ", errorToString(error));
      return;
    }
    notify("Clear successful!");
  },
});
