const fs = require('fs'); // 引入文件系統模塊，用於讀取和寫入文件
const readline = require('readline'); // 引入 readline 模塊，用於逐行讀取文件
const AbstractServiceObject = require('../AbstractServiceObject'); // 引入抽象服務對象，用於記錄日誌和提供抽象方法

class ConverterObject extends AbstractServiceObject {
  constructor(csvFilePath, jsonFilePath, logFileName) {
    super(logFileName); // 調用父類的構造函數，設置日誌文件名稱
    this.csvFilePath = csvFilePath; // 設置 CSV 文件的路徑
    this.jsonFilePath = jsonFilePath; // 設置 JSON 文件的路徑
  }

  async execute() {
    this.log('========================================================');
    this.log('Starting CSV to JSON conversion'); // 記錄日誌，表示開始 CSV 到 JSON 的轉換

    // 檢查 CSV 文件是否存在
    if (!fs.existsSync(this.csvFilePath)) {
      const errorMessage = `File ${this.csvFilePath} does not exist`; // 錯誤信息
      this.log(errorMessage); // 記錄日誌，表示文件不存在
      throw new Error(errorMessage); // 拋出錯誤，終止方法
    }

    const jsonArray = []; // 用於存放轉換後的 JSON 數據
    const rl = readline.createInterface({
      input: fs.createReadStream(this.csvFilePath), // 讀取 CSV 文件
      crlfDelay: Infinity // 使用系統的換行符
    });

    let headers = []; // 用於存放 CSV 文件的標題行
    let isFirstLine = true; // 用於標識是否為第一行

    rl.on('line', (line) => {
      const values = line.split('\t').map(value => value.trim()); // 按照制表符分割行，並去除每個值的空白
      if (isFirstLine) {
        headers = values; // 如果是第一行，將其設為標題行
        isFirstLine = false; // 將標識設為 false
      } else {
        if (values.length === headers.length) { // 確保每一行有足夠的列數
          const row = {}; // 用於存放每一行的數據
          headers.forEach((header, index) => {
            row[header] = values[index]; // 將每個值對應到標題行的每個列
          });
          const jsonObject = {
            name: row['賽事名稱'], // 設置 JSON 對象的 name 屬性
            price: row['每人最低價'] !== null ? parseInt(row['每人最低價'], 10) : null, // 設置 JSON 對象的 price 屬性，將字符串轉換為整數
          };
          jsonArray.push(jsonObject); // 將 JSON 對象添加到數組中
        } else {
          this.log(`Skipping line due to incorrect number of columns: ${line}`); // 記錄日誌，表示跳過列數不正確的行
        }
      }
    });

    // 等待文件讀取完成
    await new Promise((resolve) => rl.on('close', resolve));

    // 將 JSON 數據寫入文件
    fs.writeFileSync(this.jsonFilePath, JSON.stringify(jsonArray, null, 2));
    this.log(`CSV data has been converted to JSON and written to ${this.jsonFilePath}`); // 記錄日誌，表示 CSV 數據已轉換並寫入 JSON 文件
  }
}

module.exports = ConverterObject; // 導出 ConverterObject 類