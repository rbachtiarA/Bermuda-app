const midtransClient = require('midtrans-client');

const snap = new midtransClient.Midtrans.Snap({
  isProduction: false,
  clientKey: process.env.CLIENT_KEY_MIDTRANS || '',
  serverKey: process.env.SERVER_KEY_MIDTRANS || '',
});

const MidtransApi = new midtransClient.Midtrans.CoreApi({
  isProduction: false,
  clientKey: process.env.CLIENT_KEY_MIDTRANS || '',
  serverKey: process.env.SERVER_KEY_MIDTRANS || '',
});
module.exports = {
  snap,
  MidtransApi,
};
