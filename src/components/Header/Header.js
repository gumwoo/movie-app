// src/components/Header/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes, faHome, faFire, faSearch, faHeart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import netflixLogo from './netflix-logo.png'; // 로고 이미지 임포트
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isMobileMenuOpen) {
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        if (
          mobileNav &&
          !mobileNav.contains(event.target) &&
          mobileMenuButton &&
          !mobileMenuButton.contains(event.target)
        ) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

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
              <img src={netflixLogo} alt="Netflix Logo" style={{ height: '50px' }} />
            </Link>
          </div>
          <nav className="nav-links desktop-nav">
            <ul>
              <li><Link to="/"><FontAwesomeIcon icon={faHome} /> 홈</Link></li>
              <li><Link to="/popular"><FontAwesomeIcon icon={faFire} /> 대세 콘텐츠</Link></li>
              <li><Link to="/wishlist"><FontAwesomeIcon icon={faHeart} /> 내가 찜한 리스트</Link></li>
              <li><Link to="/search"><FontAwesomeIcon icon={faSearch} /> 찾아보기</Link></li>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          {user && <span className="user-info">{user.email}</span>}
          <Link to="/search" className="search-link">
            <FontAwesomeIcon icon={faSearch} />
          </Link>
          <button 
            className="icon-button logout-button" 
            onClick={removeKey} 
            aria-label="로그아웃"
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> 로그아웃
          </button>
          <button
            className={`mobile-menu-button ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기/닫기"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </header>

      {/* 모바일 네비게이션 */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
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
