
declare const PaystackPop: any;

interface SecurePaymentConfig {
  email: string;
  sessionId: string;
  planId: string;
  onSuccess: (response: any) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

/**
 * Initializes a secure Paystack transaction by communicating with Firebase Cloud Functions.
 * The price calculation and verification happen entirely on the server.
 */
export const initializeSecurePayment = async (config: SecurePaymentConfig) => {
  try {
    // 1. Call your Firebase Cloud Function to initialize the transaction
    // This assumes you have a function named 'initPaystackTransaction'
    const response = await fetch('https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/initPaystackTransaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: config.email,
        sessionId: config.sessionId,
        planId: config.planId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to initialize transaction');
    }

    // 2. Use the returned access_code to open the Paystack modal
    // This is the most secure way as it uses a pre-generated transaction on Paystack's servers
    const handler = PaystackPop.setup({
      key: data.publicKey, // Public Key returned from server
      access_code: data.access_code,
      onClose: () => {
        config.onCancel();
      },
      callback: (response: any) => {
        // Note: We don't update Firestore here! 
        // We just notify the UI that the user finished the flow.
        // The Webhook will handle the actual data update securely.
        config.onSuccess(response);
      },
    });

    handler.openIframe();
  } catch (error: any) {
    console.error('Payment Initialization Error:', error);
    config.onError(error.message);
  }
};
