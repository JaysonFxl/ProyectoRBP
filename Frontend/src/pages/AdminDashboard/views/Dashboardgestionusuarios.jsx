import React, { useState } from 'react';
import Dashboardlayout from '../components/Dashboardlayout';
import AddUserForm from '../forms/EditUserForm';
import ManageUsersComponent from '../forms/ManageUsersComponent';
import '../styles/Dashboardgestionusuario.css'

// Componente para gestionar los usuarios del sistema (solo para el rol de administrador).
const GestionUsuarios = () => {
    const [currentView, setCurrentView] = useState('addUser'); //Controla la vista actual

    const handleUserAdded = (newUser) => {
        setUsers(prevUsers => [...prevUsers, newUser]); //Agrega el nuevo usuario a la lista de usuarios.
    };

    return (
        <Dashboardlayout>
            <div className="button-container">
                <button className="btn btn-add" onClick={() => setCurrentView('addUser')}>Editar Usuarios</button>
                <button className="btn btn-manage" onClick={() => setCurrentView('manageUsers')}>Gestionar Usuarios</button>
            </div>
            {currentView === 'addUser' && <AddUserForm onUserAdded={handleUserAdded} />} 
            {currentView === 'manageUsers' && <ManageUsersComponent />} 
        </Dashboardlayout>
    );
};

export default GestionUsuarios;
