// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SignIn from './components/SignIn/SignIn';
import Home from './views/Home/Home';
import HomeMain from './views/Home/HomeMain/HomeMain';
import HomeWishlist from './views/Home/HomeWishlist/HomeWishlist';
import HomePopular from './views/Home/HomePopular/HomePopular';
import HomeSearch from './views/Search/HomeSearch';
import SearchResults from './views/SearchResults/SearchResults';
import MovieDetails from './views/MovieDetails/MovieDetails';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/signin" element={<SignIn />} />

          {/* 보호된 라우트 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            {/* 홈 메인 페이지 */}
            <Route index element={<HomeMain />} />

            {/* 인기 콘텐츠 페이지 */}
            <Route path="popular" element={<HomePopular />} />

            {/* 찜한 리스트 페이지 */}
            <Route path="wishlist" element={<HomeWishlist />} />

            {/* 검색 페이지 */}
            <Route path="search" element={<HomeSearch />} />

            {/* 영화 상세 정보 페이지 */}
            <Route path="movie/:movieId" element={<MovieDetails />} />
          </Route>

          {/* 검색 결과 페이지 */}
          <Route
            path="/search/results"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
