import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/images/logo.png';

import './styles.css';

function NavBar() {
  return (
    <div className="navbar-container">
      <a rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/edithdafelicidade/"><img src={logo} alt="Logo" /></a>
      <Link className="link" to="/">Instagram</Link>
      <Link className="link" to="/facebook">Facebook</Link>
    </div>
  );
}

export default NavBar;