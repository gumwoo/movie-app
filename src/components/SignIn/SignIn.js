// src/components/SignIn/SignIn.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';
import Terms from '../Terms/Terms';

function SignIn() {
  const { handleLogin, handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRegisterEmailFocused, setIsRegisterEmailFocused] = useState(false);
  const [isRegisterPasswordFocused, setIsRegisterPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const formWrapperRef = useRef(null);
  const [emailError, setEmailError] = useState('');

  const isLoginFormValid = email && password;
  const isRegisterFormValid =
    registerEmail &&
    registerPassword &&
    confirmPassword &&
    registerPassword === confirmPassword &&
    acceptTerms;

  const toggleCard = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const focusInput = (inputName) => {
    switch (inputName) {
      case 'email':
        setIsEmailFocused(true);
        break;
      case 'password':
        setIsPasswordFocused(true);
        break;
      case 'registerEmail':
        setIsRegisterEmailFocused(true);
        break;
      case 'registerPassword':
        setIsRegisterPasswordFocused(true);
        break;
      case 'confirmPassword':
        setIsConfirmPasswordFocused(true);
        break;
      default:
        break;
    }
  };

  const blurInput = (inputName) => {
    switch (inputName) {
      case 'email':
        setIsEmailFocused(false);
        break;
      case 'password':
        setIsPasswordFocused(false);
        break;
      case 'registerEmail':
        setIsRegisterEmailFocused(false);
        break;
      case 'registerPassword':
        setIsRegisterPasswordFocused(false);
        break;
      case 'confirmPassword':
        setIsConfirmPasswordFocused(false);
        break;
      default:
        break;
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    try {
      await handleLogin(email, password);
      toast.success('로그인에 성공했습니다!');
      navigate('/');
    } catch (err) {
      toast.error('로그인에 실패했습니다. ' + err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(registerEmail)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await handleRegister(registerEmail, registerPassword);
      toast.success('회원가입에 성공했습니다! 로그인 해주세요.');
      toggleCard();
    } catch (err) {
      toast.error('회원가입에 실패했습니다. ' + err);
    }
  };

  const handleTermsAgree = () => {
    setAcceptTerms(true);
    setIsTermsModalOpen(false);
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  return (
    <div className="sign-in-container">
      <div className="bg-image" />
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            <div className="form-container">
              <div
                className={`form-wrapper ${!isLoginVisible ? 'show-signup' : ''}`}
                ref={formWrapperRef}
              >
                {/* 로그인 폼 */}
                <div className="form" id="login">
                  <form onSubmit={handleLoginSubmit}>
                    <h1>로그인</h1>
                    <div className={`input ${isEmailFocused || email ? 'active' : ''}`}>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        name="email"
                        onFocus={() => focusInput('email')}
                        onBlur={() => blurInput('email')}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      />
                      <label htmlFor="email">이메일</label>
                      {emailError && <span className="error-message">{emailError}</span>}
                    </div>
                    <div className={`input ${isPasswordFocused || password ? 'active' : ''}`}>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        name="password"
                        onFocus={() => focusInput('password')}
                        onBlur={() => blurInput('password')}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="password">비밀번호</label>
                    </div>
                    <span className="checkbox remember">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        name="rememberMe"
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="remember" className="read-text">
                        로그인 상태 유지
                      </label>
                    </span>
                    <span className="checkbox forgot">
                      <button
                        type="button"
                        className="forgot-password-button"
                        onClick={() => {
                          toast.info('비밀번호 찾기 기능은 아직 구현되지 않았습니다.');
                        }}
                      >
                        비밀번호 찾기
                      </button>
                    </span>
                    <button type="submit" disabled={!isLoginFormValid || loading}>
                      {loading ? '로그인 중...' : '로그인'}
                    </button>
                  </form>
                  <button type="button" className="account-check" onClick={toggleCard}>
                    계정이 없으신가요? <b>회원가입</b>
                  </button>
                </div>

                {/* 회원가입 폼 */}
                <div className="form" id="register">
                  <form onSubmit={handleRegisterSubmit}>
                    <h1>회원가입</h1>
                    <div className={`input ${isRegisterEmailFocused || registerEmail ? 'active' : ''}`}>
                      <input
                        id="register-email"
                        type="email"
                        value={registerEmail}
                        name="registerEmail"
                        onFocus={() => focusInput('registerEmail')}
                        onBlur={() => blurInput('registerEmail')}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="register-email">이메일</label>
                    </div>
                    <div className={`input ${isRegisterPasswordFocused || registerPassword ? 'active' : ''}`}>
                      <input
                        id="register-password"
                        type="password"
                        value={registerPassword}
                        name="registerPassword"
                        onFocus={() => focusInput('registerPassword')}
                        onBlur={() => blurInput('registerPassword')}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="register-password">비밀번호</label>
                    </div>
                    <div className={`input ${isConfirmPasswordFocused || confirmPassword ? 'active' : ''}`}>
                      <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        name="confirmPassword"
                        onFocus={() => focusInput('confirmPassword')}
                        onBlur={() => blurInput('confirmPassword')}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="confirm-password">비밀번호 확인</label>
                    </div>
                    <span className="checkbox remember">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptTerms}
                        name="acceptTerms"
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                      />
                      <label htmlFor="terms" className="read-text">
                        <span>이용약관에 동의합니다</span>
                        <button
                          type="button"
                          className="terms-view-button"
                          onClick={openTermsModal}
                        >
                          약관 보기
                        </button>
                      </label>
                    </span>
                    <button type="submit" disabled={!isRegisterFormValid || loading}>
                      {loading ? '가입 중...' : '회원가입'}
                    </button>
                  </form>
                  <button type="button" className="account-check" onClick={toggleCard}>
                    이미 계정이 있으신가요? <b>로그인</b>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Terms 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAgree={handleTermsAgree}
      />
      <ToastContainer />
    </div>
  );
}

export default SignIn;
