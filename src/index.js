// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // 'react-dom/client'에서 import
import App from './App';
import './styles/global.css'; // 전역 스타일

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // createRoot 사용

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
