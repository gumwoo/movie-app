// src/components/MovieSearch/MovieSearch.js
import React, { useState } from 'react';
import './MovieSearch.css';

function MovieSearch({ changeOptions }) {
  const dropdowns = {
    originalLanguage: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family'],
    translationLanguage: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    sorting: ['언어 (전체)', '영어', '한국어'],
  };

  const DEFAULT_OPTIONS = {
    originalLanguage: '장르 (전체)',
    translationLanguage: '평점 (전체)',
    sorting: '언어 (전체)',
  };

  const [selectedOptions, setSelectedOptions] = useState({ ...DEFAULT_OPTIONS });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownEntries = Object.entries(dropdowns).map(([key, options]) => ({
    key,
    options,
  }));

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const selectOption = (key, option) => {
    const newOptions = {
      ...selectedOptions,
      [key]: option,
    };
    setSelectedOptions(newOptions);
    setActiveDropdown(null);
    changeOptions(newOptions);
  };

  const clearOptions = () => {
    setSelectedOptions({ ...DEFAULT_OPTIONS });
    changeOptions(DEFAULT_OPTIONS);
  };

  return (
    <div className="dropdown-container">
      <label>선호하는 설정을 선택하세요</label>
      {dropdownEntries.map((dropdown) => (
        <div key={dropdown.key} className="custom-select">
          <div className="select-selected" onClick={() => toggleDropdown(dropdown.key)}>
            {selectedOptions[dropdown.key]}
          </div>
          {activeDropdown === dropdown.key && (
            <div className="select-items">
              {dropdown.options.map((option) => (
                <div key={option} onClick={() => selectOption(dropdown.key, option)}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button className="clear-options" onClick={clearOptions}>
        초기화
      </button>
    </div>
  );
}

export default MovieSearch;
