// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './slices/wishlistSlice';
// 필요에 따라 다른 슬라이스도 추가하세요.

// 스토어 설정
const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    // 다른 슬라이스들을 여기에 추가
  },
});

export default store;
