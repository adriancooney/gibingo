import Puppeteer from "puppeteer";
import { createPool } from "generic-pool";

const puppeteerLaunchArgs = {
  dumpio: false,
  executablePath: process.env.PUPPETEER_EXEC_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};

const pool = createPool(
  {
    async create() {
      const browser = await Puppeteer.launch(puppeteerLaunchArgs);
      pool.emit("browser", browser);
      return browser;
    },

    async destroy(browser) {
      return await browser.close();
    },
  },
  {
    min: 0,
    max: 1,
    autostart: false,
  },
);

pool.on("factoryCreateError", error => console.error(error));
pool.on("factoryDestroyError", error => console.error(error));

export default pool;
