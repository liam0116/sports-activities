# 主腳本 (activityScripts.js)

activityScripts.js 是主腳本，負責根據傳入的參數來選擇執行不同的任務。它通過調用 ActivityFactory 來創建相應的對象實例，並調用這些實例的 execute 方法。

## 依賴項
本項目使用以下依賴項：
- `puppeteer`：版本 "^22.9.0"

## 安裝依賴項
在開始使用此項目之前，請確保你已經安裝了所有必要的依賴項。你可以使用以下命令來安裝依賴項：

如果你沒有安裝 puppeteer，你可以使用以下命令來安裝：
```bash
npm install puppeteer@^22.9.0
```
或者你可以使用 package.json 文件中的依賴項來安裝所有依賴：
```bash
npm install
```

## 項目結構
`scripts/`: 腳本文件

`services/`: 服務對象文件

`config/`: 配置文件

`factory/`: 工廠類文件

`logs/`: 日誌文件

`data/`: 數據文件

## 執行任務命令：
```bash
node npm start
```
or
```bash
node scripts/activityScripts.js
```

## 可以執行特定任務：

### ScraperObject
執行 ScraperObject 的命令：
```bash
node scripts/activityScripts.js ScraperObject
```
這將啟動網頁抓取任務，將目標網頁上的數據抓取下來，並保存到 CSV 文件中。

### ConverterObject
執行 ConverterObject 的命令：
```bash
node scripts/activityScripts.js ConverterObject
```
這將啟動轉換任務，將 CSV 文件中的數據轉換為 JSON 格式並保存到 JSON 文件中。

### RequesterObject
執行 RequesterObject 的命令：
```bash
node scripts/activityScripts.js RequesterObject
```
這將啟動請求任務，將 JSON 文件中的數據讀取出來，模擬發送到指定的虛擬端點，並記錄響應。