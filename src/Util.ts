/**
 * Takes an input and guarantees that the output is an array.
 * @param x Item to arrify.
 * @returns x if x is an array, returns an array containing x otherwise.
 */
export function arrify<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x];
}

/**
 * Gets the id of the active tab in the current window. If none is found,
 * returns null wrapped in a Promise.
 * @returns The id of the current tab wrapped in a Promise.
 */
export async function getActiveTabId(): Promise<number> {
  const { id } = (
    await chrome.tabs.query({ currentWindow: true, active: true })
  )[0];

  if (!id) {
    throw new Error("No active tab found.");
  }

  return id;
}

/**
 * Takes in a valid URL and strips out query strings if present.
 * @param url URL to sanitize.
 * @returns Sanitized URL.
 */
export function sanitizeUrl(url: string): string {
  const matches: RegExpMatchArray | null = url.match(/^([^?]*)\??/);
  return matches ? matches[1] : "";
}

/**
 * Creates a basic notification with the given message.
 * @param strings Strings to include in notification.
 */
export function notify(...strings: string[]): void {
  const message: string = strings.join("");
  chrome.notifications.create({
    type: "basic",
    title: "Scrape",
    message,
    iconUrl: "/notification.png",
  });
}

/**
 * Converts an error from a try/catch block into a printable string.
 * @param error Error to convert to string.
 * @returns String representing the error.
 */
export function errorToString(error: unknown): string {
  if (typeof error === "string") {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "An unknown error occurred.";
  }
}

/**
 * Downloads a blob. Returns a void Promise that resolves when the download is
 * complete. Automatically handles url cleanup for the download.
 * @param blob Blob to download.
 * @param filename Suggested name of downloaded file. Defaults to 'file.txt'.
 */
export async function downloadBlob(
  blob: Blob,
  filename = "file.txt",
): Promise<void> {
  const url = URL.createObjectURL(blob);
  const params: chrome.downloads.DownloadOptions = {
    url,
    filename,
    saveAs: true,
  };
  await new Promise((resolve, reject) =>
    chrome.downloads.download(params, (downloadId) => {
      chrome.downloads.onChanged.addListener((delta) => {
        if (delta.id === downloadId) {
          if (delta.state?.current === "complete") {
            URL.revokeObjectURL(url);
            resolve(true);
          } else if (delta.error) {
            URL.revokeObjectURL(url);
            reject(delta.error.current);
          }
        }
      });
    }),
  );
}
