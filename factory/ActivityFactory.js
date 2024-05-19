const ConverterObject = require('../services/servicesActivities/ConverterObject');
const RequesterObject = require('../services/servicesActivities/RequesterObject');
const ScraperObject = require('../services/servicesActivities/ScraperObject');
const { webScrapingUrl, csvFilePath, jsonFilePath, logFileName, apiEndpointUrl, headers } = require('../config/ActivityConfig');

class ActivityFactory {
  static create(type) {
    switch (type) {
      case 'ScraperObject':
        return new ScraperObject(webScrapingUrl, csvFilePath, logFileName);
      case 'ConverterObject':
        return new ConverterObject(csvFilePath, jsonFilePath, logFileName);
      case 'RequesterObject':
        return new RequesterObject(jsonFilePath, headers, apiEndpointUrl, logFileName);
      default:
        throw new Error('Invalid type');
    }
  }
}

module.exports = ActivityFactory;