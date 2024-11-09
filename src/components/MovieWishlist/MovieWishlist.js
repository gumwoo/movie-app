// src/components/MovieWishlist/MovieWishlist.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import './MovieWishlist.css';

function MovieWishlist() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20; // 페이지당 표시할 영화 수

  const totalPages = Math.ceil(wishlist.length / moviesPerPage);

  const handleToggleWishlist = (movie) => {
    dispatch(toggleWishlist(movie));
  };

  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = wishlist.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    // 찜 목록이 변경될 때 현재 페이지가 전체 페이지를 초과하면 첫 페이지로 리셋
    if (currentPage > totalPages) setCurrentPage(1);
  }, [wishlist, totalPages, currentPage]);

  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
  };

  return (
    <div className="wishlist-container">
      <h2>내가 찜한 리스트</h2>
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">위시리스트가 비어 있습니다.</div>
      ) : (
        <>
          <div className="grid-container">
            {currentMovies.map((movie) => (
              <div key={movie.id} className="wishlist-movie-card">
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className="movie-title">{movie.title}</div>
                <button
                  className="wishlist-button"
                  onClick={() => handleToggleWishlist(movie)}
                >
                  {isInWishlist(movie.id) ? '찜 취소' : '찜하기'}
                </button>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MovieWishlist;
