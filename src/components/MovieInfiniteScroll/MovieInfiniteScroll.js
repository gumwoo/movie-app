// src/components/MovieInfiniteScroll/MovieInfiniteScroll.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import WishlistService from '../../services/WishlistService';
import './MovieInfiniteScroll.css';

function MovieInfiniteScroll({ apiKey, genreCode, sortingOrder, voteEverage }) {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentView] = useState('grid');
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  const gridContainerRef = useRef(null);
  const loadingTriggerRef = useRef(null);

  const wishlistService = new WishlistService();

  useEffect(() => {
    setupIntersectionObserver();
    fetchMovies();
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (observer.current) {
        observer.current.disconnect();
      }
      if (wishlistTimer.current) {
        clearTimeout(wishlistTimer.current);
      }
    };
  }, []);

  const observer = useRef(null);

  const setupIntersectionObserver = () => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          fetchMovies();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (loadingTriggerRef.current) {
      observer.current.observe(loadingTriggerRef.current);
    }
  };

  const fetchMovies = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const url =
        genreCode === '0'
          ? 'https://api.themoviedb.org/3/movie/popular'
          : 'https://api.themoviedb.org/3/discover/movie';

      const params = {
        api_key: apiKey,
        language: 'ko-KR',
        page: currentPage,
      };

      if (genreCode !== '0') {
        params.with_genres = genreCode;
      }

      const response = await axios.get(url, { params });
      let newMovies = response.data.results;

      if (newMovies.length > 0) {
        if (sortingOrder !== 'all') {
          newMovies = newMovies.filter(
            (movie) => movie.original_language === sortingOrder
          );
        }

        newMovies = newMovies.filter((movie) => {
          if (voteEverage === -1) return true;
          if (voteEverage === -2) return movie.vote_average <= 4;
          return (
            movie.vote_average >= voteEverage &&
            movie.vote_average < voteEverage + 1
          );
        });

        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = isMobile ? 100 : 300;
      const horizontalGap = isMobile ? 10 : 15;
      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      setRowSize(newRowSize);
    }
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowTopButton(scrollTop > 300);
  };

  const scrollToTopAndReset = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    resetMovies();
  };

  const resetMovies = () => {
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchMovies();
  };

  const wishlistTimer = useRef(null);

  const toggleWishlist = (movie) => {
    if (wishlistTimer.current) {
      clearTimeout(wishlistTimer.current);
    }
    wishlistTimer.current = setTimeout(() => {
      wishlistService.toggleWishlist(movie);
    }, 800);
  };

  const isInWishlist = (movieId) => {
    return wishlistService.isInWishlist(movieId);
  };

  const visibleMovieGroups = movies.reduce((resultArray, item, index) => {
    const groupIndex = Math.floor(index / rowSize);
    if (!resultArray[groupIndex]) {
      resultArray[groupIndex] = [];
    }
    resultArray[groupIndex].push(item);
    return resultArray;
  }, []);

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className={`grid-container ${currentView}`}>
        {visibleMovieGroups.map((movieGroup, i) => (
          <div
            key={i}
            className={`movie-row ${movieGroup.length === rowSize ? 'full' : ''}`}
          >
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onMouseUp={() => toggleWishlist(movie)}
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
      <div ref={loadingTriggerRef} className="loading-trigger">
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
      {showTopButton && (
        <button onClick={scrollToTopAndReset} className="top-button">
          Top
        </button>
      )}
    </div>
  );
}

export default MovieInfiniteScroll;
