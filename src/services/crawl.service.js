// Crawl Article
const puppeteer = require("puppeteer");
const BASE_URL = process.env.BASE_URL;
const CategoryModel = require("../models/category.model");
class CrawlService {
  static crawlArticle = async ({ newURL }) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(newURL, { waitUntil: "domcontentloaded" });

    const articles = await page.evaluate(() => {
      function convertToISOString(dateStr) {
        // dateStr example: "24/07/2025 09:02 GMT+7"
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

      const category =
        linkEl?.querySelector(".detail-top .detail-cate a").textContent || "";

      const date =
        linkEl
          ?.querySelector(".detail-time [data-role='publishdate']")
          .textContent.replace(/\n/g, "")
          .trim() || "";
      const title =
        linkEl?.querySelector("h1").textContent.replace(/\n/g, "") || "";

      const author =
        linkEl?.querySelector(".detail-info .author-info a").textContent || "";

      const sapo =
        linkEl
          ?.querySelector("h2.detail-sapo")
          .textContent.replace(/\n/g, "")
          .trim() || "";

      const img =
        linkEl
          ?.querySelector(".VCSortableInPreviewMode img")
          .getAttribute("src") || "";

      const photoCaption =
        linkEl?.querySelector(".VCSortableInPreviewMode .PhotoCMS_Caption p")
          .textContent || "";

      const content = Array.from(
        linkEl?.querySelectorAll(
          ".detail-cmain .detail-content p:not([data-placeholder='Nhập chú thích ảnh']):not(.VCObjectBoxRelatedNewsItemSapo)"
        )
      ).map((el) => el.innerText);

      if (linkEl) {
        result.categoryId = "2ed99524-0da2-4ffd-a1da-3ee0fb0ffe44";
        result.date = convertToISOString(date);
        result.title = title;
        result.author = author;
        result.sapo = sapo;
        result.img = img;
        result.photoCaption = photoCaption;
        result.content = content;
      }

      return result;
    });

    await browser.close();
    return articles;
  };

static crawlCategory = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  const rawCategories = await page.evaluate(() => {
    const excludes = ["Trang chủ", "VIDEO"];
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
    }
    else{
        console.log(category.name, " already exists in Category table");
 
    }
  }

  if (result.length === 0) {
    return { success: false,message: "There is no new category" };
  }

  return {success: true, result};
};

static crawNewArticle = async () => { //incomplete
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

      //Save to DB
    
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
};
}

module.exports = CrawlService;
