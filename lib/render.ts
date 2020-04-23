import { Browser } from "puppeteer";
import { createLogger } from "./logging";
import browsers from "./browsers";

const debug = createLogger("render");

type RenderOptions = {
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
};

export async function renderPage(port, urlPath, outputPath, options?: RenderOptions) {
  const browser = await browsers.acquire();

  try {
    await renderPageWithBrowser(browser, port, urlPath, outputPath, options);
  } finally {
    await browsers.release(browser);
  }
}

async function renderPageWithBrowser(
  browser: Browser,
  port: number,
  urlPath: string,
  outputPath: string,
  options?: RenderOptions,
) {
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: 800,
      height: 800,
      deviceScaleFactor: 2,
      ...options,
    });
    await page.emulateMedia("print");
    const resp = await page.goto(`http://localhost:${port}${urlPath}`);

    debug(`goto ${urlPath}: ${resp.status()} ${resp.statusText()}`);

    if (!resp.ok()) {
      throw new Error(`Unable to render http://localhost:${port}/${urlPath}: ${resp.status()} ${resp.statusText()}`);
    }

    debug(`rendering ${urlPath} to ${outputPath}`);
    await page.screenshot({
      path: outputPath,
      type: "png",
      fullPage: true,
    });
  } finally {
    await page.close();
  }
}
