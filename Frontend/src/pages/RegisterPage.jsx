import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [rutNumber, setRutNumber] = React.useState('');
    const [rutDv, setRutDv] = React.useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        rut: '',
        first_name: '',
        last_name: '',
        telefono: '',
        telefono_alternativo: '',
        ciudad: '',
        estado: true 
    });
     
    useEffect(() => {
        const completeRut = `${rutNumber}-${rutDv}`;
        setFormData(prevState => ({
            ...prevState,
            rut: completeRut
        }));
    }, [rutNumber, rutDv]); // Este efecto se ejecutará cuando rutNumber o rutDv cambien

    const navigate = useNavigate();
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const prevStep = () => {
        if(step === 2) {
            // Si vuelve al paso 1, actualiza rutNumber y rutDv
            const [number, dv] = formData.rut.split('-');
            setRutNumber(number || '');
            setRutDv(dv || '');
        }
    
        setStep(step => step - 1);
    };

    const nextStep = () => {
        if (step === 1) {
            if (validateStepOne()) {
                setStep(step => step + 1);
            } else {
                alert("Por favor, completa todos los campos requeridos.");
            }
        } else {
            handleSubmit();
        }
    };

    const validateStepOne = () => {
        const { username, first_name, last_name, rut } = formData;
        return rut && username && first_name && last_name;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register/', formData);
            
            if (response.status === 200 || response.status === 201) {
                // Mostrar un mensaje de éxito solo si la solicitud fue exitosa
                Swal.fire({
                    title: 'Éxito!',
                    text: 'Cuenta creada exitosamente!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    // Redireccionar al usuario después de cerrar la alerta
                    navigate('/login');
                });
            } else {
                //Agregar otro mensaje de error aquí si es necesario.
            }
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
        
            if (error.response) {
                // Manejar errores específicos de la respuesta aquí
                console.error('Error en la respuesta:', error.response.data);
                // Mostrar un mensaje de error
                Swal.fire({
                    title: 'Error!',
                    text: 'No se pudo crear la cuenta. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            } else if (error.request) {
                console.error('Sin respuesta:', error.request);
            } else {
                console.error('Error en la solicitud:', error.message);
            }
        }
    };
    
    const handleRutDvChange = (e) => {
        setRutDv(e.target.value);
    };

    const handleRutNumberChange = (e) => {
        const value = e.target.value;
    
        // Permitir solo números y limitar a 8 dígitos
        if (value.match(/^\d{0,8}$/)) {
            setRutNumber(value);
        }
    };

    const [showDvTip, setShowDvTip] = useState(false);

    const handleDvFocus = () => {
        setShowDvTip(true);
        setTimeout(() => {
            setShowDvTip(false);
        }, 3000); // El mensaje se muestra durante 3 segundos
    };

    const validateInput = () => {
        if (!email.includes('@')) {
            setErrorMessage('Por favor ingresa un email válido.');
            return false;
        }
        setErrorMessage('');
        return true;
    };
    
    const renderForm = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        {/* Paso 1: Información Personal y de Contacto */}
                        <div className='form-group'>
                            <label htmlFor="rut">RUT</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="rutNumber" 
                                    name="rutNumber" 
                                    value={rutNumber}
                                    onChange={handleRutNumberChange}
                                    placeholder='12345678'
                                    required 
                                />
                                <span style={{ margin: '0 10px' }}>-</span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="rutDv" 
                                    name="rutDv" 
                                    value={rutDv}
                                    onChange={handleRutDvChange}
                                    onFocus={handleDvFocus}
                                    placeholder="K"
                                    required 
                                    style={{ width: '50px' }} 
                                />
                            </div>
                            {showDvTip && <p className="help-text">Puedes ingresar el dígito verificador en mayúscula o minúscula.</p>}
                            <p className="help-text">(Ingresa tu número de RUT sin puntos y guion)</p>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input type="text" className="form-control" id="username" name="username" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="firstName">Nombre</label>
                            <input type="text" className="form-control" id="first_name" name="first_name" required onChange={handleInputChange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="lastName">Apellido</label>
                            <input type="text" className="form-control" id="last_name" name="last_name" required onChange={handleInputChange} />
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
                            <div className="input-icon">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email} // Vincula el valor del estado
                                    onChange={handleInputChange}
                                    required
                                />
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                            </div>
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