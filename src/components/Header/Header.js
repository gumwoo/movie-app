// src/components/Header/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const removeKey = () => {
    localStorage.removeItem('TMDb-Key');
    navigate('/signin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  return (
    <div id="container">
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <FontAwesomeIcon icon={faTicketAlt} style={{ height: '100%', color: '#E50914' }} />
            </Link>
          </div>
          <nav className="nav-links desktop-nav">
            <ul>
              <li>
                <Link to="/">홈</Link>
              </li>
              <li>
                <Link to="/popular">대세 콘텐츠</Link>
              </li>
              <li>
                <Link to="/wishlist">내가 찜한 리스트</Link>
              </li>
              <li>
                <Link to="/search">찾아보기</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          {/* '검색' 링크 추가 */}
          <Link to="/search" className="search-link">
            검색
          </Link>
          <button className="icon-button" onClick={removeKey}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className="icon-button mobile-menu-button" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      {/* 모바일 네비게이션 */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={toggleMobileMenu}>
                홈
              </Link>
            </li>
            <li>
              <Link to="/popular" onClick={toggleMobileMenu}>
                대세 콘텐츠
              </Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={toggleMobileMenu}>
                내가 찜한 리스트
              </Link>
            </li>
            <li>
              <Link to="/search" onClick={toggleMobileMenu}>
                찾아보기
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
