// src/store/orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface OrderState {
  /** List of order IDs (most-recent first) */
  orderIds: string[];
}

const initialState: OrderState = {
  orderIds: [],
};

const orderSlice = createSlice({
  name: 'orderIds',
  initialState,
  reducers: {
    /** Add a new order ID at the front */
    addOrderId(state, action: PayloadAction<string>) {
      state.orderIds.unshift(action.payload);
    },
    /** Remove one order ID from the list */
    removeOrderId(state, action: PayloadAction<string>) {
      state.orderIds = state.orderIds.filter((id) => id !== action.payload);
    },
    /** Clear all stored order IDs */
    clearOrderIds(state) {
      state.orderIds = [];
    },
  },
});

export const { addOrderId, removeOrderId, clearOrderIds } = orderSlice.actions;

/** Selector to read the array of IDs */
export const selectOrderIds = (state: RootState) => state.ordersIds.orderIds;

export default orderSlice.reducer;
