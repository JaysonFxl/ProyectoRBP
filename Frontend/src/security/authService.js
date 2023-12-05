export const getToken = async (username, password) => {
    try {
        // Verificar si username o password son null, undefined o cadenas vacías
        if (!username || !password) {
            console.error('Username o Password no son válidos');
            throw new Error('Credenciales no válidas');
        }
        // Verificar si username o password son cadenas vacías
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        // Verificar si la respuesta no es válida (status code diferente a 200) y lanzar un error con los detalles del error y el status code de la respuesta.
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Detalles del error:', errorData);
            console.error('Error en la respuesta:', response.statusText);
            throw new Error('Error en la solicitud');
        }

        // Verificar si la respuesta es válida y obtener el token de acceso y el token de refresco de la respuesta.
        const data = await response.json();

        // Verificar si el token de acceso y el token de refresco están disponibles en la respuesta y lanzar un error si no lo están.
        if (data.access && data.refresh) {
            console.log('Token de acceso recibido:', data.access);
            console.log('Token de refresco recibido:', data.refresh);
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            return data.access;
        } else {
            console.error('Error en la respuesta:', data);
            throw new Error('Token not received');
        }
    } catch (error) {
        console.error('Error completo:', error);
        throw error;
    }
}

// Path: ProyectoRBP/Frontend/src/security/authService.js
export const setToken = (token) => {
    localStorage.setItem('token', token);
}

export const getStoredToken = () => {
    return localStorage.getItem('accessToken');
}

export const removeToken = () => {
    localStorage.removeItem('token');
}

export const isTokenValid = () => {
    const token = getStoredToken();
    if (!token) return false;

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
}

export const renewToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.error('No hay token de refresco disponible');
        return null;
    }

    console.log("Enviando token de refresco para renovación:", refreshToken);

    try {
        const response = await fetch('http://localhost:8000/api/token/refresh/', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Respuesta fallida al renovar token:', data);
            throw new Error('No se pudo renovar el token');
        }

        console.log("Nuevo token de acceso recibido:", data.access);

        localStorage.setItem('accessToken', data.access);
        return data.access;
    } catch (error) {
        console.error('Error al renovar el token:', error);
        throw error;
    }
};

export const getUserInfo = async (token) => {
    try {
        const response = await fetch('http://localhost:8000/api/user-info/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener la información del usuario');
        }

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        throw error;
    }
};