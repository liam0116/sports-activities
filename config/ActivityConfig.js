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
  },
  pages: [
    { category: '國際馬拉松', tab: 'mainTab=int-marathon&subTab=all-marathon' },
    { category: '國內馬拉松', tab: 'mainTab=tw-marathon&subTab=undefined' },
    { category: '登山', tab: 'mainTab=mountain&subTab=jp-mountain' },
    { category: '高爾夫旅遊', tab: 'mainTab=int-golf&subTab=th-golf' }
  ]
};