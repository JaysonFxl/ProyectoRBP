import React, { useState, useEffect } from 'react';
import { getToken, getStoredToken, removeToken, setToken } from '../security/authService';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

//LoginPage es un componente funcional que renderiza un formulario de inicio de sesión y maneja el estado del formulario y la autenticación del usuario.
function LoginPage() {
    const [isAdmin, setIsAdmin] = useState(false); //Estado para cambiar entre el modo de administrador y el modo de usuario normal (no administrador) en el formulario de inicio de sesión.
    const { setCurrentUser, login, currentUser } = useAuth(); //setCurrentUser es una función que permite cambiar el estado del usuario actual en el contexto de autenticación.
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false); //Estado para verificar si el usuario está autenticado o no.
    
    //Función que maneja el cambio de estado del formulario de inicio de sesión cuando el usuario ingresa sus datos.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //Const navigate es una constante que permite redirigir a una página específica de la aplicación web.
    //useNavigate es un hook que permite redirigir a una página específica de la aplicación web.
    const navigate = useNavigate();

    //Función que maneja el envío del formulario de inicio de sesión. 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.username, formData.password); //Llama a la función login del contexto de autenticación para iniciar sesión.
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    //useEffect es un hook que permite ejecutar código cuando el componente se monta, se desmonta o se actualiza.
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            if (currentUser.es_administrador) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [currentUser, isAuthenticated, navigate]); //El useEffect se ejecuta cuando cambia el estado de currentUser o isAuthenticated.
    
    
    // Función para cambiar entre el modo de administrador y el modo de usuario normal (no administrador) en el formulario de inicio de sesión 
    const toggleAdmin = () => {
        setIsAdmin(!isAdmin); //Cambiar el estado de isAdmin.
    };

    const handleAdminChange = (e) => {
        setIsAdmin(e.target.checked);
    };

    return (
        <div className="login-container">
            {isAuthenticated && <Navigate to="/" />}
            <div className="login-card">
                <h2 className="text-center">Bienvenido a Futbolito</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input type="text" className="form-control" id="username" name="username" required onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" className="form-control" id="password" name="password" required onChange={handleInputChange} />
                    </div>
                    {!isAdmin && (
                        <>
                            <div className="form-group">
                                <a href="/register">¿Crear una cuenta?</a>
                            </div>
                            <div className="form-group">
                                <a href="/password-reset">¿Olvidaste tu contraseña?</a>
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn btn-primary w-100 mt-3">Iniciar Sesión</button>
                    <button type="button" className="btn btn-dark w-100 mt-3" onClick={toggleAdmin}>Cambiar a {isAdmin ? 'Usuario' : 'Administrador'}</button>
                    <button type='button' className='btn btn-danger w-100 mt-3' onClick={() => navigate('/admin')}>Ir al Dashboard de Administrador</button>
                    <button type='button' className="btn btn-success w-100 mt-3" onClick={() => window.location.href = '/'}>Volver al Inicio</button>
                </form>
            </div>
        </div>
    ); 
}

export default LoginPage;