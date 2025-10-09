import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.ALTA_BASE_URL;
const USER_ID = process.env.ALTA_USER_ID;
const TID = process.env.ALTA_TID;

const SUCCESS_URL = process.env.SUCCESS_URL;
const FAIL_URL = process.env.FAIL_URL;
const CANCEL_URL = process.env.CANCEL_URL;

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

// 🔹 Create Payment (Production-ready, ali ne šalje stvarno)
export const createPayment = async (orderId, amount) => {
  try {
    const token = await ensureToken();

    const payload = {
      tid: TID,
      amount: Number(amount).toFixed(2),
      orderId,
      successSiteURL: SUCCESS_URL,
      failSiteURL: FAIL_URL,
      cancelSiteURL: CANCEL_URL
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Terminal-Identification': TID
    };

    console.log('📦 IPS Payment Request (prepared, not sent):');
    console.log(JSON.stringify(payload, null, 2));

    // ❗ za sada nećemo zvati pravi servis, samo vraćamo fake QR
    const response = await axios.post(`${BASE_URL}/ips/v2/eCommerce`, payload, { headers });
    return response.data;

    // const fakeQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ORDER:${orderId}|AMOUNT:${amount}RSD|IPS-TEST`;
    // return { qrCodeURL: fakeQrUrl };
  } catch (err) {
    console.error('❌ Error creating payment:', err.response?.data || err.message);
    throw err;
  }
};

// 🔹 Check Payment Status (fake dok ne aktiviramo produkciju)
export const checkPaymentStatus = async (orderId, amount) => {
  console.log('🔍 Checking status for', orderId, '-', amount);
  return { responseCode: '00', message: 'Plaćanje uspešno (test mode)' };
};
