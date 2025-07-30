// Crawl Article
const puppeteer = require("puppeteer");
const BASE_URL = process.env.BASE_URL;
const CategoryModel = require("../models/category.model");
class CrawlService {
  static crawlArticle = async ({ newURL }) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(newURL, { waitUntil: "domcontentloaded" });

    const article = await page.evaluate(() => {
      function convertToISOString(dateStr) {
        const [datePart, timePart, tzPart] = dateStr.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hour, minute] = timePart.split(":");

        const timezone = tzPart.replace("GMT", "");
        const formattedTimezone =
          timezone.length === 2 ? `${timezone}:00` : timezone;

        const isoString = `${year}-${month}-${day}T${hour}:${minute}:00${formattedTimezone}`;
        return isoString;
      }



      const result = {};
      const linkEl = document.querySelector(".detail__cmain");
            const megaEl = document.querySelector("a.header__m-name")?.textContent
      if (megaEl){
        console.log("là link Mega");
        return {success: false, message: "Mega Link"}
      }
      const date =
        linkEl
          ?.querySelector(".detail-time [data-role='publishdate']")?.textContent?.replace(/\n/g, "")
          .trim() || "";

      const author =
        linkEl?.querySelector(".detail-info .author-info a")?.textContent || "";

      const sapo =
        linkEl
          ?.querySelector("h2.detail-sapo")?.textContent?.replace(/\n/g, "")
          .trim() || "";

      const img =
        linkEl
          ?.querySelector(".VCSortableInPreviewMode img")
          .getAttribute("src") || "";

      const photoCaption =
        linkEl?.querySelector(".VCSortableInPreviewMode .PhotoCMS_Caption p")?.textContent || "";

      const content = Array.from(
        linkEl?.querySelectorAll(
          ".detail-cmain .detail-content p:not([data-placeholder='Nhập chú thích ảnh']):not(.VCObjectBoxRelatedNewsItemSapo)"
        )
      ).map((el) => el.innerText);

      if (linkEl) {
        result.date = convertToISOString(date);
        result.author = author;
        result.sapo = sapo;
        result.img = img;
        result.photoCaption = photoCaption;
        result.content = content;
      }

      return result;
    });

    await browser.close();
    return article;
  };

  static crawlCategory = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const rawCategories = await page.evaluate(() => {
      const excludes = ["Trang chủ", "VIDEO", "TRANG CHỦ"];
      const result = [];

      document.querySelectorAll(".menu-nav li .nav-link").forEach((el) => {
        const name = el.innerText.trim();
        const href = el.getAttribute("href");

        if (name && href && !excludes.includes(name) && href !== "#") {
          result.push({
            name,
            url: `https://tuoitre.vn${href}`,
          });
        }
      });

      return result;
    });

    await browser.close();

    // Save to DB
    const result = [];
    for (const category of rawCategories) {
      const duplicate = await CategoryModel.findByName(category);
      if (!duplicate) {
        const added = await CategoryModel.create(category);
        if (added) result.push(added);
      } else {
        console.log(category.name, " already exists in Category table");
      }
    }

    if (result.length === 0) {
      return { success: false, message: "There is no new category" };
    }

    return { success: true, result };
  };

  static crawlNewArticle = async ({ id, url }) => {
const browser = await puppeteer.launch({
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-web-security',
    '--ignore-certificate-errors',
  ],
});

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
page.setViewport({ width: 1280, height: 926 });
    await scrollUntilNoNewContent(page);

    const articles = await page.evaluate(
      (categoryId, BASE_URL) => {
        const result = [];
        document
          .querySelectorAll(".list__listing-main .box-category-item")
          .forEach((el) => {
            const linkEl = el.querySelector("a.box-category-link-with-avatar");

            const afterStyle = window.getComputedStyle(linkEl, "::after");
            const background = afterStyle.getPropertyValue("background-image");
            const match = background.match(/url\(["']?(.*?)["']?\)/);
            const isMega = match ? match[1] : "";

            const title = linkEl?.getAttribute("title") || "";
            if (isMega) {
              console.log("La mega link, bo qua: ", title);
              return;
            }
            const href = linkEl?.getAttribute("href") || "";
            const thumbnail =
              linkEl?.querySelector("img")?.getAttribute("src") || "";

            if (title && href) {
              result.push({
                title,
                url: BASE_URL + href,
                thumbnail,
                categoryId: categoryId,
              });
            }
          });
        return result;
      },
      id,
      BASE_URL
    );

    // console.log("Các bài báo:", articles);

    await browser.close();

    return articles;

async function scrollUntilNoNewContent(page) {
  await page.evaluate(() => {
    return new Promise((resolve) => {
      let lastHeight = document.body.scrollHeight;
      const observer = new MutationObserver(() => {
        const newHeight = document.body.scrollHeight;
        if (newHeight > lastHeight) {
          lastHeight = newHeight;
          window.scrollTo(0, newHeight);
        } else {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.scrollTo(0, lastHeight);
    });
  });
}
  };
}

module.exports = CrawlService;
