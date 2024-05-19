const puppeteer = require('puppeteer'); // 引入 Puppeteer 模塊，用於控制無頭瀏覽器進行網頁自動化操作
const fs = require('fs'); // 引入 Node.js 的文件系統模塊，用於讀取和寫入文件
const AbstractServiceObject = require('../AbstractServiceObject'); // 引入抽象服務對象，用於記錄日誌和提供抽象方法

class ScraperObject extends AbstractServiceObject {
  constructor(webScrapingUrl, csvFilePath, pages, logFileName) {
    super(logFileName); // 調用父類的構造函數，設置日誌文件名稱
    this.webScrapingUrl = webScrapingUrl; // 設置網頁抓取的 URL
    this.csvFilePath = csvFilePath; // 設置保存 CSV 文件的路徑
    this.pages = pages; // 設置頁面配置
  }

  async execute() {
    this.log('========================================================');
    this.log('Starting to scrape activities'); // 記錄日誌，表示開始抓取活動

    // 檢查 pages 是否定義，若未定義則拋出錯誤
    if (!this.pages || this.pages.length === 0) {
      const errorMessage = 'No pages defined for scraping'; // 錯誤信息
      this.log(errorMessage); // 記錄日誌
      throw new Error(errorMessage); // 拋出錯誤
    }

    let browser;
    try {
      browser = await puppeteer.launch({ headless: true }); // 啟動無頭瀏覽器
      this.log('Browser launched'); // 記錄日誌，表示瀏覽器已啟動

      const page = await browser.newPage(); // 創建一個新的瀏覽器頁面
      this.log('New page created'); // 記錄日誌，表示新頁面已創建

      // 初始化 CSV 文件的表頭
      let csvData = '賽事名稱\t每人最低價\n';

      // 遍歷 pages 配置，抓取每個頁面的數據
      for (const pageInfo of this.pages) {
        csvData += await this.scrapePage(page, this.webScrapingUrl, pageInfo.category, pageInfo.tab);
      }

      // 將抓取到的數據寫入 CSV 文件
      fs.writeFileSync(this.csvFilePath, csvData);
      this.log(`Data has been written to ${this.csvFilePath}`); // 記錄日誌，表示數據已寫入 CSV 文件

    } catch (error) {
      this.log(`Error: ${error.message}`); // 記錄日誌，表示錯誤信息
      console.error('Error running scrapeActivities:', error); // 輸出錯誤信息

    } finally {
      if (browser) {
        await browser.close(); // 確保瀏覽器在出現錯誤時也能關閉
        this.log('Browser closed'); // 記錄日誌，表示瀏覽器已關閉
      }
    }
  }

  // 抓取單個頁面數據的方法
  async scrapePage(page, baseUrl, category, tab) {
    const url = `${baseUrl}?${tab}`; // 組合 URL
    this.log(`Navigated ${category} to ${url}`); // 記錄日誌，表示導航到 URL
    await page.goto(url); // 導航到 URL

    // 等待目標選擇器出現
    await page.waitForSelector('h2.sc-bTUVah.gHXvgE');
    this.log('Selector h2.sc-bTUVah.gHXvgE found'); // 記錄日誌，表示找到目標選擇器

    // 在頁面上下文中執行評估函數，抓取頁面數據
    const data = await page.evaluate(() => {
      let result = ''; // 初始化結果字符串
      const items = document.querySelectorAll('div.sc-jKvnYE.jwaedg'); // 獲取所有賽事項目， HTML 元素（div）和兩個 CSS 類名（sc-jKvnYE 和 jwaedg）是通過瀏覽器開發者工具獲取的

      items.forEach(item => {
        const titleElement = item.querySelector('h2.sc-bTUVah.gHXvgE'); // 選取賽事名稱的 h2 元素
        let title = titleElement ? titleElement.textContent.trim() : null; // 獲取賽事名稱文本，若無則設為 null
        const firstSpaceIndex = title.indexOf(' '); // 查找第一個空格的位置
        if (firstSpaceIndex !== -1) {
          title = title.substring(0, firstSpaceIndex).trim(); // 提取空格前的內容作為賽事名稱
        }
        const priceElement = item.querySelector('div.sc-JHWBx.jbErzt'); // 選取價格的元素
        const price = priceElement ? priceElement.textContent.replace(/[^\d]/g, '').trim() : null; // 獲取價格文本，並移除非數字字符，若無則設為 null
        result += `${title}\t${price}\n`; // 將獲取到的數據追加到結果字符串中
      });

      return result; // 返回結果字符串
    });

    return data; // 返回抓取到的數據
  }
}

module.exports = ScraperObject; // 導出 ScraperObject 類