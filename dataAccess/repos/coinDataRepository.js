// coinDataRepository.js
const request = require('request');

// Make a GET request to CoinMarketCap's API to retrieve latest crypto dataAccess
exports.getCoinData = (done) => {

  request.get('https://api.coinmarketcap.com/v1/ticker/', (err, response, body) => {

    let coinData = JSON.parse(body);

    done(err, coinData);
  });

};
