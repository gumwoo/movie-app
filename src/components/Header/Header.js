// src/components/Header/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from '../ThemeToggle/ThemeToggle'; // ThemeToggle 컴포넌트 임포트
import netflixLogo from './netflix-logo.png'; // 로고 이미지 임포트
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          {/* 테마 토글 버튼 추가 */}
          <ThemeToggle />
          {/* '검색' 링크 추가 */}
          <Link to="/search" className="search-link">
            검색
          </Link>
          <button className="icon-button" onClick={removeKey} aria-label="사용자 프로필">
            <FontAwesomeIcon icon={faUser} />
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
