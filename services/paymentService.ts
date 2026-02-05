
declare const PaystackPop: any;

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  ref: string;
  onSuccess: (response: any) => void;
  onCancel: () => void;
}

export const initializePayment = ({ key, email, amount, ref, onSuccess, onCancel }: PaystackConfig) => {
  const handler = PaystackPop.setup({
    key,
    email,
    amount: amount * 100, // Paystack works in kobo/cents
    ref,
    callback: (response: any) => {
      // In a real production app, you MUST verify this on the server
      // using Paystack's verify endpoint via a Cloud Function.
      onSuccess(response);
    },
    onClose: () => {
      onCancel();
    },
  });
  handler.openIframe();
};
