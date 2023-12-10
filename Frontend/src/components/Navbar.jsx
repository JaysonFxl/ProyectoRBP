import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './CustomNavbar.css';  // Importa el archivo CSS
import { ThemeContext } from '../theme/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Importa la imagen del logo
import logo from '../assets/logofut.png';

function CustomNavbar() {
    const { currentUser, logout } = useAuth();
    const { mode, toggleTheme } = useContext(ThemeContext); 

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
            <Navbar.Brand href="#">
                <img src={logo} alt="Futbolito Logo" className="navbar-logo" />  {/* Agrega el logo */}
                El Futbolito
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Inicio</Nav.Link>
                    <Nav.Link href="#">Sobre nosotros</Nav.Link>
                    <Link to="/reservas" className="nav-link">Reservas</Link>
                    <Nav.Link href="#">Contacto</Nav.Link>
                    
                    {currentUser ? (
                        <NavDropdown title={currentUser} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">Configuración</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#" onClick={logout}>Cerrar sesión</NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                        <Link to="/login" className='nav-link'>Inicio sesión</Link>
                    )}
                </Nav>
                <IconButton onClick={toggleTheme}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default CustomNavbar;

