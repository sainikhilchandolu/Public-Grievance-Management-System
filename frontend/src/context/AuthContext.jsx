import { createContext, useContext, useReducer, useEffect } from 'react';
import * as authService from '../services/authService';

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: true,
};

// ─── Reducer ────────────────────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'AUTH_ERROR':
      return { ...state, loading: false, isAuthenticated: false };
    default:
      return state;
  }
};

// ─── Context ────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// ─── Provider ───────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, validate stored token by fetching current user
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const res = await authService.getMe();
          dispatch({
            type: 'LOGIN',
            payload: { user: res.data.user, token },
          });
        } catch {
          // Token is invalid or expired — clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    validateToken();
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token, user } = res.data;

    // Persist to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'LOGIN', payload: { user, token } });
    return { user, token };
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (userData) => {
    const res = await authService.register(userData);
    return res.data;
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
