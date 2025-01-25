import { scrape } from "./Scrape.js";
import { notify, errorToString } from "./Util.js";

/**
 * Listen for and handle keyboard shortcuts.
 */
chrome.commands.onCommand.addListener(async (command: string) => {
  switch (command) {
    case "scrape": {
      let id: string;
      try {
        ({ id } = await scrape());
      } catch (error) {
        notify("Scrape failed: ", errorToString(error));
        break;
      }
      notify(`Scrape successful for "${id}"!`);
      break;
    }

    default:
      break;
  }
});
