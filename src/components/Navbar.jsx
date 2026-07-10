import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Navbar.css';

function Navbar({ isAuthenticated, userName, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="BEROT TECNOLOGY" className="navbar-logo" />
          <span>BEROT TECNOLOGY</span>
        </NavLink>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <ul className={`navbar-links${menuOpen ? ' navbar-links--open' : ''}`}>
          <li>
            <NavLink to="/" className="navbar-link" onClick={closeMenu}>
              Inicio
            </NavLink>
          </li>

          {!isAuthenticated && (
            <>
              <li>
                <NavLink to="/login" className="navbar-link" onClick={closeMenu}>
                  Iniciar Sesión
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className="navbar-link" onClick={closeMenu}>
                  Registrarse
                </NavLink>
              </li>
            </>
          )}

          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/dashboard" className="navbar-link" onClick={closeMenu}>
                  Órdenes
                </NavLink>
              </li>
              <li>
                <NavLink to="/nueva-orden" className="navbar-link" onClick={closeMenu}>
                  Nueva Orden
                </NavLink>
              </li>
              <li>
                <NavLink to="/clientes" className="navbar-link" onClick={closeMenu}>
                  Clientes
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink to="/about" className="navbar-link" onClick={closeMenu}>
              Acerca de
            </NavLink>
          </li>

          {isAuthenticated && (
            <>
              <li className="navbar-user">
                <span className="navbar-user-name">Hola, {userName}</span>
              </li>
              <li>
                <button className="navbar-link navbar-logout" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
