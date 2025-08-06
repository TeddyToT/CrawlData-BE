// Crawl Article
const puppeteer = require("puppeteer");
const BASE_URL = process.env.BASE_URL;
const CategoryModel = require("../models/category.model");
const writeLog = require("../utils/logger");
const maxLoadMore = parseInt(process.env.MAX_LOAD_MORE || "1", 10);
class CrawlService {
  static crawlArticle = async ({ newURL }) => {
    const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-web-security',
    '--ignore-certificate-errors'
  ],
});

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
      const megaEl = document.querySelector("a.header__m-name")?.textContent;
      if (megaEl) {
        console.log("Mega Link");
        return { success: false, message: `Mega Link (${newURL})` };
      }
      const date =
        linkEl
          ?.querySelector(".detail-time [data-role='publishdate']")
          ?.textContent?.replace(/\n/g, "")
          .trim() || "";

      const author =
        linkEl?.querySelector(".detail-info .author-info a")?.textContent || "";

      const sapo =
        linkEl
          ?.querySelector("h2.detail-sapo")
          ?.textContent?.replace(/\n/g, "")
          .trim() || "";

      const img =
        linkEl
          ?.querySelector(".VCSortableInPreviewMode img")
          .getAttribute("src") || "";

      const photoCaption =
        linkEl?.querySelector(".VCSortableInPreviewMode .PhotoCMS_Caption p")
          ?.textContent || "";

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
    const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-web-security',
    '--ignore-certificate-errors'
  ],
});

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
        console.log(`"${category.name}"`, " already exists in Category table");
      }
    }

    if (result.length === 0) {
      return { success: false, message: "There is no new category" };
    }

    return { success: true, result };
  };

  static crawlNewArticlesByCategory = async ({ id, url }) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-web-security',
    '--ignore-certificate-errors'
  ],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    try {
      await page.goto(url, { waitUntil: "networkidle2" });

      await this.autoScrollFooter(page, 5);
      await this.clickViewMore(page, maxLoadMore);

      await page
        .waitForSelector(".list__listing-main .box-category-item", {
          timeout: 10000,
        })
        .catch(() => {
          console.warn(".box-category-item not found after 10s");
        });

      const articles = await this.extractArticles(page, id);
      return articles;
    } catch (err) {
      const msg = `Error crawling category [${url}]: ${err.message}`;
      console.error(msg);
      writeLog(msg);
      return [];
    } finally {
      await browser.close();
    }
  };

  static autoScrollFooter = async (page, times = 5) => {
    for (let i = 0; i < times; i++) {
      try {
        await page.evaluate(() => {
          const footer = document.querySelector("div.footer");
          if (footer && typeof footer.scrollIntoView === "function") {
            footer.scrollIntoView({ behavior: "smooth" });
          }
        });
        console.log(`Scrolled to footer (${i + 1}/${times})`);
        await new Promise((res) => setTimeout(res, 2000));
      } catch (err) {
        const msg = `Scroll iteration ${i + 1} failed: ${err.message}`;
        console.warn(msg);
        writeLog(msg);
        break;
      }
    }
  };

  static clickViewMore = async (page, times = 2) => {
    for (let i = 0; i < times; i++) {
      try {
        await page.waitForSelector(".view-more", { timeout: 5000 });
        const viewMoreBtnHandle = await page.$(".view-more");

        if (!viewMoreBtnHandle) {
          console.log(`No 'Xem thêm' button at click ${i + 1}`);
          break;
        }

        console.log(`Found 'Xem thêm' button. Clicking... (${i + 1}/${times})`);
        await page.evaluate((el) => el.click(), viewMoreBtnHandle);

        await new Promise((res) => setTimeout(res, 3000));
        await this.autoScrollFooter(page, 5);
        await new Promise((res) => setTimeout(res, 1000));
      } catch (err) {
        const msg = `Failed to click 'Xem thêm' at attempt ${i + 1}: ${err.message}`;
        console.warn(msg);
        writeLog(msg);
        break;
      }
    }
  };

  static extractArticles = async (page, categoryId) => {
    return await page.evaluate(
      (categoryId, BASE_URL) => {
        const result = [];
        const items = document.querySelectorAll(
          ".list__listing-main .box-category-item"
        );

        items.forEach((el) => {
          const linkEl = el.querySelector("a.box-category-link-with-avatar");
          if (!linkEl) return;

          const afterStyle = window.getComputedStyle(linkEl, "::after");
          const background = afterStyle.getPropertyValue("background-image");
          const match = background.match(/url\(["']?(.*?)["']?\)/);
          const isMega = match ? match[1] : "";

          const title = linkEl.getAttribute("title") || "";
          const href = linkEl.getAttribute("href") || "";
          const thumbnail =
            linkEl.querySelector("img")?.getAttribute("src") || "";

          if (title && href && !isMega) {
            result.push({
              title,
              url: BASE_URL + href,
              thumbnail,
              categoryId,
            });
          }
        });

        return result;
      },
      categoryId,
      BASE_URL
    );
  };
}

module.exports = CrawlService;
