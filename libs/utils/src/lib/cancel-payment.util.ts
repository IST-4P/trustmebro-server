export const generateCancelPaymentJobId = (paymentId: string) => {
  return `paymentCode-${paymentId}`;
};
