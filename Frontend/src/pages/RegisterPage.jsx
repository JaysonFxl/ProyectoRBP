import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        rut: '',
        firstName: '',
        lastName: '',
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

    const nextStep = () => {
        if (step === 1) {
            // Verificar si los campos del Paso 1 están completos
            if (validateStepOne()) {
                setStep(2);
            } else {
                // Mostrar algún mensaje de error o indicación
                alert("Por favor, completa todos los campos requeridos.");
            }
        }
        else handleSubmit();
    };

    // Manejador para cambiar al paso anterior
    const prevStep = () => {
        if(step === 2) setStep(1);
    };

    const validateStepOne = () => {
        const { rut, username, firstName, lastName } = formData;
        return rut && username && firstName && lastName;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/register/', formData);
            navigate('/login');
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
    
            if (error.response) {
                // La solicitud fue hecha y el servidor respondió con un código de estado
                // que cae fuera del rango de 2xx
                console.error('Error en la respuesta:', error.response.data);
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                console.error('Sin respuesta:', error.request);
            } else {
                // Error en la configuración de la solicitud o error de red
                console.error('Error en la solicitud:', error.message);
            }
        }
    };
    

    const renderForm = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        {/* Paso 1: Información Personal y de Contacto */}
                        <div className='form-group'>
                            <label htmlFor="rut">RUT</label>
                            <input type="text" className="form-control" id="rut" name="rut" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input type="text" className="form-control" id="username" name="username" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="firstName">Nombre</label>
                            <input type="text" className="form-control" id="firstName" name="firstName" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="lastName">Apellido</label>
                            <input type="text" className="form-control" id="lastName" name="lastName" required onChange={handleInputChange} />
                        </div>
                        <button type="button" onClick={nextStep} className="btn btn-primary">Siguiente</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        {/* Paso 2: Detalles de la Cuenta */}
                        <div className='form-group'>
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" name="email" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" className="form-control" id="password" name="password" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="telefono">Teléfono</label>
                            <input type="number" className="form-control" id="telefono" name="telefono" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="telefono_alternativo">Teléfono Alternativo</label>
                            <input type="number" className="form-control" id="telefono_alternativo" name="telefono_alternativo" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="ciudad">Ciudad</label>
                            <input type="text" className="form-control" id="ciudad" name="ciudad" required onChange={handleInputChange} />
                        </div>
                        <button type="button" onClick={prevStep} className="btn btn-secondary">Anterior</button>
                        <button type="submit" className="btn btn-primary">Registrar</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='register-container'>
            <div className='register-card'>
                <h2 className='text-center'>Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    {renderForm()}
                    <div className='form-group'>
                        <p>¿Ya tienes una cuenta? <a href='/login'>Inicia Sesión</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;