import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        rut: '',
        telefono: '',
        telefono_alternativo: '',
        ciudad: '',
        estado: true 
    });
    const navigate = useNavigate();
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData (prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/register/', formData);
            navigate('/login');
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
        }
        if (error.response) {
            // La solicitud fue hecha y el servidor respondió con un código de estado
            // que cae fuera del rango de 2xx
            console.error('Error en la respuesta:', error.response.data);
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('Sin respuesta:', error.request);
        }
    };

    return (
        <div className='register-container'>
            <div className='register-card'>
                <h2 className='text-center'>Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="username">RUT</label>
                        <input type="text" className="form-control" id="rut" name="rut" required onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input type="text" className="form-control" id="username" name="username" required onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" name="email" required onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" className="form-control" id="password" name="password" required onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="telefono">Telefono</label>
                        <input type="number" className="form-control" id="telefono" name="telefono" required onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="telefono_alternativo">Telefono Alternativo</label>
                        <input type="number" className="form-control" id="telefono_alternativo" name="telefono_alternativo" required onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="ciudad">Ciudad</label>
                        <input type="text" className="form-control" id="ciudad" name="ciudad" required onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <button type="submit" className="btn btn-primary">Crear Cuenta</button>
                    </div>
                    <div className='form-group'>
                        <p>¿Ya tienes una cuenta? <a href='/login'>Inicia Sesión</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;