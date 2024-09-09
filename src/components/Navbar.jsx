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
    <nav className=' bg-blue-400 flex gap-10 p-10'>
      {isLoggedIn ? (
        <>
          <Link to="/products">Products</Link>
          
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
