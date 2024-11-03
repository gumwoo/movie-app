// src/components/SignIn/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './SignIn.css';
import { toast } from 'react-toastify';

function SignIn() {
  const {
    isAuthenticated,
    handleLogin,
    handleRegister,
    loading,
    error,
  } = useAuth();
  const navigate = useNavigate();

  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRegisterEmailFocused, setIsRegisterEmailFocused] = useState(false);
  const [isRegisterPasswordFocused, setIsRegisterPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const isLoginFormValid = email && password;
  const isRegisterFormValid =
    registerEmail &&
    registerPassword &&
    confirmPassword &&
    registerPassword === confirmPassword &&
    acceptTerms;

  const toggleCard = () => {
    setIsLoginVisible(!isLoginVisible);
    setTimeout(() => {
      document.getElementById('register')?.classList.toggle('register-swap');
      document.getElementById('login')?.classList.toggle('login-swap');
    }, 50);
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
      toast.success('로그인에 성공했습니다!');
      navigate('/');
    } catch (err) {
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await handleRegister(registerEmail, registerPassword);
      toast.success('회원가입에 성공했습니다! 로그인 해주세요.');
      toggleCard();
    } catch (err) {
      toast.error(err || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            {/* 로그인 폼 */}
            <div className={`card ${!isLoginVisible ? 'hidden' : ''}`} id="login">
              <form onSubmit={handleLoginSubmit}>
                <h1>Sign in</h1>
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
                  />
                  <label htmlFor="email">Username or Email</label>
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
                  <label htmlFor="password">Password</label>
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
                    Remember me
                  </label>
                </span>
                <span className="checkbox forgot">
                  <a href="#">Forgot Password?</a>
                </span>
                <button type="submit" disabled={!isLoginFormValid || loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <a href="#" className="account-check" onClick={toggleCard}>
                Don't have an account? <b>Sign up</b>
              </a>
            </div>

            {/* 회원가입 폼 */}
            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form onSubmit={handleRegisterSubmit}>
                <h1>Sign up</h1>
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
                  <label htmlFor="register-email">Email</label>
                </div>
                <div
                  className={`input ${
                    isRegisterPasswordFocused || registerPassword ? 'active' : ''
                  }`}
                >
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
                  <label htmlFor="register-password">Password</label>
                </div>
                <div
                  className={`input ${isConfirmPasswordFocused || confirmPassword ? 'active' : ''}`}
                >
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
                  <label htmlFor="confirm-password">Confirm Password</label>
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
                    I have read <b>Terms and Conditions</b>
                  </label>
                </span>
                <button type="submit" disabled={!isRegisterFormValid || loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <a href="#" className="account-check" onClick={toggleCard}>
                Already have an account? <b>Sign in</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

