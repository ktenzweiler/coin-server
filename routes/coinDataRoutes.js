// coinDataRoutes.js
const _ = require('underscore');

const coinDataRepo = require('../dataAccess/repos/coinDataRepository');
const alarmRepo = require('../dataAccess/repos/alarmRepository');
const smsService = require('../services/smsServices');

// Coin routes
exports.configure = (app) => {
  // RESTful coin routes
  app.get('/api/coins', getCoinData);

};

// Get latest crypto currency data
// Get all alarms
// check if threshold is crossed
// return crypto currency data in JSON format
function getCoinData(req, res, done) {

  coinDataRepo.getCoinData((err, coinData) => {

    alarmRepo.getAlarms((err, alarms) => {

      alarms.forEach((alarm) => {

        let latestCoinData = _.findWhere(coinData, {id: alarm.coinId});

        if (latestCoinData && alarm.isTriggered(latestCoinData)) {

          let message = `*ALARM * ${alarm.coinId}: $${latestCoinData.price_usd} is ${alarm.thresholdDirection}`;

          smsService.sendSms(message, () => {
            console.log(message);
          });

        }

      });

      res.json(coinData);
    });

  });

}
