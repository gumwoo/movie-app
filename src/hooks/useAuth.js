// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout } from '../store/slices/authSlice';

function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (email, password) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await dispatch(registerUser({ email, password })).unwrap();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}

export default useAuth;

