import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.ALTA_BASE_URL || 'https://91.239.151.43:9092';
const USER_ID = process.env.ALTA_USER_ID;
const TID = process.env.ALTA_TID;

let sessionToken = null;
let tokenExpiry = null;

// 🔹 Generate Token
export const generateToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/res/v1/generateToken`, {
      userId: USER_ID,
      tid: TID
    });

    sessionToken = response.data.sessionToken;
    tokenExpiry = Date.now() + (Number(response.data.tokenExpiryTime) * 1000);
    console.log('✅ Token generated successfully');
    return sessionToken;
  } catch (err) {
    console.error('❌ Error generating token:', err.response?.data || err.message);
    throw err;
  }
};

// 🔹 Ensure token valid
const ensureToken = async () => {
  if (!sessionToken || Date.now() > tokenExpiry) {
    await generateToken();
  }
  return sessionToken;
};

// // 🔹 Create Payment (Authorization Request)
// export const createPayment = async (orderId, amount) => {
//   try {
//     const token = await ensureToken();

//     const payload = {
//       tid: TID,
//       amount: amount.toFixed(2),
//       orderId,
//       successSiteURL: 'https://tvoj-sajt.rs/payment/success',
//       failSiteURL: 'https://tvoj-sajt.rs/payment/fail',
//       cancelSiteURL: 'https://tvoj-sajt.rs/payment/cancel'
//     };

//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//       'Terminal-Identification': TID
//     };

//     const response = await axios.post(`${BASE_URL}/ips/v2/eCommerce`, payload, { headers });
//     return response.data; // vrati qrCodeURL
//   } catch (err) {
//     console.error('❌ Error creating payment:', err.response?.data || err.message);
//     throw err;
//   }
// };

// // 🔹 Check Payment Status
// export const checkPaymentStatus = async (orderId, amount) => {
//   try {
//     const token = await ensureToken();

//     const payload = { tid: TID, amount: amount.toFixed(2), orderId };
//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//       'Terminal-Identification': TID
//     };

//     const response = await axios.post(`${BASE_URL}/ips/v2/checkStatus`, payload, { headers });
//     return response.data;
//   } catch (err) {
//     console.error('❌ Error checking payment status:', err.response?.data || err.message);
//     throw err;
//   }

export const createPayment = async (orderId, amount) => {
  // samo generišemo link do javnog QR generatora
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ORDER:${orderId}|AMOUNT:${amount}RSD|IPS-TEST`;

  console.log('✅ Fake payment created for', orderId, 'amount', amount);
  return { qrCodeURL: qrUrl };
};

// 🔹 FAKE Check Payment Status
export const checkPaymentStatus = async (orderId, amount) => {
  console.log('✅ Fake status checked for', orderId);
  return { responseCode: '00', message: 'Plaćanje uspešno (test)', orderId, amount };
};
