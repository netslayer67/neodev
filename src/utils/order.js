// src/utils/orderUtils.js

/**
 * Hitung subtotal, ongkir, admin fee, diskon, dan total.
 * Updated to use dynamic shipping from backend instead of hardcoded values
 */
export function calculateOrderTotal(items, shippingCost = 0, paymentMethod = "online") {
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingPrice = shippingCost // Use dynamic shipping cost from backend
  const adminFee = paymentMethod === "offline" ? 2500 : 0
  const discount = paymentMethod === "online" ? 3000 : 0
  const totalAmount = itemsPrice + shippingPrice + adminFee - discount

  return { itemsPrice, shippingPrice, adminFee, discount, totalAmount }
}
