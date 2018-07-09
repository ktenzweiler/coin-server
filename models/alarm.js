// models/alarm.js
const _ = require('underscore');

class Alarm {
  constructor(data) {
    // put data object onto Alarm object
    _.extend(this, data);
  }

  // Returns a boolean based on whether the threshold has been exceeded
  isTriggered(latestCoinData) {
    let isAlarmTriggered = false;
    switch (this.thresholdDirection) {
      case 'under':
        isAlarmTriggered = latestCoinData.price_usd < this.priceThreshold;
        break;
      case 'over':
        isAlarmTriggered = latestCoinData.price_usd > this.priceThreshold;
        break;
      default:
        isAlarmTriggered = false;
    }
    return isAlarmTriggered;
  }
}

module.exports = Alarm;
