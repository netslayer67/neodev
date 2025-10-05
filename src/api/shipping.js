// src/api/shipping.js
import axios from './axios'; // Use existing axios instance

/**
 * Shipping API client for frontend
 */
export const shippingAPI = {
  /**
   * Calculate shipping cost based on destination and weight
   * @param {Object} params - Shipping parameters
   * @param {string} params.destinationCity - Destination city name
   * @param {number} params.weight - Total weight in grams
   * @param {string} params.originCity - Origin city (optional)
   * @returns {Promise} Shipping cost data
   */
  getShippingCost: (params) => {
    return axios.get('/shipping/cost', { params });
  },

  /**
   * Get list of provinces in Indonesia
   * @returns {Promise} List of provinces
   */
  getProvinces: () => {
    return axios.get('/shipping/provinces');
  },

  /**
   * Get cities by province ID
   * @param {string} provinceId - Province ID
   * @returns {Promise} List of cities in the province
   */
  getCities: (provinceId) => {
    return axios.get(`/shipping/cities/${provinceId}`);
  },

  /**
   * Validate shipping address
   * @param {Object} address - Address object to validate
   * @returns {Promise} Validation result
   */
  validateAddress: (address) => {
    return axios.post('/shipping/validate-address', { address });
  },

  /**
   * Check if city qualifies for free shipping
   * @param {string} city - City name to check
   * @returns {Promise} Free shipping eligibility
   */
  checkFreeShipping: (city) => {
    return axios.get('/shipping/check-free-shipping', {
      params: { city }
    });
  }
};

/**
 * Utility functions for shipping
 */
export const shippingUtils = {
  /**
   * Format shipping cost to Indonesian Rupiah
   * @param {number} cost - Cost in number
   * @returns {string} Formatted price
   */
  formatPrice: (cost) => {
    if (cost === 0) return 'GRATIS';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(cost);
  },

  /**
   * Calculate estimated delivery date
   * @param {string} etd - Estimated time delivery (e.g., '2-3 hari')
   * @returns {Object} Min and max delivery dates
   */
  getDeliveryEstimate: (etd) => {
    const today = new Date();
    const etdNumbers = etd.match(/\d+/g);
    
    if (!etdNumbers || etdNumbers.length === 0) {
      return {
        min: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        max: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
      };
    }
    
    const minDays = parseInt(etdNumbers[0]);
    const maxDays = etdNumbers.length > 1 ? parseInt(etdNumbers[1]) : minDays;
    
    return {
      min: new Date(today.getTime() + minDays * 24 * 60 * 60 * 1000),
      max: new Date(today.getTime() + maxDays * 24 * 60 * 60 * 1000)
    };
  },

  /**
   * Check if city is likely in Jabodetabek area
   * @param {string} cityName - City name to check
   * @returns {boolean} True if likely in Jabodetabek
   */
  isLikelyJabodetabek: (cityName) => {
    if (!cityName) return false;
    
    const jabodetabekKeywords = [
      'jakarta', 'bogor', 'depok', 'tangerang', 'bekasi',
      'dki jakarta', 'tangsel', 'tangerang selatan'
    ];
    
    const normalizedCity = cityName.toLowerCase();
    return jabodetabekKeywords.some(keyword => 
      normalizedCity.includes(keyword) || keyword.includes(normalizedCity)
    );
  },

  /**
   * Validate Indonesian postal code
   * @param {string} postalCode - Postal code to validate
   * @returns {boolean} True if valid
   */
  isValidPostalCode: (postalCode) => {
    return /^\d{5}$/.test(postalCode);
  },

  /**
   * Validate Indonesian phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid
   */
  isValidPhoneNumber: (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    return /^(\+62|62|0)[0-9]{9,13}$/.test(cleanPhone);
  }
};