# Scrape

This webextension scrapes text and image URLs from webpages.

## Setup

You will need to have npm installed. A Unix-like environment with bash is expected.

To set up and install, run `build.sh` and then install the generated `.xpi` or `.zip` extension file in a browser that supports webextensions. To build a Firefox-compatible version, run `./build.sh firefox`.

If you don't have npm or bash, just manually compile the TypeScript files in the `src` directory into ECMAScript 2021 (`ES2021`) or later with ECMAScript modules (`ESNEXT`). Transfer the resulting JavaScript files into the directory `extension/js`.

## How to Use

This extension has the following main interfaces:

- A popup containing primary functionality that appears when the extension icon is clicked in the browser toolbar.
- An keyboard shortcut (default binding is Alt-S) that runs the scrape option.
- An options page where saved data can be exported and/or cleared.

The popup can be used to configure the arg string passed to the scraping function to scrape the desired content from the active tab. The query string is oftentimes a CSS selector that should select all elements on the page that contain the text/images you wish to scrape.

When the scrape action is performed, all scraped elements on the active tab will be retrieved (in DOM order) and have their relevant content extracted as strings. These scraped strings are then concatenated into one string and saved in browser local storage.

### Custom Scraping Algorithms

This extension includes two built-in `Scraper`s out of the box: one for scraping text/text blocks from pages, and one for scraping image URLs from pages.

Custom `Scraper`s can be added to the extension in `Scrapers.ts` by creating corresponding objects satisfying the `Scraper` interface (defined in the file) and adding those objects to the exported `SCRAPERS` array.

This extension must be rebuilt and reloaded into the browser for the custom `Scraper`s to be available to use.

## Project Philosophy

I built extension for personal use and prioritized simplicity and use of modern ECMAScript/TypeScript over importing external libraries and packages. The only real dependencies for this project are npm and TypeScript.

I also don't care about backwards compatibility with older browsers for this project. Setting up transpiling to older versions of ECMAScript/JavaScript wouldn't have been that much more difficult, but I didn't want to transpile things if I didn't have to. I fully expect users of this extension (primarily myself) be running modern web browsers.

## Development

All of the commands listed below are to be run in the root project directory.

To install all dependencies (including `devDependencies`), run `npm clean-install`.

Run `npm run build` to compile the TypeScript to JavaScript. The compiled files will automatically be added to the correct place in the `extension` directory.

Run `npm run format` to format source files in the project.
