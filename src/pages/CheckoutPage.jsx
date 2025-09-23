"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@headlessui/react"
import { CheckCircle, Lock, HelpCircle } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { createOrder, clearOrderState } from "../store/slices/orderSlice"
import { clearCart } from "../store/slices/cartSlice"
import { useMidtransSnap } from "@/hooks/useMidtransSnap"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

/* ---------- Small Components ---------- */
const FormField = memo(({ id, label, tooltip, ...props }) => (
    <div className="space-y-2 relative group">
        <Label
            htmlFor={id}
            className="text-sm font-medium text-foreground/80 flex items-center gap-1"
        >
            {label}
            {tooltip && (
                <HelpCircle
                    size={14}
                    className="text-muted-foreground group-hover:text-foreground transition duration-300"
                    title={tooltip}
                />
            )}
        </Label>
        <Input
            id={id}
            {...props}
            className="bg-card/60 border border-border focus:border-accent focus:ring-2 focus:ring-accent/40 
                 text-foreground transition duration-300 rounded-xl py-3 w-full"
        />
    </div>
))

const CartItem = memo(({ item }) => {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-muted">
                    <img
                        src={item.images?.[0]?.url || "/placeholder.svg"}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                </div>
                <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                        Size {item.size} · Qty {item.quantity}
                    </p>
                </div>
            </div>
            <p className="font-mono font-semibold">
                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
            </p>
        </div>
    )
})

const PriceRow = memo(({ label, value, className = "" }) => (
    <div className={`flex justify-between ${className}`}>
        <span>{label}</span>
        <span className="font-mono text-foreground">{value}</span>
    </div>
))

/* ---------- Main Checkout Page ---------- */
const CheckoutPage = () => {
    const { isLoaded } = useMidtransSnap()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { toast } = useToast()

    const user = useSelector(useCallback((s) => s.auth.user, []))
    const cartItems = useSelector(useCallback((s) => s.cart.cartItems, []))
    const orderStatus = useSelector(useCallback((s) => s.orders.status, []))

    const [activeSection, setActiveSection] = useState("shipping")
    const [paymentMethod, setPaymentMethod] = useState("online")
    const [shippingAddress, setShippingAddress] = useState({
        street: "",
        city: "",
        postalCode: "",
        country: "Indonesia",
        phone: "",
    })

    /* Price calculation */
    const priceCalculations = useMemo(() => {
        const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        const shippingFee = cartItems.length > 0 ? 4000 : 0
        const adminFee = paymentMethod === "offline" ? 10000 : 0
        const onlineDiscount = 0
        const total =
            subtotal + shippingFee + (paymentMethod === "offline" ? adminFee : -onlineDiscount)

        return { subtotal, shippingFee, adminFee, onlineDiscount, total }
    }, [cartItems, paymentMethod])

    const paymentOptions = useMemo(
        () => [
            {
                id: "online",
                name: `Online Payment (-Rp ${priceCalculations.onlineDiscount.toLocaleString("id-ID")})`,
                desc: "Virtual Account / E-Wallet",
            },
            {
                id: "offline",
                name: `Cash On Delivery (+Rp ${priceCalculations.adminFee.toLocaleString("id-ID")})`,
                desc: "Pay with cash",
            },
        ],
        [priceCalculations.onlineDiscount, priceCalculations.adminFee]
    )

    /* Handlers */
    const handleAddressChange = useCallback((field, value) => {
        setShippingAddress((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleContinueToPayment = useCallback(() => {
        setActiveSection("payment")
    }, [])

    const handleEditShipping = useCallback(() => {
        setActiveSection("shipping")
    }, [])

    const handlePlaceOrder = useCallback(
        async (e) => {
            e.preventDefault()

            const orderData = {
                items: cartItems.map((i) => ({
                    product: i._id,
                    quantity: i.quantity,
                    size: i.size,
                })),
                shippingAddress: { ...shippingAddress, fullName: user.name },
                paymentMethod,
                itemsPrice: priceCalculations.subtotal,
                shippingPrice: priceCalculations.shippingFee,
                totalPrice: priceCalculations.total,
            }

            try {
                const result = await dispatch(createOrder(orderData)).unwrap()

                if (paymentMethod === "online") {
                    if (isLoaded && window.snap && result.midtransSnapToken) {
                        window.snap.pay(result.midtransSnapToken, {
                            onSuccess: () => {
                                toast({ title: "Payment Success 🎉", description: `#${result.order.orderId}` })
                                dispatch(clearCart())
                                dispatch(clearOrderState())
                                navigate("/profile", { state: { activeView: "orders" } })
                            },
                            onPending: () => {
                                toast({ title: "Payment Pending ⏳", description: `#${result.order.orderId}` })
                                navigate("/profile", { state: { activeView: "orders" } })
                            },
                            onError: (err) => {
                                toast({
                                    variant: "destructive",
                                    title: "Payment Failed",
                                    description: err.message,
                                })
                            },
                            onClose: () => {
                                toast({
                                    title: "Payment Cancelled",
                                    description: "You closed the payment popup.",
                                })
                            },
                        })
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Snap not loaded",
                            description: "Midtrans Snap.js not ready",
                        })
                    }
                } else {
                    toast({ title: "Order Confirmed 🎉", description: `#${result.order.orderId}` })
                    dispatch(clearCart())
                    dispatch(clearOrderState())
                    navigate("/profile", { state: { activeView: "orders" } })
                }
            } catch (err) {
                toast({ variant: "destructive", title: "Failed", description: err.message })
            }
        },
        [cartItems, shippingAddress, user.name, paymentMethod, priceCalculations, isLoaded, dispatch, toast, navigate]
    )

    /* Redirect if no cart */
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/profile", { state: { activeView: "orders" } })
        }
    }, [cartItems.length, navigate])

    return (
        <div className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:px-10 font-sans text-foreground">
            <Helmet>
                <title>Checkout</title>
            </Helmet>

            {/* Background glow */}
            <div className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-6xl mx-auto"
            >
                {/* Title */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold">Checkout</h1>
                    <p className="mt-2 text-muted-foreground">Almost there. Secure your order.</p>
                </div>

                {/* Main Form */}
                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:grid lg:grid-cols-5 gap-8">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Shipping */}
                        <div className="glass-card p-5 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold">Shipping</h2>
                                {activeSection !== "shipping" && (
                                    <button
                                        type="button"
                                        onClick={handleEditShipping}
                                        className="text-xs text-muted-foreground hover:text-foreground transition duration-300"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {activeSection === "shipping" ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField id="fullName" label="Name" defaultValue={user?.name} readOnly />
                                    <FormField id="email" label="Email" defaultValue={user?.email} readOnly />
                                    <FormField
                                        id="street"
                                        label="Street"
                                        value={shippingAddress.street}
                                        onChange={(e) => handleAddressChange("street", e.target.value)}
                                        required
                                    />
                                    <FormField
                                        id="phone"
                                        label="Phone"
                                        value={shippingAddress.phone}
                                        onChange={(e) => handleAddressChange("phone", e.target.value)}
                                        required
                                    />
                                    <FormField
                                        id="city"
                                        label="City"
                                        value={shippingAddress.city}
                                        onChange={(e) => handleAddressChange("city", e.target.value)}
                                        required
                                    />
                                    <FormField
                                        id="postalCode"
                                        label="Postal Code"
                                        value={shippingAddress.postalCode}
                                        onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                                        required
                                    />
                                    <div className="sm:col-span-2 mt-4">
                                        <Button
                                            type="button"
                                            onClick={handleContinueToPayment}
                                            className="w-full rounded-full font-bold btn-primary py-3"
                                        >
                                            Continue to Payment
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>
                                        {user?.name} — {user?.email}
                                    </p>
                                    <p>
                                        {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.postalCode}
                                    </p>
                                    <p>{shippingAddress.phone}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="glass-card p-5 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment</h2>
                            {activeSection === "payment" && (
                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={setPaymentMethod}
                                    className="space-y-3"
                                >
                                    {paymentOptions.map((opt) => (
                                        <RadioGroup.Option key={opt.id} value={opt.id}>
                                            {({ checked }) => (
                                                <div
                                                    className={`rounded-xl border px-5 py-4 transition duration-300 cursor-pointer ${checked
                                                        ? "border-accent ring-2 ring-accent/50 bg-card"
                                                        : "border-border hover:border-foreground/40"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold">{opt.name}</p>
                                                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                                        </div>
                                                        {checked && <CheckCircle className="text-accent" size={20} />}
                                                    </div>
                                                </div>
                                            )}
                                        </RadioGroup.Option>
                                    ))}
                                </RadioGroup>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
                        <div className="glass-card p-5 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Summary</h2>

                            {/* Cart items */}
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <CartItem key={`${item._id}-${item.size}`} item={item} />
                                ))}
                            </div>

                            <div className="border-t border-border my-5" />

                            {/* Price breakdown */}
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <PriceRow
                                    label="Subtotal"
                                    value={`Rp ${priceCalculations.subtotal.toLocaleString("id-ID")}`}
                                />
                                <PriceRow
                                    label="Shipping"
                                    value={`Rp ${priceCalculations.shippingFee.toLocaleString("id-ID")}`}
                                />
                                {paymentMethod === "offline" && (
                                    <PriceRow
                                        label="Admin Fee"
                                        value={`Rp ${priceCalculations.adminFee.toLocaleString("id-ID")}`}
                                        className="text-success"
                                    />
                                )}
                            </div>

                            <div className="border-t border-border my-5" />

                            {/* Total */}
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="font-mono text-accent">
                                    Rp {priceCalculations.total.toLocaleString("id-ID")}
                                </span>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={activeSection !== "payment" || orderStatus === "loading"}
                                className="w-full mt-6 rounded-full font-bold btn-primary py-3 disabled:opacity-50"
                            >
                                <Lock size={18} className="mr-2" />
                                {orderStatus === "loading"
                                    ? "Processing..."
                                    : paymentMethod === "offline"
                                        ? "Place Order"
                                        : "Pay Now"}
                            </Button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default CheckoutPage
