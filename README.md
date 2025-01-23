# Scrape

This webextension scrapes text from webpages.

## Setup

You will need to have npm installed. A Unix-like environment with bash is expected.

To set up and install, run `build.sh` and then load the `extension` directory as an unpacked extension in a browser that supports webextensions. To build a Firefox-compatible version, run `./build.sh firefox`.

If you don't have npm or bash, just manually compile the TypeScript files in the `src` directory into ECMAScript 2021 (`ES2021`) or later with ECMAScript modules (`ESNEXT`). Transfer the resulting JavaScript files into the directory `extension/js`.

## How to Use

This extension has two main interfaces:

- A popup containing primary functionality that appears when the extension icon is clicked in the browser toolbar.
- An keyboard shortcut (default binding is Alt-S) that runs the scrape option.

The popup can be used to configure the query string used to scrape the text from the page. The query string is a CSS selector that should select all elements on the page that contain the text you wish to scrape.

When the scrape action is performed, all of the elements on the active tab that match the query string will be retrieved (in DOM order) and have their plain text content extracted. All formatting will be lost. This scraped text is then concatenated into one string and pasted into the clipboard.

## Project Philosophy

I built extension for personal use and prioritized simplicity and use of modern ECMAScript/TypeScript over importing external libraries and packages. The only real dependencies for this project are npm and TypeScript.

I also don't care about backwards compatibility with older browsers for this project. Setting up transpiling to older versions of ECMAScript/JavaScript wouldn't have been that much more difficult, but I didn't want to transpile things if I didn't have to. I fully expect users of this extension (primarily myself) be running modern web browsers.

## Development

All of the commands listed below are to be run in the root project directory.

To install all dependencies (including `devDependencies`), run `npm install`.

Run `npm run build` to compile the TypeScript to JavaScript. The compiled files will automatically be added to the correct place in the `extension` directory.

Run `npm run lint` to lint the TypeScript files.

Run `npm run lint-fix` to fix automatically fixable lint issues.

Run `npm run format` to format source files in the project.
