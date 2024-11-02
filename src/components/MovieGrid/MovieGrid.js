// src/components/MovieGrid/MovieGrid.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import WishlistService from '../../services/WishlistService';
import './MovieGrid.css';

function MovieGrid({ fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [visibleMovieGroups, setVisibleMovieGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const gridContainerRef = useRef(null);

  const wishlistService = new WishlistService();

  useEffect(() => {
    fetchMovies();
    calculateLayout();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchMovies = async () => {
    try {
      const totalMoviesNeeded = 120;
      const numberOfPages = Math.ceil(totalMoviesNeeded / 20);
      let allMovies = [];

      for (let page = 1; page <= numberOfPages; page++) {
        const response = await axios.get(fetchUrl, {
          params: {
            page,
          },
        });
        allMovies = [...allMovies, ...response.data.results];
      }

      setMovies(allMovies.slice(0, totalMoviesNeeded));
      updateVisibleMovies(allMovies.slice(0, totalMoviesNeeded));
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const getImageUrl = (path) => {
    return `https://image.tmdb.org/t/p/w300${path}`;
  };

  const updateVisibleMovies = (
    moviesToShow = movies,
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

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      updateVisibleMovies(movies, newPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      updateVisibleMovies(movies, newPage);
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
      updateVisibleMovies(movies, currentPage, newRowSize);
    }
  };

  const toggleWishlist = (movie) => {
    wishlistService.toggleWishlist(movie);
    // 업데이트를 위해 상태를 변경하지 않지만, 필요하다면 추가로 구현
  };

  const isInWishlist = (movieId) => {
    return wishlistService.isInWishlist(movieId);
  };

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className={`grid-container grid`}>
        {visibleMovieGroups.map((movieGroup, i) => (
          <div key={i} className={`movie-row ${movieGroup.length === rowSize ? 'full' : ''}`}>
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlist(movie)}
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
