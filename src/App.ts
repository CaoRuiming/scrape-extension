import { create } from "./Dom.js";
import { queryStringComponent, scrapeComponent } from "./Elements.js";

const body: HTMLElement = document.body;
if (body.id === "popup-page") {
  [
    queryStringComponent,
    create("div", { classes: "hr" }),
    scrapeComponent,
  ].forEach((x) => body.appendChild(x));
} else if (body.id === "options-page") {
  [create("h1", { content: "Scrape Extension Options (WIP)" })].forEach((x) =>
    body.appendChild(x)
  );
}
