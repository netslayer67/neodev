// src/utils/orderUtils.js

/**
 * Hitung subtotal, ongkir, admin fee, diskon, dan total.
 * Mirror dari BE -> utils/order.ts
 */
export function calculateOrderTotal(items, paymentMethod = "online") {
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingPrice = items.length > 0 ? 15000 : 0 // ✅ konsisten sama BE
  const adminFee = paymentMethod === "offline" ? 2500 : 0
  const discount = paymentMethod === "online" ? 3000 : 0
  const totalAmount = itemsPrice + shippingPrice + adminFee - discount

  return { itemsPrice, shippingPrice, adminFee, discount, totalAmount }
}
