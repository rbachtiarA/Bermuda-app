// const midtransClient = require('midtrans-client');
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  clientKey: process.env.CLIENT_KEY_MIDTRANS || '',
  serverKey: process.env.SERVER_KEY_MIDTRANS || '',
});

const MidtransApi = new midtransClient.CoreApi({
  isProduction: false,
  clientKey: process.env.CLIENT_KEY_MIDTRANS || '',
  serverKey: process.env.SERVER_KEY_MIDTRANS || '',
});

// module.exports = {
//   snap,
//   MidtransApi,
// };

export default { snap, MidtransApi };
