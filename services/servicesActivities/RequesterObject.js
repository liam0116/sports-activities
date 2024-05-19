const fs = require('fs'); // 引入文件系統模塊，用於讀取和寫入文件
const AbstractServiceObject = require('../AbstractServiceObject'); // 引入抽象服務對象，用於記錄日誌和提供抽象方法

class RequesterObject extends AbstractServiceObject {
  constructor(jsonFilePath, headers, apiEndpointUrl, logFileName) {
    super(logFileName); // 調用父類的構造函數，設置日誌文件名稱
    this.jsonFilePath = jsonFilePath; // 設置 JSON 文件的路徑
    this.headers = headers; // 設置請求的標頭
    this.apiEndpointUrl = apiEndpointUrl; // 設置 API 端點的 URL
    this.defaultResponse = {
      "url": this.apiEndpointUrl,
      "contentType": "application/JSON",
      "headers": {
        "cache-control": "no-cache, private",
        "content-type": "application/JSON",
        "date": "Wed, 01 May 2099 00:00:00 GMT",
        "server": "nginx",
        "x-request-id": "679723986539296061"
      }
    }; // 設置默認回應結構
  }

  async execute() {
    this.log('========================================================');
    this.log('Starting to send requests'); // 記錄日誌，表示開始發送請求

    // 檢查 JSON 文件是否存在
    if (!fs.existsSync(this.jsonFilePath)) {
      const errorMessage = `File ${this.jsonFilePath} does not exist`; // 錯誤信息
      this.log(errorMessage); // 記錄日誌，表示文件不存在
      throw new Error(errorMessage); // 拋出錯誤，終止方法
    }

    // 讀取 JSON 文件，並將其解析為 JavaScript 對象
    const activities = JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf-8'));

    // 遍歷所有活動，逐一發送請求
    for (const activity of activities) {
      try {
        const response = await this.sendMockRequest(activity); // 發送模擬請求並等待回應
        this.log(`Response: ${JSON.stringify(response)}`); // 記錄響應

        // 檢查響應狀態碼是否為 400
        if (response.status === 400) {
          const responseBody = JSON.parse(response.body); // 解析響應的 body
          if (responseBody.status && responseBody.status.code === 400) {
            const errors = responseBody.data.errors; // 獲取錯誤信息
            this.log(`Errors for ${activity.name}: ${JSON.stringify(errors)}`); // 記錄錯誤信息
          }
        } else if (response.status === 200) { // 檢查響應狀態碼是否為 200
          this.log(`Price is valid for ${activity.name}, request successful.`); // 記錄成功信息
        }
      } catch (error) {
        this.log(`Error: ${error}`); // 捕捉並記錄異常
      }
    }
  }

  sendMockRequest(activity) {
    return new Promise((resolve) => {
      this.log(`Sending payload: ${JSON.stringify(activity)}`); // 記錄發送的數據
      this.log(`Headers: ${JSON.stringify(this.headers)}`); // 記錄請求的標頭

      setTimeout(() => {
        // 檢查價格是否為整數
        let mockApiResponse = { ...this.defaultResponse };
        if (Number.isInteger(activity.price)) {
          mockApiResponse.status = 200;
          mockApiResponse.body = "{\"status\":{\"code\":200,\"msg\":\"Success\"}}";
        } else {
          mockApiResponse.status = 400;
          mockApiResponse.body = "{\"status\":{\"code\":400,\"msg\":\"Validation failed.\"},\"data\":{\"errors\":{\"price\":[\"The price must be numeric\"]}}}";
        }
        resolve(mockApiResponse);
      }, 1000); // 模擬 1 秒延遲
    });
  }
}

module.exports = RequesterObject; // 導出 RequesterObject 類