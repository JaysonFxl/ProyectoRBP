import React from 'react';
import { Link } from 'react-router-dom';
import Dashboardlayout from './components/Dashboardlayout';

// Componente para el dashboard del administrador. Este componente se renderiza cuando se accede a la ruta /admin.
const Admindashboard = () => {
    return (
        <Dashboardlayout>
            <h1>Dashboard del Administrador</h1>
            <nav>
                <ul>
                    <li><Link to="/admin/reservas">Gestión de Reservas</Link></li> 
                    <li><Link to="/admin/usuarios">Gestión de Usuarios</Link></li>
                </ul>
            </nav>
        </Dashboardlayout>
    );
};

export default Admindashboard;