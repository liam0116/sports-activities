const fs = require('fs');
const ActivityFactory = require('../factory/ActivityFactory');
const { csvFilePath, jsonFilePath } = require('../config/ActivityConfig');

class ActivityScripts {
  static clearDataDirectory() {
    if (fs.existsSync(csvFilePath)) {
      fs.unlinkSync(csvFilePath);
      console.log('activity.csv has been deleted');
    }
    if (fs.existsSync(jsonFilePath)) {
      fs.unlinkSync(jsonFilePath);
      console.log('activity.json has been deleted');
    }
  }

  static async runTask(type) {
    const instance = ActivityFactory.create(type);

    switch (type) {
      case 'ScraperObject':
        await instance.execute();
        break;
      case 'ConverterObject':
        await instance.execute();
        break;
      case 'RequesterObject':
        await instance.execute();
        break;
      default:
        throw new Error('Invalid task type');
    }
  }

  static async runAllScripts() {
    this.clearDataDirectory();

    try {
      await this.runTask('ScraperObject');
      console.log('Finished running scrapeActivities');
    } catch (error) {
      console.error('Error running scrapeActivities:', error);
      return;
    }

    try {
      await this.runTask('ConverterObject');
      console.log('Finished running csvToJson');
    } catch (error) {
      console.error('Error running csvToJson:', error);
      return;
    }

    try {
      await this.runTask('RequesterObject');
      console.log('Finished running sendRequest');
    } catch (error) {
      console.error('Error running sendRequest:', error);
      return;
    }
  }
}

// 獲取命令行參數
const args = process.argv.slice(2);
const taskType = args[0];

if (taskType) {
  // 根據命令行參數執行指定的任務
  ActivityScripts.runTask(taskType).catch((error) => {
    console.error(`Error running task ${taskType}:`, error);
  });
} else {
  // 如果沒有指定任務，則執行所有定義的服務
  ActivityScripts.runAllScripts().catch((error) => {
    console.error('Error running all scripts:', error);
  });
}