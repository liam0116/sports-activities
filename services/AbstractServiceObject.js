const fs = require('fs'); // 引入文件系統模塊，用於讀取和寫入文件
const path = require('path'); // 引入路徑模塊，用於處理文件和目錄路徑

class AbstractServiceObject {
    constructor(logFileName) {
        this.logDir = path.join(__dirname, `../logs/${logFileName}`); // 設置日誌目錄的路徑
        this.logFilePath = this.generateLogFilePath(); // 生成日誌文件的完整路徑
        this.ensureLogDirExists(); // 確保日誌目錄存在，若不存在則創建
    }

    generateLogFilePath() {
        const today = new Date().toISOString().slice(0, 10); // 獲取當前日期的 ISO 字符串，格式為 YYYY-MM-DD
        return path.join(this.logDir, `${today}.log`); // 返回包含當前日期的日誌文件路徑
    }

    ensureLogDirExists() {
        if (!fs.existsSync(this.logDir)) { // 檢查日誌目錄是否存在
            fs.mkdirSync(this.logDir, { recursive: true }); // 如果不存在，創建日誌目錄，包括所有必要的父目錄
        }
    }

    log(message) {
        const logMessage = `${new Date().toISOString()} - ${message}\n`; // 創建帶有時間戳的日誌消息
        fs.appendFileSync(this.logFilePath, logMessage); // 將日誌消息附加到日誌文件中
        console.log(message); // 在控制台輸出日誌消息
    }

    // 抽象方法，具體實現由子類提供
    async execute() {
        throw new Error('Execute method must be implemented by subclass'); // 如果子類沒有實現此方法，拋出錯誤
    }
}

module.exports = AbstractServiceObject; // 導出 AbstractServiceObject 類