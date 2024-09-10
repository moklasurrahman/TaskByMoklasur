import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    setIsLoggedIn(false);
    navigate('/');
  };

  
  return (
    <nav className='bg-blue-400 flex items-center gap-10 p-10'>
      {isLoggedIn ? (
        <>
          <button
            onClick={handleLogout}
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700'
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/" className='text-white hover:underline'>Login</Link>
      )}

      <Link to="/products" className='text-white hover:underline'>Products</Link>
    </nav>
  );
};

export default Navbar;
