// src/components/SearchBar/SearchBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="영화를 검색하세요..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">검색</button>
    </form>
  );
}

export default SearchBar;
