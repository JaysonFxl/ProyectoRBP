import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [rutNumber, setRutNumber] = React.useState('');
    const [firstName, setFirstName] = useState('');   
    const [lastName, setLastName] = useState('');
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
     
    // Efecto para actualizar el estado del formulario cuando cambie el número o el dígito verificador del RUT.
    useEffect(() => {
        const completeRut = `${rutNumber}-${rutDv}`; // Concatena el número y el dígito verificador del RUT con un guion.
        setFormData(prevState => ({
            ...prevState,
            rut: completeRut // Actualiza el valor del campo rut en el estado del formulario.
        }));
    }, [rutNumber, rutDv]); // Este efecto se ejecutará cuando rutNumber o rutDv cambien

    // Hook para redireccionar al usuario a otra página (en este caso, a la página de inicio de sesión). 
    const navigate = useNavigate();
    
    // Función para manejar los cambios en los campos del formulario. 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState, // Mantener los valores existentes en el estado del formulario (para no sobreescribirlos).
            [name]: value // Actualizar el valor del campo que cambió.
        }));
    };

    // Función para volver al paso anterior. 
    const prevStep = () => {
        if(step === 2) {
            // Si vuelve al paso 1, actualiza rutNumber y rutDv
            const [number, dv] = formData.rut.split('-');
            setRutNumber(number || ''); // Si el número es undefined, establece el valor en vacío (para evitar que aparezca "undefined" en el campo de texto)
            setRutDv(dv || ''); // Si el dígito verificador es undefined, establece el valor en vacío (para evitar que aparezca "undefined" en el campo de texto)
        }
    
        setStep(step => step - 1); // Actualiza el estado de step para volver al paso anterior.
    };

    // Función para pasar al siguiente paso. 
    const nextStep = () => {
        if (step === 1) {
            if (validateStepOne()) {
                setStep(step => step + 1);
            } else {
                alert("Por favor, completa todos los campos requeridos.");
            }
        } else {
            handleSubmit(); // Envía el formulario al backend si el usuario está en el paso 2 y hace clic en Siguiente.
        }
    };

    // Función para validar que se hayan completado todos los campos del paso 1.
    const validateStepOne = () => {
        const { username, first_name, last_name, rut } = formData;
        return rut && username && first_name && last_name;
    };
    
    // Función para enviar los datos del formulario al backend. 
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
    
    // Función para limitar el número de caracteres del RUT a 8 dígitos.
    const handleRutDvChange = (e) => {
        setRutDv(e.target.value);
    };

    // Función para limitar el número de caracteres del RUT a 8 dígitos.
    const handleRutNumberChange = (e) => {
        const value = e.target.value;
    
        // Permitir solo números y limitar a 8 dígitos
        if (value.match(/^\d{0,8}$/)) {
            setRutNumber(value);
        }
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        // Permitir solo letras y espacios
        if (value.match(/^[a-zA-Z\s]*$/)) {
            setFirstName(value);
        }
    };
    
    const handleLastNameChange = (e) => {
        const value = e.target.value;
        // Permitir solo letras y espacios
        if (value.match(/^[a-zA-Z\s]*$/)) {
            setLastName(value);
        }
    };

    // Estado para mostrar un mensaje de ayuda al ingresar el dígito verificador del RUT.
    const [showDvTip, setShowDvTip] = useState(false);

    // Función para mostrar un mensaje de ayuda al ingresar el dígito verificador del RUT.
    const handleDvFocus = () => {
        setShowDvTip(true);
        setTimeout(() => {
            setShowDvTip(false);
        }, 3000); // El mensaje se muestra durante 3 segundos
    };

    // Función para validar el email. 
    const validateInput = () => {
        if (!email.includes('@')) {
            setErrorMessage('Por favor ingresa un email válido.');
            return false;
        }
        setErrorMessage(''); // Si el email es válido, elimina el mensaje de error.
        return true; // Devuelve true si el email es válido.
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
                            <input 
                                type="text" 
                                className="form-control" 
                                id="first_name" 
                                name="first_name" 
                                value={firstName} 
                                onChange={handleFirstNameChange} 
                                required 
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="lastName">Apellido</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="last_name" 
                                name="last_name" 
                                value={lastName} 
                                onChange={handleLastNameChange} 
                                required 
                            />
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
                                    value={formData.email} 
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