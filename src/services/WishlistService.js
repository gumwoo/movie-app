// src/services/WishlistService.js
class WishlistService {
    constructor() {
      this.loadWishlist();
    }
  
    wishlist = [];
  
    loadWishlist() {
      const storedWishlist = localStorage.getItem('movieWishlist');
      if (storedWishlist) {
        this.wishlist = JSON.parse(storedWishlist);
      } else {
        this.wishlist = [];
      }
    }
  
    saveWishlist() {
      localStorage.setItem('movieWishlist', JSON.stringify(this.wishlist));
    }
  
    toggleWishlist(movie) {
      const index = this.wishlist.findIndex((item) => item.id === movie.id);
  
      if (index === -1) {
        // 영화가 위시리스트에 없으면 추가
        this.wishlist.push(movie);
      } else {
        // 영화가 이미 위시리스트에 있으면 제거
        this.wishlist = this.wishlist.filter((item) => item.id !== movie.id);
      }
  
      this.saveWishlist();
    }
  
    isInWishlist(movieId) {
      return this.wishlist.some((item) => item.id === movieId);
    }
  
    getCurrentWishlist() {
      return this.wishlist;
    }
  }
  
  export default WishlistService;
  