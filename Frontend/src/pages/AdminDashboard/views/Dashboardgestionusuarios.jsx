import React, { useState } from 'react';
import Dashboardlayout from '../components/Dashboardlayout';
import AddUserForm from '../forms/AddUserForm';
import ManageUsersComponent from '../forms/ManageUsersComponent';
import '../styles/Dashboardgestionusuario.css'

const GestionUsuarios = () => {
    const [currentView, setCurrentView] = useState('addUser'); // Controla la vista actual

    const handleUserAdded = (newUser) => {
        setUsers(prevUsers => [...prevUsers, newUser]);
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
