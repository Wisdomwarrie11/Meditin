
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import axios from 'axios';
// import * as crypto from 'crypto';

// admin.initializeApp();
// const db = admin.firestore();

// const PAYSTACK_SECRET_KEY = functions.config().paystack.secret_key;
// const PAYSTACK_PUBLIC_KEY = functions.config().paystack.public_key;

// /**
//  * Initialize Transaction (Server-Side)
//  * 1. Fetches Plan from Firestore (or constants)
//  * 2. Calculates Price (Early bird logic)
//  * 3. Calls Paystack to generate access_code
//  */
// export const initPaystackTransaction = functions.https.onRequest(async (req, res) => {
//     // CORS logic here...
//     res.set('Access-Control-Allow-Origin', '*');
//     if (req.method === 'OPTIONS') {
//         res.set('Access-Control-Allow-Methods', 'POST');
//         res.set('Access-Control-Allow-Headers', 'Content-Type');
//         res.status(204).send('');
//         return;
//     }

//     try {
//         const { email, sessionId, planId } = req.body;

//         // Fetch session to verify ownership and date for discount
//         const sessionRef = db.collection('practiceSessions').doc(sessionId);
//         const sessionSnap = await sessionRef.get();
//         if (!sessionSnap.exists) throw new Error('Session not found');
//         const session = sessionSnap.data();

//         // Calculate amount server-side based on planId (Assume PRICING_PLANS imported or hardcoded here)
//         // Hardcoded example for calculation:
//         const planPriceMap: any = {
//             'int_basic_once': 2500,
//             'int_silver_once': 5000,
//             'int_gold_once': 10000,
//             'int_diamond_once': 15000
//         };
//         const basePrice = planPriceMap[planId] || 5000;
//         const finalAmount = Math.round(basePrice * 0.85); // 15% discount for 4-day notice

//         // Initialize with Paystack
//         const paystackRes = await axios.post('https://api.paystack.co/transaction/initialize', {
//             email,
//             amount: finalAmount * 100, // kobo
//             reference: `MED-${sessionId}-${Date.now()}`,
//             metadata: { sessionId, planId }
//         }, {
//             headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
//         });

//         res.status(200).json({
//             access_code: paystackRes.data.data.access_code,
//             reference: paystackRes.data.data.reference,
//             publicKey: PAYSTACK_PUBLIC_KEY
//         });
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//     }
// });

// /**
//  * Paystack Webhook Handler (Source of Truth)
//  * 1. Verifies Paystack Signature
//  * 2. Processes 'charge.success'
//  * 3. Idempotently updates Firestore session using Transaction
//  */
// export const paystackWebhook = functions.https.onRequest(async (req, res) => {
//     const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
//                        .update(JSON.stringify(req.body))
//                        .digest('hex');

//     if (hash !== req.headers['x-paystack-signature']) {
//         res.status(401).send('Unauthorized Signature');
//         return;
//     }

//     const event = req.body;
//     if (event.event === 'charge.success') {
//         const { sessionId, planId } = event.data.metadata;
//         const reference = event.data.reference;

//         try {
//             await db.runTransaction(async (t) => {
//                 const sessionRef = db.collection('practiceSessions').doc(sessionId);
//                 const sessionSnap = await t.get(sessionRef);
//                 const session = sessionSnap.data();

//                 // Prevent duplicate processing
//                 if (session?.paid) return;

//                 t.update(sessionRef, {
//                     paid: true,
//                     status: 'SCHEDULED',
//                     planId: planId,
//                     paymentReference: reference,
//                     paidAt: admin.firestore.FieldValue.serverTimestamp()
//                 });

//                 // Optionally log payment details to a separate collection
//                 const paymentRef = db.collection('payments').doc(reference);
//                 t.set(paymentRef, {
//                     sessionId,
//                     userId: session?.userId,
//                     amount: event.data.amount / 100,
//                     status: 'SUCCESS',
//                     processedAt: admin.firestore.FieldValue.serverTimestamp()
//                 });
//             });

//             console.log(`Payment successful for Session ${sessionId}`);
//         } catch (error) {
//             console.error('Transaction failure:', error);
//         }
//     }

//     res.status(200).send('Event Received');
// });
