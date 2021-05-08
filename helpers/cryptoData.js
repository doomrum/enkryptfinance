const  api = require('binance');
const binanceWS = new api.BinanceWS(true); // Argument specifies whether the responses should be beautified, defaults to true

function cryptoData() {
  return binanceWS.onDepthUpdate('BNBBTC', data => {
    return   data;
  });
}
module.exports = cryptoData;

