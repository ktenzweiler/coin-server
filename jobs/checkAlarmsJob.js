const _ = require('underscore');

const coinDataRepo = require('../dataAccess/repos/coinDataRepository');
const alarmRepo = require('../dataAccess/repos/alarmRepository');
const smsService = require('../services/smsServices');

const jobName = 'Check Alarm Job';
let agendaInstance = null;

// Register our job with agenda Instance
exports.register = (agenda) => {
  agendaInstance = agenda;

  // Define what this job will do
  agendaInstance.define(jobName, () => {
    console.log(`${jobName} executed at ${new Date()}`);

    // Request coin data from CoinMarketCap API
    coinDataRepo.getCoinData((err, coinData) => {
      // Retrieve all alarms from our DB
      alarmRepo.getAlarms((err, alarms) => {
        // Iterate through all the alarms
        alarms.forEach((alarm) => {
          let latestCoinData = _.findWhere(coinData, {id: alarm.coinId});

          // If the alarms coin is found and the alarm is triggered
          if (latestCoinData && alarm.isTriggered(latestCoinData)) {
            let message = `* ALARM * ${alarm.coinId}: $${latestCoinData.price_usd} is ${alarm.thresholdDirection} ${alarm.priceThreshold}`;

            // send a SMS message
            smsService.sendSms(message, () => {
              console.log(message);
            });

          }

        });

      });

    });

  });

};

// Set Schedule
exports.setSchedule = (timeInterval) => {
  agendaInstance.every(timeInterval, jobName);
}
