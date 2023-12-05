import React, { useState } from 'react';

function PasswordResetPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Enviar enlace de restablecimiento a:', email);
    };

    const pageStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7f7f7'
    };

    const formStyle = {
        padding: '20px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '300px'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ddd'
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#0056b3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    const backButtonStyle = {
        ...buttonStyle,
        marginTop: '10px'
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={{ textAlign: 'center' }}>Restablecer Contraseña</h2>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Ingresa tu correo electrónico"
                    required
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>Enviar Enlace de Restablecimiento</button>
                <button type="button" style={backButtonStyle} onClick={() => window.location.href = '/login'}>Volver</button>
            </form>
        </div>
    );
}

export default PasswordResetPage;

