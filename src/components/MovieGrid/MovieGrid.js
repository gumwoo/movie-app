// src/components/MovieGrid/MovieGrid.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import useFetch from '../../hooks/useFetch';
import './MovieGrid.css';

function MovieGrid({ fetchUrl }) {
  const { data, loading, error } = useFetch(fetchUrl);
  const [visibleMovieGroups, setVisibleMovieGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage] = useState(20); // setMoviesPerPage 제거
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const gridContainerRef = useRef(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    if (data) {
      updateVisibleMovies(data.results.slice(0, 120), 1, rowSize, moviesPerPage);
    }
    calculateLayout();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getImageUrl = (path) => {
    return `https://image.tmdb.org/t/p/w300${path}`;
  };

  const updateVisibleMovies = (
    moviesToShow = [],
    page = currentPage,
    newRowSize = rowSize,
    newMoviesPerPage = moviesPerPage
  ) => {
    const startIndex = (page - 1) * newMoviesPerPage;
    const endIndex = startIndex + newMoviesPerPage;
    const paginatedMovies = moviesToShow.slice(startIndex, endIndex);

    const groupedMovies = paginatedMovies.reduce((resultArray, item, index) => {
      const groupIndex = Math.floor(index / newRowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
    setVisibleMovieGroups(groupedMovies);
  };

  const totalPages = Math.ceil(120 / moviesPerPage); // 고정된 120개 영화

  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      updateVisibleMovies(data.results.slice(0, 120), newPage, rowSize, moviesPerPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      updateVisibleMovies(data.results.slice(0, 120), newPage, rowSize, moviesPerPage);
    }
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    calculateLayout();
  };

  const calculateLayout = () => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = isMobile ? 90 : 200;
      const horizontalGap = isMobile ? 10 : 15;

      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      setRowSize(newRowSize);
      updateVisibleMovies(data.results.slice(0, 120), currentPage, newRowSize, moviesPerPage);
    }
  };

  const toggleWishlistHandler = (movie) => {
    dispatch(toggleWishlist(movie));
  };

  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  if (loading) {
    return (
      <div className="movie-grid">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-grid">
        <div className="error-message">Failed to load movies.</div>
      </div>
    );
  }

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className={`grid-container grid`}>
        {visibleMovieGroups.map((movieGroup, i) => (
          <div key={i} className={`movie-row ${movieGroup.length === rowSize ? 'full' : ''}`}>
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlistHandler(movie)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className="movie-title">{movie.title}</div>
                {isInWishlist(movie.id) && (
                  <div className="wishlist-indicator">👍</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
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

export default MovieGrid;
