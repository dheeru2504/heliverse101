// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from "./features/users/usersSlice"
// Import other slices

export const store = configureStore({
    reducer: {
        users: usersReducer,
        // Add other reducers
    },
});
