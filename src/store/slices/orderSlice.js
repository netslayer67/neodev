// src/store/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

// Async thunk for creating order with enhanced error handling
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/orders', orderData)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to create order'
      
      // Log error for debugging
      console.error('Order creation error:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      })
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching user orders with pagination
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async ({ page = 1, limit = 10, status = '' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (status) {
        params.append('status', status)
      }
      
      const response = await axiosInstance.get(`/orders/my?${params}`)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch orders'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching single order
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch order'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for cancelling order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}/cancel`)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to cancel order'
      return rejectWithValue(errorMessage)
    }
  }
)

const initialState = {
  myOrders: [],
  selectedOrder: null,
  midtransSnapToken: null,
  redirectUrl: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    status: '',
    dateRange: null
  }
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.status = 'idle'
      state.error = null
      state.selectedOrder = null
      state.midtransSnapToken = null
      state.redirectUrl = null
    },
    clearOrders: (state) => {
      state.myOrders = []
      state.pagination = initialState.pagination
    },
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status, paymentStatus } = action.payload
      const order = state.myOrders.find(o => o.orderId === orderId)
      if (order) {
        order.status = status
        if (paymentStatus) {
          order.paymentStatus = paymentStatus
        }
      }
      
      if (state.selectedOrder && state.selectedOrder.orderId === orderId) {
        state.selectedOrder.status = status
        if (paymentStatus) {
          state.selectedOrder.paymentStatus = paymentStatus
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.midtransSnapToken = null
        state.redirectUrl = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        
        // Handle different response structures
        const responseData = action.payload.data || action.payload
        const { order, payment, midtransSnapToken, redirectUrl } = responseData
        
        // Update orders list
        if (order) {
          state.myOrders.unshift(order)
          state.selectedOrder = order
        }
        
        // Handle payment data
        if (payment) {
          state.midtransSnapToken = payment.snapToken
          state.redirectUrl = payment.redirectUrl
        } else {
          state.midtransSnapToken = midtransSnapToken
          state.redirectUrl = redirectUrl
        }
        
        state.error = null
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.selectedOrder = null
        state.midtransSnapToken = null
        state.redirectUrl = null
      })
      
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        
        const responseData = action.payload.data || action.payload
        
        if (Array.isArray(responseData)) {
          // Simple array response
          state.myOrders = responseData
        } else {
          // Paginated response
          state.myOrders = responseData.orders || responseData
          if (responseData.pagination) {
            state.pagination = responseData.pagination
          }
        }
        
        state.error = null
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.myOrders = []
      })
      
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.selectedOrder = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selectedOrder = action.payload.data || action.payload
        state.error = null
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.selectedOrder = null
      })
      
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const cancelledOrder = action.payload.data || action.payload
        
        // Update order in orders list
        const orderIndex = state.myOrders.findIndex(o => o.orderId === cancelledOrder.orderId)
        if (orderIndex !== -1) {
          state.myOrders[orderIndex] = cancelledOrder
        }
        
        // Update selected order if it's the same
        if (state.selectedOrder && state.selectedOrder.orderId === cancelledOrder.orderId) {
          state.selectedOrder = cancelledOrder
        }
        
        state.error = null
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { 
  clearOrderState, 
  clearOrders, 
  setOrderFilters, 
  updateOrderStatus 
} = orderSlice.actions

// Selectors
export const selectMyOrders = (state) => state.orders.myOrders
export const selectSelectedOrder = (state) => state.orders.selectedOrder
export const selectOrderStatus = (state) => state.orders.status
export const selectOrderError = (state) => state.orders.error
export const selectOrderPagination = (state) => state.orders.pagination
export const selectOrderFilters = (state) => state.orders.filters
export const selectMidtransSnapToken = (state) => state.orders.midtransSnapToken
export const selectRedirectUrl = (state) => state.orders.redirectUrl

// Computed selectors
export const selectOrdersByStatus = (status) => (state) => 
  state.orders.myOrders.filter(order => order.status === status)

export const selectPendingOrders = (state) => 
  state.orders.myOrders.filter(order => 
    ['Pending Payment', 'Payment Confirmed', 'Processing'].includes(order.status)
  )

export const selectCompletedOrders = (state) => 
  state.orders.myOrders.filter(order => order.status === 'Delivered')

export default orderSlice.reducer