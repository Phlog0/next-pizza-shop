export const deliveryPrice = 210;
export function calcTotalAmountWithPercentages(totalAmount: number) {
  if (
    typeof totalAmount !== "number" ||
    isNaN(totalAmount) ||
    !isFinite(totalAmount)
  ) {
    throw new Error("totalAmount must be a valid number");
  }
  if (totalAmount < 0) {
    throw new Error("totalAmount cannot be negative");
  }
  const roundedAmount = Math.round(totalAmount * 100) / 100;
  const taxesPrice = ((roundedAmount / 100) * 5).toFixed(2);
  const totalAmountWithPercentages =
    totalAmount + Number(taxesPrice) + deliveryPrice;
  return {
    taxesPrice,
    totalAmountWithPercentages: totalAmountWithPercentages.toFixed(2),
  };
}
