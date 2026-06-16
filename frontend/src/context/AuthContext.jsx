import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import * as authService from '../services/authService';

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  user: null,
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
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
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
  const didBootstrapRef = useRef(false);

  useEffect(() => {
    if (didBootstrapRef.current) return;
    didBootstrapRef.current = true;

    const bootstrapAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await authService.getMe();
        dispatch({ type: 'LOGIN', payload: { user: res.data.user } });
      } catch {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    bootstrapAuth();
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user } = res.data;

    dispatch({ type: 'LOGIN', payload: { user } });
    return { user };
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (userData) => {
    const res = await authService.register(userData);
    return res.data;
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // Preserve theme preference but clear any other lingering localStorage data
      try {
        const theme = localStorage.getItem('theme');
        localStorage.clear();
        if (theme) localStorage.setItem('theme', theme);
      } catch (e) {
        // localStorage may be unavailable in some environments; ignore
      }

      dispatch({ type: 'LOGOUT' });
    }
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
