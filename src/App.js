// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import Home from './views/Home/Home';
import HomeMain from './views/Home/HomeMain/HomeMain';
import HomeWishlist from './views/Home/HomeWishlist/HomeWishlist';
import HomePopular from './views/Home/HomePopular/HomePopular';
import HomeSearch from './views/Search/HomeSearch';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeMain />} />
          <Route path="popular" element={<HomePopular />} />
          <Route path="wishlist" element={<HomeWishlist />} />
          <Route path="search" element={<HomeSearch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

