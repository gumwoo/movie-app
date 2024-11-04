// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice'; // authSlice 임포트

// 스토어 설정
const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    auth: authReducer, // auth 리듀서 추가
    // 다른 슬라이스들도 여기에 추가
  },
});

export default store;

