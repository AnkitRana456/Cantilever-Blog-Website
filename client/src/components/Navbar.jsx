import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const router = useNavigate();

  const signOutUser = () => {
    logout();
    router('/login');
  };

  return (
    <header className="bg-white drop-shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo / Title */}
        <Link
          to="/"
          className="text-[28px] font-black tracking-tight text-indigo-700 hover:text-indigo-800 transition-colors"
        >
          BlogCraft
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5 text-[15px]">
          <Link
            to="/"
            className="text-gray-600 hover:text-indigo-600 duration-150 font-medium"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-indigo-600 duration-150 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/create-post"
                className="text-gray-600 hover:text-indigo-600 duration-150 font-medium"
              >
                New Post
              </Link>

              <button
                onClick={signOutUser}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition"
              >
                Sign Out
              </button>

              <div className="text-sm font-semibold text-gray-700">
                Welcome, <span className="text-indigo-600">{user.username}</span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 duration-150 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-indigo-600 duration-150 font-medium"
              >
                Join Now
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
