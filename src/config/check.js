const puppeteer = require("puppeteer");

const BASE_URL = "https://tuoitre.vn";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Crawl Categories

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  const categories = await page.evaluate(() => {
    const excludes = ["Trang chủ", "Video"];
    const categorySet = new Set();
    const result = [];

    document.querySelectorAll(".menu-nav li .nav-link").forEach((el) => {
      const name = el.innerText.trim();
      const href = el.getAttribute("href");

      if (
        name &&
        href &&
        !excludes.includes(name) &&
        href !== "#" &&
        !categorySet.has(name)
      ) {
        categorySet.add(name);
        result.push({
          name: name,
          url: `https://tuoitre.vn${href}`,
        });
      }
    });

    return result;
  });

  console.log("Danh mục:", categories);

  // Crawl Articles 
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
            url: `https://tuoitre.vn${href}`,
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
