"use client"

import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@headlessui/react"
import { CheckCircle, Lock, HelpCircle, CreditCard, Banknote, Truck } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { createOrder, clearOrderState } from "../store/slices/orderSlice"
import { clearCart } from "../store/slices/cartSlice"
import { useMidtransSnap } from "@/hooks/useMidtransSnap"
import ShippingCalculator from "@/components/checkout/ShippingCalculator"
import { shippingUtils } from "@/api/shipping"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

/* ---------- Helper Components ---------- */
const FormField = memo(({ id, label, tooltip, children, ...props }) => (
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
        {children || (
            <Input
                id={id}
                {...props}
                className="bg-card/60 border border-border focus:border-accent focus:ring-2 focus:ring-accent/40 
                     text-foreground transition duration-300 rounded-xl py-3 w-full"
            />
        )}
    </div>
))

const CartItem = memo(({ item }) => {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-card/30">
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
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                        Size {item.size} • Qty {item.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        @{shippingUtils.formatPrice(item.price)}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-mono font-semibold text-sm">
                    {shippingUtils.formatPrice(item.price * item.quantity)}
                </p>
            </div>
        </div>
    )
})

const PriceRow = memo(({ label, value, className = "", highlight = false }) => (
    <div className={`flex justify-between items-center ${className} ${highlight ? "text-lg font-bold" : "text-sm"
        }`}>
        <span className={highlight ? "text-foreground" : "text-muted-foreground"}>{label}</span>
        <span className={`font-mono ${highlight ? "text-accent font-bold" : "text-foreground"}`}>
            {value}
        </span>
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
    const [paymentMethod, setPaymentMethod] = useState("va")
    const [shippingCost, setShippingCost] = useState(0)
    const [selectedShippingService, setSelectedShippingService] = useState('REG')
    const [shippingAddress, setShippingAddress] = useState({
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Indonesia",
        phone: "",
    })
    const [addressValidation, setAddressValidation] = useState({
        isValid: false,
        errors: []
    })
    const isProcessingOrderRef = useRef(false)

    // Calculate cart weight (300g per item default)
    const cartWeight = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const itemWeight = item.weight || 300 // 300g default
            return total + (itemWeight * item.quantity)
        }, 0)
    }, [cartItems])

    /* Enhanced Price calculation */
    const priceCalculations = useMemo(() => {
        const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        const adminFee = paymentMethod === "cod" ? 2500 : 0
        const discount = paymentMethod === "va" ? 3000 : 0
        const total = subtotal + shippingCost + adminFee - discount

        return {
            subtotal,
            shippingFee: shippingCost,
            adminFee,
            discount,
            total,
            savings: shippingCost === 0 ? 15000 : 0 // Show savings for free shipping
        }
    }, [cartItems, paymentMethod, shippingCost])

    const paymentOptions = useMemo(
        () => [
            {
                id: "va",
                name: "Pembayaran Online",
                desc: "Virtual Account, E-Wallet, Credit Card",
                icon: CreditCard,
                recommended: true
            },
            {
                id: "cod",
                name: `Cash On Delivery (+${shippingUtils.formatPrice(priceCalculations.adminFee)})`,
                desc: "Bayar saat barang diterima",
                icon: Banknote,
                fee: priceCalculations.adminFee
            },
        ],
        [priceCalculations.adminFee]
    )

    /* Enhanced address validation */
    const validateAddress = useCallback(() => {
        const errors = []

        if (!shippingAddress.street || shippingAddress.street.trim().length < 10) {
            errors.push('Alamat lengkap minimal 10 karakter')
        }

        if (!shippingAddress.city || shippingAddress.city.trim().length < 3) {
            errors.push('Nama kota/kabupaten harus diisi')
        }

        if (!shippingAddress.postalCode || !shippingUtils.isValidPostalCode(shippingAddress.postalCode)) {
            errors.push('Kode pos harus 5 digit angka')
        }

        if (!shippingAddress.phone || !shippingUtils.isValidPhoneNumber(shippingAddress.phone)) {
            errors.push('Nomor telepon tidak valid')
        }

        setAddressValidation({
            isValid: errors.length === 0,
            errors
        })

        return errors.length === 0
    }, [shippingAddress])

    /* Handlers */
    const handleAddressChange = useCallback((field, value) => {
        setShippingAddress((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleShippingCostChange = useCallback((cost, service) => {
        setShippingCost(cost)
        setSelectedShippingService(service)
    }, [])

    const handleContinueToPayment = useCallback(() => {
        if (!validateAddress()) {
            toast({
                variant: "destructive",
                title: "Alamat tidak lengkap",
                description: "Mohon lengkapi dan periksa kembali alamat pengiriman Anda"
            })
            return
        }

        if (shippingCost === 0 && !shippingUtils.isLikelyJabodetabek(shippingAddress.city)) {
            toast({
                variant: "destructive",
                title: "Ongkir belum dihitung",
                description: "Silakan tunggu perhitungan ongkir selesai"
            })
            return
        }

        setActiveSection("payment")
    }, [shippingAddress, shippingCost, validateAddress, toast])

    const handleEditShipping = useCallback(() => {
        setActiveSection("shipping")
    }, [])

    const handlePlaceOrder = useCallback(
        async (e) => {
            e.preventDefault()

            if (!validateAddress()) {
                toast({
                    variant: "destructive",
                    title: "Alamat tidak valid",
                    description: "Mohon periksa kembali alamat pengiriman Anda"
                })
                return
            }

            const orderData = {
                items: cartItems.map((i) => ({
                    product: i._id,
                    quantity: i.quantity,
                    size: i.size,
                })),
                shippingAddress: {
                    ...shippingAddress,
                    fullName: user.name
                },
                paymentMethod,
                shippingCost: shippingCost,
                selectedShippingService,
                notes: '' // Add notes field if needed
            }

            isProcessingOrderRef.current = true
            try {
                const result = await dispatch(createOrder(orderData)).unwrap()

                // Ensure we have the order data
                const orderResponse = result.data || result
                if (!orderResponse || !orderResponse.order || !orderResponse.order.orderId) {
                    console.error('Invalid order response:', result)
                    throw new Error("Order creation failed - missing order data")
                }

                const orderId = orderResponse.order.orderId

                if (paymentMethod === "va") {
                    if (isLoaded && window.snap && result.payment?.snapToken) {
                        window.snap.pay(result.payment.snapToken, {
                            onSuccess: () => {
                                console.log('Midtrans onSuccess triggered, navigating to profile')
                                toast({
                                    title: "Pembayaran Berhasil! 🎉",
                                    description: `Order #${orderId} telah dibayar`
                                })
                                dispatch(clearCart())
                                dispatch(clearOrderState())
                                navigate("/profile", { state: { activeView: "orders" } })
                                isProcessingOrderRef.current = false
                            },
                            onPending: () => {
                                toast({
                                    title: "Pembayaran Pending ⏳",
                                    description: `Order #${orderId} menunggu pembayaran`
                                })
                                navigate("/profile", { state: { activeView: "orders" } })
                                isProcessingOrderRef.current = false
                            },
                            onError: (err) => {
                                toast({
                                    variant: "destructive",
                                    title: "Pembayaran Gagal",
                                    description: err.message || "Terjadi kesalahan dalam pembayaran",
                                })
                                isProcessingOrderRef.current = false
                            },
                            onClose: () => {
                                toast({
                                    title: "Pembayaran Dibatalkan",
                                    description: "Anda menutup halaman pembayaran.",
                                })
                            },
                        })
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Sistem pembayaran belum siap. Silakan coba lagi.",
                        })
                    }
                } else {
                    console.log('COD payment, navigating to profile')
                    toast({
                        title: "Order Berhasil Dibuat! 🎉",
                        description: `Order #${orderId} akan segera diproses`
                    })
                    dispatch(clearCart())
                    dispatch(clearOrderState())
                    navigate("/profile", { state: { activeView: "orders" } })
                    isProcessingOrderRef.current = false
                }
            } catch (err) {
                console.error('Order creation failed:', err)
                toast({
                    variant: "destructive",
                    title: "Gagal membuat pesanan",
                    description: err.message || "Terjadi kesalahan saat membuat pesanan. Silakan coba lagi."
                })
                isProcessingOrderRef.current = false
            }
        },
        [
            cartItems, shippingAddress, user.name, paymentMethod,
            shippingCost, selectedShippingService, isLoaded,
            dispatch, toast, navigate, validateAddress
        ]
    )

    /* Redirect if no cart on initial load (not during order processing) */
    useEffect(() => {
        // Only redirect to cart on component mount if cart is initially empty
        // This prevents redirect during order creation when cart is cleared
        if (cartItems.length === 0 && !isProcessingOrderRef.current) {
            navigate("/cart")
        }
    }, []) // Empty dependency array - only run on mount

    // Validate address on changes
    useEffect(() => {
        if (activeSection === "shipping") {
            validateAddress()
        }
    }, [shippingAddress, activeSection, validateAddress])

    return (
        <div className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:px-10 font-sans text-foreground">
            <Helmet>
                <title>Checkout - Radiant Rage</title>
                <meta name="description" content="Selesaikan pembelian Anda dengan aman dan mudah" />
            </Helmet>

            {/* Background effects */}
            <div className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-6xl mx-auto"
            >
                {/* Enhanced Title */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Checkout
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Selesaikan pembelian Anda dengan aman
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mt-6 space-x-4">
                        <div className={`flex items-center space-x-2 ${activeSection === "shipping" ? "text-accent" : "text-muted-foreground"
                            }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${activeSection === "shipping" ? "border-accent bg-accent text-white" : "border-muted-foreground"
                                }`}>
                                1
                            </div>
                            <span className="text-sm font-medium">Alamat</span>
                        </div>
                        <div className="w-8 h-0.5 bg-border" />
                        <div className={`flex items-center space-x-2 ${activeSection === "payment" ? "text-accent" : "text-muted-foreground"
                            }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${activeSection === "payment" ? "border-accent bg-accent text-white" : "border-muted-foreground"
                                }`}>
                                2
                            </div>
                            <span className="text-sm font-medium">Pembayaran</span>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:grid lg:grid-cols-5 gap-8">
                    {/* LEFT SIDE - Enhanced */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Shipping Section */}
                        <div className="glass-card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Truck size={20} className="text-accent" />
                                    Alamat Pengiriman
                                </h2>
                                {activeSection !== "shipping" && (
                                    <button
                                        type="button"
                                        onClick={handleEditShipping}
                                        className="text-sm text-accent hover:text-accent/80 transition duration-300 font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {activeSection === "shipping" ? (
                                <div className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <FormField id="fullName" label="Nama Lengkap">
                                            <Input
                                                id="fullName"
                                                defaultValue={user?.name}
                                                readOnly
                                                className="bg-muted/50"
                                            />
                                        </FormField>
                                        <FormField id="email" label="Email">
                                            <Input
                                                id="email"
                                                defaultValue={user?.email}
                                                readOnly
                                                className="bg-muted/50"
                                            />
                                        </FormField>
                                    </div>

                                    <FormField
                                        id="phone"
                                        label="No. Telepon"
                                        tooltip="Format: 08xxxxxxxxxx atau +62xxxxxxxxxx"
                                    >
                                        <Input
                                            id="phone"
                                            value={shippingAddress.phone}
                                            onChange={(e) => handleAddressChange("phone", e.target.value)}
                                            placeholder="08xxxxxxxxxx"
                                            required
                                            className={addressValidation.errors.some(e => e.includes('telepon')) ? 'border-red-500' : ''}
                                        />
                                    </FormField>

                                    <FormField id="street" label="Alamat Lengkap">
                                        <textarea
                                            id="street"
                                            value={shippingAddress.street}
                                            onChange={(e) => handleAddressChange("street", e.target.value)}
                                            placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan"
                                            className={`w-full p-3 border rounded-xl bg-card/60 min-h-[80px] resize-none transition duration-300 focus:border-accent focus:ring-2 focus:ring-accent/40 ${addressValidation.errors.some(e => e.includes('Alamat')) ? 'border-red-500' : 'border-border'
                                                }`}
                                            required
                                        />
                                    </FormField>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <FormField
                                            id="postalCode"
                                            label="Kode Pos"
                                            tooltip="5 digit kode pos Indonesia"
                                        >
                                            <Input
                                                id="postalCode"
                                                value={shippingAddress.postalCode}
                                                onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                                                placeholder="12345"
                                                maxLength={5}
                                                required
                                                className={addressValidation.errors.some(e => e.includes('Kode pos')) ? 'border-red-500' : ''}
                                            />
                                        </FormField>
                                    </div>

                                    {/* Enhanced Shipping Calculator */}
                                    <ShippingCalculator
                                        shippingAddress={shippingAddress}
                                        onShippingCostChange={handleShippingCostChange}
                                        cartWeight={cartWeight}
                                        onAddressChange={handleAddressChange}
                                    />

                                    {/* Validation Errors */}
                                    {addressValidation.errors.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="font-medium text-red-800 mb-2">Perhatian:</h4>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                {addressValidation.errors.map((error, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <span className="w-1 h-1 bg-red-600 rounded-full" />
                                                        {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <Button
                                            type="button"
                                            onClick={handleContinueToPayment}
                                            disabled={!addressValidation.isValid}
                                            className="w-full rounded-full font-bold btn-primary py-3 disabled:opacity-50"
                                        >
                                            Lanjut ke Pembayaran
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{user?.name}</p>
                                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                                            <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                        <p className="text-sm">{shippingAddress.street}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {shippingAddress.city}, {shippingAddress.postalCode}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
                                        <Truck size={16} className="text-accent" />
                                        <span className="text-sm font-medium text-accent">
                                            {selectedShippingService} - {shippingUtils.formatPrice(shippingCost)}
                                        </span>
                                        {shippingCost === 0 && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                GRATIS
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Payment Section */}
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <CreditCard size={20} className="text-accent" />
                                Metode Pembayaran
                            </h2>
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
                                                    className={`rounded-xl border px-6 py-4 transition duration-300 cursor-pointer relative ${checked
                                                        ? "border-accent ring-2 ring-accent/50 bg-accent/5"
                                                        : "border-border hover:border-accent/40 hover:bg-accent/5"
                                                        }`}
                                                >
                                                    {opt.recommended && (
                                                        <span className="absolute -top-2 left-4 px-2 py-1 text-xs font-medium bg-accent text-white rounded-full">
                                                            Direkomendasikan
                                                        </span>
                                                    )}
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <opt.icon size={20} className="text-foreground/70" />
                                                            <div>
                                                                <p className="font-semibold">{opt.name}</p>
                                                                <p className="text-sm text-muted-foreground">{opt.desc}</p>
                                                            </div>
                                                        </div>
                                                        {checked && (
                                                            <CheckCircle className="text-accent" size={20} />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </RadioGroup.Option>
                                    ))}
                                </RadioGroup>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE - Enhanced Order Summary */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-semibold mb-6">Ringkasan Pesanan</h2>

                            {/* Cart items */}
                            <div className="space-y-3 mb-6">
                                {cartItems.map((item) => (
                                    <CartItem key={`${item._id}-${item.size}`} item={item} />
                                ))}
                            </div>

                            <div className="border-t border-border my-6" />

                            {/* Enhanced Price breakdown */}
                            <div className="space-y-3">
                                <PriceRow
                                    label="Subtotal"
                                    value={shippingUtils.formatPrice(priceCalculations.subtotal)}
                                />
                                <PriceRow
                                    label={`Ongkir (${selectedShippingService})`}
                                    value={shippingCost === 0 ? "GRATIS" : shippingUtils.formatPrice(priceCalculations.shippingFee)}
                                    className={shippingCost === 0 ? "text-green-600" : ""}
                                />
                                {priceCalculations.savings > 0 && (
                                    <PriceRow
                                        label="Hemat ongkir"
                                        value={`-${shippingUtils.formatPrice(priceCalculations.savings)}`}
                                        className="text-green-600"
                                    />
                                )}
                                {paymentMethod === "cod" && priceCalculations.adminFee > 0 && (
                                    <PriceRow
                                        label="Biaya Admin COD"
                                        value={shippingUtils.formatPrice(priceCalculations.adminFee)}
                                    />
                                )}
                            </div>

                            <div className="border-t border-border my-6" />

                            {/* Total */}
                            <PriceRow
                                label="Total"
                                value={shippingUtils.formatPrice(priceCalculations.total)}
                                highlight={true}
                            />

                            {/* Enhanced CTA Button */}
                            <Button
                                type="submit"
                                size="lg"
                                disabled={activeSection !== "payment" || orderStatus === "loading" || !addressValidation.isValid}
                                className="w-full mt-6 rounded-full font-bold btn-primary py-4 disabled:opacity-50 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <Lock size={18} className="mr-2" />
                                {orderStatus === "loading"
                                    ? "Memproses..."
                                    : paymentMethod === "cod"
                                        ? "Buat Pesanan"
                                        : "Bayar Sekarang"}
                            </Button>

                            {paymentMethod === "va" && (
                                <p className="text-xs text-muted-foreground text-center mt-3">
                                    Anda akan diarahkan ke halaman pembayaran yang aman
                                </p>
                            )}

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-border">
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Lock size={12} />
                                    <span>SSL Secure</span>
                                </div>
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <div className="text-xs text-muted-foreground">
                                    Pembayaran Aman
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default CheckoutPage