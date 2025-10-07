import { getFirestore } from "firebase-admin/firestore";
import "../config/firebaseConfig.js";

const db = getFirestore();

export const createOrder = async (orderData) => {
  try {
    const ordersRef = db.collection("orders");
    await ordersRef.doc(orderData.orderId).set(orderData);
    console.log(`✅ Order ${orderData.orderId} uspešno upisan u Firestore`);
  } catch (error) {
    console.error("❌ Greška pri upisu ordera u Firestore:", error);
    throw error;
  }
};
