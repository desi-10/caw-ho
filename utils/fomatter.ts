export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

export const formatPaymentType = (paymentType: string) => {
  return paymentType === "CASH"
    ? "Cash"
    : paymentType === "MOBILE_MONEY"
    ? "Mobile Money"
    : "Bank Transfer";
};

export const formatStatus = (status: string) => {
  return status === "PENDING"
    ? "Pending"
    : status === "COMPLETED"
    ? "Completed"
    : "Cancelled";
};

export const formatType = (type: string) => {
  return type === "TITHE"
    ? "Tithe"
    : type === "OFFERING"
    ? "Offering"
    : type === "DONATION"
    ? "Donation"
    : type === "EXPENSE"
    ? "Expense"
    : type === "PLEDGE"
    ? "Pledge"
    : "Other";
};

export const dateFormatter = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
