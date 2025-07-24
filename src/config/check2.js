// Crawl Articles 
  const puppeteer = require("puppeteer");
const BASE_URL= process.env.BASE_URL;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/phap-luat.htm`, { waitUntil: "domcontentloaded" });
  await autoScroll(page);
  

  const articles = await page.evaluate(() => {
    const result = [];
    document
      .querySelectorAll(".list__listing-main .box-category-item")
      .forEach((el) => {
        const linkEl = el.querySelector("a.box-category-link-with-avatar");
        const title = linkEl?.getAttribute("title") || "";
        const href = linkEl?.getAttribute("href") || "";
        const img = linkEl?.querySelector("img")?.getAttribute("src") || "";
        const category = el.querySelector("a.box-category-category")?.getAttribute("title") || ""

        if (title && href) {
          result.push({
            title,
            url: `${BASE_URL}${href}`,
            img,
            category
          });
        }
      });
    return result;
  });

  console.log("Các bài báo:", articles);

  await browser.close();

  async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let lastHeight = 0;
      const distance = 500;
      const delay = 300;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        const currentHeight = document.body.scrollHeight;

        if (currentHeight === lastHeight) {
          clearInterval(timer);
          resolve();
        } else {
          lastHeight = currentHeight;
        }
      }, delay);
    });
  });
}
})();