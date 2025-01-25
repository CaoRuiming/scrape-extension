import { create } from "./Dom.js";
import {
  scraperArgComponent,
  scrapeComponent,
  scrapeDataExportComponent,
  scrapeDataClearComponent,
  scraperSelectorComponent,
  scrapeSettingsComponent,
} from "./Elements.js";

const body: HTMLElement = document.body;
if (body.id === "popup-page") {
  [
    scraperSelectorComponent,
    create("div", { classes: "hr" }),
    scraperArgComponent,
    create("div", { classes: "hr" }),
    scrapeComponent,
    create("div", { classes: "hr" }),
    scrapeSettingsComponent,
  ].forEach((x) => body.appendChild(x));
} else if (body.id === "options-page") {
  [
    create("h1", { content: "Scrape Extension Options" }),
    create("div", {
      classes: "option-cards-wrapper",
      content: [
        create("div", {
          classes: "option-card",
          content: [
            create("h2", { content: "Export Scraped Data" }),
            scrapeDataExportComponent,
          ],
        }),
        create("div", {
          classes: "option-card",
          content: [
            create("h2", { content: "Save and Clear Scraped Data" }),
            scrapeDataClearComponent,
          ],
        }),
      ],
    }),
  ].forEach((x) => body.appendChild(x));
}
