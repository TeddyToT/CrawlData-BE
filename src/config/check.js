const puppeteer = require("puppeteer");
// require('dotenv').config()
const BASE_URL= process.env.BASE_URL;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  const categories = await page.evaluate(() => {
    const excludes = ["Trang chủ", "VIDEO"];
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

  await browser.close();

  console.log("Danh mục:", categories);

  

})();
