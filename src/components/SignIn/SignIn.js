// src/components/SignIn/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './SignIn.css';

function SignIn() {
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

  const navigate = useNavigate();
  const authService = new AuthService();

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

  const handleLogin = (e) => {
    e.preventDefault();
    authService.tryLogin(email, password).then(
      () => {
        navigate('/');
      },
      (error) => {
        alert('Login failed');
      }
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    authService.tryRegister(registerEmail, registerPassword).then(
      () => {
        toggleCard();
      },
      (err) => {
        alert(err.message);
      }
    );
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            {/* 로그인 폼 */}
            <div className={`card ${!isLoginVisible ? 'hidden' : ''}`} id="login">
              <form onSubmit={handleLogin}>
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
                <button disabled={!isLoginFormValid}>Login</button>
              </form>
              <a href="#" className="account-check" onClick={toggleCard}>
                Don't have an account? <b>Sign up</b>
              </a>
            </div>

            {/* 회원가입 폼 */}
            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form onSubmit={handleRegister}>
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
                  />
                  <label htmlFor="terms" className="read-text">
                    I have read <b>Terms and Conditions</b>
                  </label>
                </span>
                <button disabled={!isRegisterFormValid}>Register</button>
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
