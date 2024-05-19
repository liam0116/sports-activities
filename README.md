# 主腳本 (ActivityScripts.js)

ActivityScripts.js 是主腳本，負責根據傳入的參數來選擇執行不同的任務。它通過調用 ActivityFactory 來創建相應的對象實例，並調用這些實例的 execute 方法。

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

先 `cd` 至專案底下
```bash
npm start
```
or
```bash
node scripts/ActivityScripts.js
```

## 可以執行特定任務：

### ScraperObject
執行 ScraperObject 的命令：
```bash
node scripts/ActivityScripts.js ScraperObject
```
這將啟動網頁抓取任務，將目標網頁上的數據抓取下來，並保存到 CSV 文件中。

### ConverterObject
執行 ConverterObject 的命令：
```bash
node scripts/ActivityScripts.js ConverterObject
```
這將啟動轉換任務，將 CSV 文件中的數據轉換為 JSON 格式並保存到 JSON 文件中。

### RequesterObject
執行 RequesterObject 的命令：
```bash
node scripts/ActivityScripts.js RequesterObject
```
這將啟動請求任務，將 JSON 文件中的數據讀取出來，模擬發送到指定的虛擬端點，並記錄響應。

## csv 内容:
```
賽事名稱	每人最低價
札幌馬拉松	6000
山形馬拉松	6600
神戶馬拉松	12150
// 其他...
```

## csv to json 内容:
```json
[
  {
    "name": "札幌馬拉松",
    "price": 6000
  },
  {
    "name": "山形馬拉松",
    "price": 6600
  },
  {
    "name": "神戶馬拉松",
    "price": 12150
  }
  // 其他...
]
```

## Response 響應内容:

成功響應:
```json
{
  "url": "https://api.schedule.asiayo.com/",
  "contentType": "application/JSON",
  "headers": {
    "cache-control": "no-cache, private",
    "content-type": "application/JSON",
    "date": "Wed, 01 May 2099 00:00:00 GMT",
    "server": "nginx",
    "x-request-id": "679723986539296061"
  },
  "status": 200,
  "body": "{\"status\":{\"code\":200,\"msg\":\"Success\"}}"
}
```

錯誤響應:
```json
{
  "url": "https://api.schedule.asiayo.com/",
  "contentType": "application/JSON",
  "headers": {
    "cache-control": "no-cache, private",
    "content-type": "application/JSON",
    "date": "Wed, 01 May 2099 00:00:00 GMT",
    "server": "nginx",
    "x-request-id": "679723986539296061"
  },
  "status": 400,
  "body": "{\"status\":{\"code\":400,\"msg\":\"Validation failed.\"},\"data\":{\"errors\":{\"price\":[\"The price must be numeric\"]}}}"
}
```