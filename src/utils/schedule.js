const ArticleService = require("../services/article.service");
const writeLog = require("../utils/logger");
const INTERVAL_MS = 30 * 60 * 1000;

let isCrawling = false;

async function startCrawlingJob() {
  console.log("Scheduler started. Running every 30 minutes...");
  if (isCrawling) {
    const msg = "Previous crawl still running. Skipping this interval.";
    console.warn(msg);
    writeLog(msg);
    return;
  }

  try {
    isCrawling = true;
    await ArticleService.crawlNewArticles();
    console.log("\nFirst crawl done. Next crawl in 30 minutes");
  } catch (err) {
    const msg = `Error during scheduled crawl: ${err.message}`;
    console.error(msg);
    writeLog(msg);
  } finally {
    isCrawling = false;
  }

  setInterval(async () => {
    if (isCrawling) {
      const msg = "Previous crawl still running. Skipping this interval.";
      console.warn(msg);
      writeLog(msg);
      return;
    }

    console.log(
      "\nRunning scheduled crawl at",
      new Date().toLocaleString("vi-VN")
    );

    try {
      isCrawling = true;
      await ArticleService.crawlNewArticles();
      console.log("Crawl done, restarted in 30 minutes");
    } catch (err) {
      const msg = `Error during scheduled crawl: ${err.message}`;
      console.error(msg);
      writeLog(msg);
    } finally {
      isCrawling = false;
    }
  }, INTERVAL_MS);
}

startCrawlingJob();
