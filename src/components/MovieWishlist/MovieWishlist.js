// src/components/MovieWishlist/MovieWishlist.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import './MovieWishlist.css';

function MovieWishlist() {
  const [visibleWishlistMovies, setVisibleWishlistMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const gridContainerRef = useRef(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    loadWishlist();
    calculateLayout();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist]);

  const loadWishlist = () => {
    // Redux를 사용하므로 `wishlist` 상태가 이미 최신 상태입니다.
    updateVisibleMovies(wishlist, 1, rowSize, moviesPerPage);
  };

  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
  };

  const calculateLayout = () => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const containerHeight = window.innerHeight - gridContainerRef.current.offsetTop;
      const movieCardWidth = isMobile ? 90 : 220;
      const movieCardHeight = isMobile ? 150 : 330;
      const horizontalGap = isMobile ? 10 : 15;
      const verticalGap = -10;

      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      const newMoviesPerPage = newRowSize * maxRows;

      setRowSize(newRowSize);
      setMoviesPerPage(newMoviesPerPage);

      updateVisibleMovies(wishlist, currentPage, newRowSize, newMoviesPerPage);
    }
  };

  const updateVisibleMovies = (
    movies = [],
    page = currentPage,
    newRowSize = rowSize,
    newMoviesPerPage = moviesPerPage
  ) => {
    const startIndex = (page - 1) * newMoviesPerPage;
    const endIndex = startIndex + newMoviesPerPage;
    const paginatedMovies = movies.slice(startIndex, endIndex);

    const groupedMovies = paginatedMovies.reduce((resultArray, item, index) => {
      const groupIndex = Math.floor(index / newRowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
    setVisibleWishlistMovies(groupedMovies);
  };

  const totalPages = Math.ceil(wishlist.length / moviesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      updateVisibleMovies(wishlist, newPage, rowSize, moviesPerPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      updateVisibleMovies(wishlist, newPage, rowSize, moviesPerPage);
    }
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    calculateLayout();
  };

  const toggleWishlistHandler = (movie) => {
    dispatch(toggleWishlist(movie));
    // Redux가 상태를 업데이트하므로, `useEffect`가 `wishlist` 상태 변경을 감지하여 자동으로 `updateVisibleMovies`가 호출됩니다.
  };

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className={`grid-container grid`}>
        {visibleWishlistMovies.map((movieGroup, i) => (
          <div key={i} className={`movie-row ${movieGroup.length === rowSize ? 'full' : ''}`}>
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlistHandler(movie)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className="movie-title">{movie.title}</div>
                {movie.id && (
                  <div className="wishlist-indicator">👍</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {wishlist.length === 0 && (
        <div className="empty-wishlist">위시리스트가 비어 있습니다.</div>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            &lt; 이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            다음 &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieWishlist;
