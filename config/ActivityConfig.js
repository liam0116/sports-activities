const path = require('path');

module.exports = {
  webScrapingUrl: 'https://asiayo.com/zh-tw/package/sport-activities/', // 用於網頁抓取的 URL
  csvFilePath: path.join(__dirname, '../data/activity.csv'),
  jsonFilePath: path.join(__dirname, '../data/activity.json'),
  logFileName: 'activity',
  apiEndpointUrl: 'https://api.schedule.asiayo.com/', // 用於虛擬端點的 URL
  headers: {
    "channel": "CP",
    "user": "OOO",
    "Content-Type": "application/json"
  }
};