import { create } from "./Dom.js";
import { scrape } from "./Scrape.js";
import SettingsService from "./SettingsService.js";
import { notify, errorToString } from "./Util.js";

export const scrapeComponent: HTMLButtonElement = create("button", {
  content: "Scrape",
  attributes: { title: "Scrape the current tab!" },
  onClick: async () => {
    try {
      await scrape();
    } catch (error) {
      notify("Scrape failed: ", errorToString(error));
    }
    notify("Scrape successful!");
  },
});

export const queryStringComponent: HTMLElement = (() => {
  const queryStringInput: HTMLInputElement = create("input", {
    attributes: { type: "text", placeholder: "Text element selector" },
    onCreate: async (input) => {
      input.value = (await SettingsService.getSettings()).queryString;
    },
  });
  const queryStringButton: HTMLButtonElement = create("button", {
    content: "Save Query String",
    attributes: {
      title: "Save the current string as the text element selector",
    },
    onClick: async () => {
      try {
        const queryString = queryStringInput.value;
        await SettingsService.saveSettings({ queryString });
      } catch (error) {
        notify("Save failed: ", errorToString(error));
        return;
      }
      notify("Successfully saved new query string");
    },
  });
  return create("div", { content: [queryStringInput, queryStringButton] });
})();
