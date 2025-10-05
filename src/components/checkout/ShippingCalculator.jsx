// src/components/checkout/ShippingCalculator.jsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioGroup } from '@headlessui/react';
import { CheckCircle, Truck, Gift, AlertCircle, Loader2 } from 'lucide-react';
import { shippingAPI, shippingUtils } from '@/api/shipping';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ShippingCalculator = memo(({
  shippingAddress,
  onShippingCostChange,
  cartWeight = 1000,
  onAddressChange
}) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  /**
   * Calculate shipping cost when city changes
   */
  const calculateShipping = useCallback(async () => {
    if (!shippingAddress.city || shippingAddress.city.length < 3) {
      setShippingOptions([]);
      setSelectedShipping(null);
      onShippingCostChange(0, 'REG');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await shippingAPI.getShippingCost({
        destinationCity: shippingAddress.city,
        weight: cartWeight
      });

      const shippingData = response.data.data;
      const { destination, isJabodetabek, shippingCost, courier, service, etd } = shippingData;

      // Create shipping option from backend response
      const shippingOption = {
        service: service || 'REG',
        description: `${courier || 'Standard'} ${service || 'Regular'}`,
        cost: shippingCost,
        etd: etd || '2-3 hari kerja',
        isFree: shippingCost === 0
      };

      setShippingOptions([shippingOption]);
      setIsFreeShipping(isJabodetabek);

      // Auto-select the option
      setSelectedShipping(shippingOption);
      onShippingCostChange(shippingOption.cost, shippingOption.service);

      // Show free shipping message
      if (isJabodetabek && shippingCost === 0) {
        toast({
          title: "Gratis Ongkir! 🎉",
          description: "Gratis ongkir untuk wilayah Jabodetabek",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Shipping calculation failed:', error);
      setError('Gagal menghitung ongkir. Silakan coba lagi.');

      // Fallback: check if likely Jabodetabek
      const isLikelyFree = shippingUtils.isLikelyJabodetabek(shippingAddress.city);
      const fallbackCost = isLikelyFree ? 0 : 15000;

      setShippingOptions([{
        service: 'REG',
        description: isLikelyFree ? 'Gratis Ongkir' : 'Regular Service',
        cost: fallbackCost,
        etd: '2-3 hari kerja',
        isFree: isLikelyFree
      }]);

      setSelectedShipping({
        service: 'REG',
        cost: fallbackCost
      });

      onShippingCostChange(fallbackCost, 'REG');
    } finally {
      setIsLoading(false);
    }
  }, [shippingAddress.city, cartWeight, onShippingCostChange, toast]);

  // Calculate shipping when city changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      calculateShipping();
    }, 800); // Debounce for 800ms

    return () => clearTimeout(debounceTimer);
  }, [calculateShipping]);

  /**
   * Handle shipping service selection
   */
  const handleShippingSelect = (option) => {
    setSelectedShipping(option);
    onShippingCostChange(option.cost, option.service);
  };

  /**
   * Retry shipping calculation
   */
  const retryCalculation = () => {
    calculateShipping();
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* City Input */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="city" className="text-sm font-medium">
          Kota/Kabupaten *
        </Label>
        <div className="relative">
          <Input
            id="city"
            value={shippingAddress.city || ''}
            onChange={(e) => onAddressChange('city', e.target.value)}
            placeholder="Contoh: Jakarta Pusat, Bogor, Tangerang"
            className="pr-10"
            required
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Quick suggestion for popular cities */}
        {!shippingAddress.city && (
          <div className="flex flex-wrap gap-2 mt-2">
            {['Jakarta Pusat', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Surabaya'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onAddressChange('city', city)}
                className="px-3 py-1 text-xs bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Free Shipping Badge */}
      <AnimatePresence>
        {isFreeShipping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
          >
            <Gift className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-green-800">
                🎉 Gratis Ongkir untuk wilayah Jabodetabek!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Hemat biaya pengiriman khusus untuk wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={retryCalculation}
              className="text-red-600 border-red-200 hover:bg-red-100"
            >
              Coba Lagi
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shipping Options */}
      <AnimatePresence>
        {shippingOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-accent" />
              <h4 className="font-medium text-foreground">Pilih Kurir</h4>
            </div>

            <RadioGroup
              value={selectedShipping}
              onChange={handleShippingSelect}
              className="space-y-2"
            >
              {shippingOptions.map((option, index) => {
                const deliveryEstimate = shippingUtils.getDeliveryEstimate(option.etd);

                return (
                  <RadioGroup.Option key={index} value={option}>
                    {({ checked }) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${checked
                            ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                            : "border-border hover:border-accent/50 hover:bg-accent/5"
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground">
                                {option.service}
                              </p>
                              {option.isFree && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                  GRATIS
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {option.description}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                              <span>Estimasi: {option.etd}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                Tiba: {deliveryEstimate.min.toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short'
                                })} - {deliveryEstimate.max.toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {shippingUtils.formatPrice(option.cost)}
                              </p>
                            </div>
                            {checked && (
                              <CheckCircle className="text-accent flex-shrink-0" size={20} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </RadioGroup.Option>
                );
              })}
            </RadioGroup>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && shippingOptions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Menghitung ongkir...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weight Info */}
      {cartWeight > 0 && (
        <motion.div
          variants={itemVariants}
          className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3"
        >
          <div className="flex justify-between items-center">
            <span>Berat total pesanan:</span>
            <span className="font-medium">
              {(cartWeight / 1000).toFixed(1)} kg
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

ShippingCalculator.displayName = 'ShippingCalculator';

export default ShippingCalculator;