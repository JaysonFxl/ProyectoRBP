import React, { useState, useEffect } from 'react';
import '../styles/AddUser.css';

const EditUserForm = ({ onUserUpdated, userDataToEdit }) => {
    // Definición del estado inicial para los campos del formulario
    const initialState = {
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
        telefono: '',
        telefono_alternativo: '',
        ciudad: '',
        state: '',
    };

    const [selectedUserId, setSelectedUserId] = useState(''); // Agregado para manejar el usuario seleccionado
    const [users, setUsers] = useState([]); // Agregado para manejar la lista de usuarios
    const [userData, setUserData] = useState(initialState); // Agregado para manejar los datos del usuario a editar

    useEffect(() => {
        // Carga los datos del usuario a editar
        if (userDataToEdit) {
            setUserData(userDataToEdit); // Agregado para cargar los datos del usuario a editar
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
            [name]: type === 'checkbox' ? checked : value || '' 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:8000/clientes/${selectedUserId}/`, {
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
        const userId = e.target.value || '';
        setSelectedUserId(userId);
    
        const selectedUser = users.find(user => user.id.toString() === userId);
        if (selectedUser) {
            setUserData({
                ...initialState,
                username: selectedUser.username || '',
                firstName: selectedUser.first_name || '',
                lastName: selectedUser.last_name || '',
                email: selectedUser.email || '',
                isSuperuser: selectedUser.is_superuser,
                isStaff: selectedUser.is_staff,
                isActive: selectedUser.is_active,
                dateJoined: selectedUser.date_joined ? selectedUser.date_joined.slice(0, 10) : '', // Formato YYYY-MM-DD
                isAdmin: selectedUser.is_admin,
                rut: selectedUser.rut || '',
                telefono: selectedUser.telefono || '',
                telefono_alternativo: selectedUser.telefono_alternativo || '',
                ciudad: selectedUser.ciudad || '',
                state: selectedUser.state || ''
            });
        } else {
            setUserData(initialState);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="edit-user-form">
            <div className="form-group">
                <label>Seleccionar Usuario:</label>
                <select onChange={handleUserSelect} value={selectedUserId || ''} className="form-control">
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
                name="firstName"
                value={userData.firstName || ''}
                onChange={handleChange}
                placeholder="Nombre"
                className="form-control"
            />
            <input
                type="text"
                name="lastName"
                value={userData.lastName || ''}
                onChange={handleChange}
                placeholder="Apellido"
                className="form-control"
            />
            </div>
            <div className="form-group">
                <input
                    type="email"
                    name="email"
                    value={userData.email || ''}
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
                        checked={!!userData.isSuperuser}
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
                        checked={!!userData.isStaff}
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
                        checked={!!userData.isActive}
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
                        checked={!!userData.isAdmin}
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
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
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
                    value={userData.telefono || ''}
                    onChange={handleChange}
                    placeholder="Teléfono"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="alternatePhone"
                    value={userData.telefono_alternativo || ''}
                    onChange={handleChange}
                    placeholder="Teléfono Alternativo"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="city"
                    value={userData.ciudad || ''}
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
