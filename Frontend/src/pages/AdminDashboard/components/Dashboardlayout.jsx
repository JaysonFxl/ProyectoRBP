import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import logoFut from '../../../assets/logofut.png';
import '../styles/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div className="logo">
                    {/* Aquí puedes insertar tu logo */}
                    <img src={logoFut} alt="Logo" />
                </div>
                <h1>Dashboard Futbolito</h1>
            </header>
            <aside className="dashboard-sidebar">
                <nav>
                    <ul>
                        <li>
                            <Link to="/admin">
                                <FaHome /> <span>Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/reservas">
                                <FaCalendarAlt /> <span>Gestión de Reservas</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/usuarios">
                                <FaUsers /> <span>Gestión de Usuarios</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <FaHome /> <span>Inicio Pagina Web</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;


