import React, { useState, useEffect } from 'react';
import { getStoredToken, isTokenValid, renewToken } from '../../../security/authService';
import '../styles/Manage.css';
import Swal from 'sweetalert2';

// Componente para gestionar los usuarios del sistema (solo para el rol de administrador).
const ManageUsersComponent = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/clientes/');
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    // Manejar errores (no se pudieron obtener los usuarios)
                    console.error('Error en la respuesta del servidor:', response);
                }
            } catch (error) {
                console.error('Hubo un error al obtener los usuarios:', error);
                // Mostrar mensaje de error
            }
        };
    
        fetchUsers();
    }, []);

    // Función para editar un usuario (muestra un modal con los datos del usuario).
    const handleEdit = (user) => {
        Swal.fire({
            title: 'Editar Usuario',
            html: `
                <input type="text" id="username" class="swal2-input" placeholder="Username" value="${user.username}">
                <input type="text" id="first_name" class="swal2-input" placeholder="Nombre" value="${user.first_name}">
                <input type="text" id="last_name" class="swal2-input" placeholder="Apellido" value="${user.last_name}">
                <input type="email" id="email" class="swal2-input" placeholder="Email" value="${user.email}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const username = document.getElementById('username').value;
                const first_name = document.getElementById('first_name').value;
                const last_name = document.getElementById('last_name').value;
                const email = document.getElementById('email').value;
                updateUserData(user.id, { username, first_name, last_name, email });
            }
        });
    };
    
    // Función para actualizar los datos del usuario en el backend.
    const updateUserData = async (userId, userData) => {
        try {
            let token = localStorage.getItem('token');
            const tokenExpired = await isTokenValid();
    
            if (tokenExpired) {
                token = await renewToken();
            }
    
            if (!token) {
                console.error('No se pudo obtener o renovar el token');
                return;
            }
    
            // Enviar los datos del usuario al backend para actualizarlos en la base de datos (PATCH).
            const response = await fetch(`http://localhost:8000/clientes/${userId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                setUsers(users.map(user => user.id === userId ? updatedUser : user));
                
                // Mostrar mensaje de confirmación
                Swal.fire(
                    '¡Actualizado!',
                    'El usuario ha sido actualizado con éxito.',
                    'success'
                );
            } else {
                // Mostrar un mensaje de error
                console.error('Error en la respuesta del servidor:', response);
                Swal.fire(
                    'Error',
                    'Hubo un problema al actualizar el usuario.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Hubo un error al actualizar el usuario:', error);
            // Mostrar un mensaje de error
            Swal.fire(
                'Error',
                'Hubo un problema al actualizar el usuario.',
                'error'
            );
        }
    };
    
    const handleDelete = (userId) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(userId);
        }
    });
};

// Función para eliminar un usuario del sistema.
const deleteUser = async (userId) => {
    try {
        let token = getStoredToken();
        const tokenExpired = await isTokenValid();

        if (tokenExpired) {
            token = await renewToken();
        }

        if (!token) {
            console.error('No se pudo obtener o renovar el token');
            return;
        }

        const response = await fetch(`http://localhost:8000/clientes/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            // Eliminar el usuario de la lista en el estado para actualizar la UI
            setUsers(users.filter(user => user.id !== userId));
            Swal.fire(
                '¡Eliminado!',
                'El usuario ha sido eliminado.',
                'success'
            );
        } else {
            // Mostrar un mensaje de error
            console.error('Error en la respuesta del servidor:', response);
            Swal.fire(
                'Error',
                'Hubo un problema al eliminar el usuario.',
                'error'
            );
        }
    } catch (error) {
        console.error('Hubo un error al eliminar el usuario:', error);
        Swal.fire(
            'Error',
            'Hubo un problema al eliminar el usuario.',
            'error'
        );
    }
};

    return (
        <div>
            <h2>Gestionar Usuarios</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => handleEdit(user)}>Editar</button>
                            <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsersComponent;
