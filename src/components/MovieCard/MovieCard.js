// src/components/MovieCard/MovieCard.js
import React from 'react';
import URLService from '../../services/URLService';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './MovieCard.css';

function MovieCard({ movie, onToggleWishlist, isInWishlist }) {
  const urlService = new URLService();
  const posterUrl = urlService.getPosterUrl(movie.poster_path);

  return (
    <div className="movie-card" onClick={() => onToggleWishlist(movie)}>
      <LazyLoadImage
        src={posterUrl}
        alt={movie.title}
        effect="blur"
        className="movie-poster"
        placeholderSrc="/placeholder-image.jpg"
      />
      <div className="movie-title">{movie.title}</div>
      {isInWishlist && <div className="wishlist-indicator">👍</div>}
    </div>
  );
}

export default MovieCard;
