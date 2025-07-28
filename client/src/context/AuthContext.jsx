import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) return setLoading(false);

      try {
        const { data } = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        handleLogout(); // Token invalid
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token: authToken, user: authUser } = res.data;

      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(authUser);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to login.';
      throw new Error(message);
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
      await handleLogin(email, password); // Auto-login after registration
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed.';
      throw new Error(message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
