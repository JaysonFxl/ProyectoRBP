import React, { useState, useEffect } from 'react';
import '../styles/AddUser.css';

const EditUserForm = ({ onUserUpdated, userDataToEdit }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [users, setUsers] = useState([]); // Agregado
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        isSuperuser: false,
        isStaff: false,
        isActive: true,
        dateJoined: '',
        isAdmin: false,
        rut: '',
        phone: '',
        alternatePhone: '',
        city: '',
        state: '',
    });

    useEffect(() => {
        // Carga los datos del usuario a editar
        if (userDataToEdit) {
            setUserData(userDataToEdit);
        }
    }, [userDataToEdit]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/clientes/');
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    // Manejar errores
                }
            } catch (error) {
                // Manejar errores
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({ 
            ...userData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:8000/clientes/${userDataToEdit.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`, // Si usas tokens de autenticación
                },
                body: JSON.stringify(userData),
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                onUserUpdated(updatedUser); // Función para manejar el usuario actualizado
                // Mostrar mensaje de éxito
            } else {
                // Mostrar mensaje de error
                console.error('Error en la respuesta del servidor:', response);
            }
        } catch (error) {
            console.error('Hubo un error al actualizar el usuario:', error);
            // Mostrar mensaje de error
        }
    };

    const handleUserSelect = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);
    
        // Encuentra los datos del usuario seleccionado y actualiza el estado
        const selectedUser = users.find(user => user.id.toString() === userId);
        if (selectedUser) {
            setUserData(selectedUser);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="edit-user-form">
            <div className="form-group">
                <label>Seleccionar Usuario:</label>
                <select onChange={handleUserSelect} value={selectedUserId} className="form-control">
                    <option value="">Seleccione un usuario</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
            <input
                type="text"
                name="firstName" // Cambiado de first_Name a firstName
                value={userData.firstName}
                onChange={handleChange}
                placeholder="Nombre"
                className='form-control'
            />
            <input
                type="text"
                name="lastName" // Cambiado de last_Name a lastName
                value={userData.lastName}
                onChange={handleChange}
                placeholder="Apellido"
                className="form-control"
            />
            </div>
            <div className="form-group">
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="form-control"
                />
            </div>
            <div className="form-group checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        name="isSuperuser"
                        checked={userData.isSuperuser}
                        onChange={handleChange}
                    />
                    Superusuario
                </label>
            </div>
            <div className="form-group checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        name="isStaff"
                        checked={userData.isStaff}
                        onChange={handleChange}
                    />
                    Personal
                </label>
            </div>
            <div className="form-group checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={userData.isActive}
                        onChange={handleChange}
                    />
                    Activo
                </label>
            </div>
            <div className="form-group checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        name="isAdmin"
                        checked={userData.isAdmin}
                        onChange={handleChange}
                    />
                    Es Admin
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="state">Estado de la Cuenta</label>
                <select 
                    name="state" 
                    value={userData.state} 
                    onChange={handleChange} 
                    className="form-control"
                >
                    <option value="">Selecciona un Estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Suspendido">Suspendido</option>
                </select>
            </div>
            <div className="form-group">
                <input
                    type="date"
                    name="dateJoined"
                    value={userData.dateJoined}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="rut"
                    value={userData.rut}
                    onChange={handleChange}
                    placeholder="RUT"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="Telefono" 
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="alternatePhone"
                    value={userData.alternatePhone}
                    onChange={handleChange}
                    placeholder="Telefono Alternativo"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    placeholder="Ciudad"
                    className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-primary">Actualizar Usuario</button>
        </form>
    );
};

export default EditUserForm;
