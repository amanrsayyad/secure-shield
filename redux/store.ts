import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import adminReducer from "./features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    // Add other reducers here as needed
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
