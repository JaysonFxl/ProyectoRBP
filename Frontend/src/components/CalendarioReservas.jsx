import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './CalendarioReservas.css';
import { getStoredToken } from '../security/authService';

const CalendarioReservas = ({ selectedCancha, onFechaChange }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [canchasDisponibles, setCanchasDisponibles] = useState([]);
    const [fechasDisponibles, setFechasDisponibles] = useState([]);
    const [fechasNoDisponibles, setFechasNoDisponibles] = useState([]);
    const [diasDisponibles, setDiasDisponibles] = useState([]);

    // Obtener las fechas disponibles y no disponibles para una fecha específica.
    const obtenerFechas = async (fechaInicio) => {
        // Asegúrate de que la fecha de inicio esté definida
        if (!fechaInicio) {
            console.error('La fecha de inicio es requerida');
            return { disponibles: [], noDisponibles: [] };
        }
    
        //Formatea la fecha de inicio al formato YYYY-MM-DD
        const fechaInicioFormato = format(fechaInicio, 'yyyy-MM-dd');
    
        try {
            const response = await axios.get(`http://localhost:8000/api/disponibilidad_fecha/?fecha_inicio=${fechaInicioFormato}&fecha_fin=${fechaInicioFormato}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las fechas', error);
            return { disponibles: [], noDisponibles: [] };
        }
    };

    
    
    // Consultar la disponibilidad de canchas para una fecha específica.
    const consultarDisponibilidad = async (fecha) => {
        const fechaFormato = format(fecha, 'yyyy-MM-dd');
        const token = getStoredToken(); 
    
        if (!token) {
            console.error('No se encontró el token de usuario');
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:8000/api/horarios_disponibles/${selectedCancha}/${fechaFormato}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Asegúrate de que la respuesta contiene los horarios disponibles
            if (response.data && Array.isArray(response.data.horarios_disponibles)) {
                const diaDeLaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
                const horariosDelDia = response.data.horarios_disponibles.find(h => h.dia.toLowerCase() === diaDeLaSemana);
    
                if (horariosDelDia) {
                    setCanchasDisponibles(horariosDelDia.horarios);
                } else {
                    setCanchasDisponibles([]);
                }
            } else {
                setCanchasDisponibles([]);
            }
        } catch (error) {
            console.error("Error al obtener canchas disponibles:", error);
            setCanchasDisponibles([]);
        }
    };

    const obtenerDiasDisponibles = async () => {
        const mesActual = format(new Date(), 'yyyy-MM');
        if (selectedCancha) {
            try {
                // Asegúrate de que la URL esté formada correctamente
                const url = `http://localhost:8000/api/dias_disponibles/${selectedCancha}/?mes=${mesActual}`;
                const response = await axios.get(url);
                if (response.data) {
                    setDiasDisponibles(response.data.dias_disponibles); // Asumiendo que la respuesta contiene un campo 'dias_disponibles'
                }
            } catch (error) {
                console.error("Error al obtener días disponibles:", error);
                setDiasDisponibles([]);
            }
        }
    };


    useEffect(() => {
        if (selectedCancha) {
            obtenerCanchaSeleccionada(selectedCancha).then(cancha => {
                setCanchasDisponibles(cancha.horarios_disponibles);
            });
        }
    }, [selectedCancha]);

    useEffect(() => {
        obtenerDiasDisponibles();
    }, [selectedCancha]); // Se ejecuta cuando cambia la cancha seleccionada

    
    
    // Obtener las fechas disponibles y no disponibles cuando se seleccione una fecha.
    useEffect(() => {
        if (fechaSeleccionada) {
            consultarDisponibilidad(fechaSeleccionada);
        }
    }, [fechaSeleccionada, selectedCancha]);
    
     // Convertir las fechas a objetos Date
     const fechasDisponiblesDateObj = fechasDisponibles ? fechasDisponibles.map(fecha => new Date(fecha)) : [];
     const fechasNoDisponiblesDateObj = fechasNoDisponibles ? fechasNoDisponibles.map(fecha => new Date(fecha)) : [];
     const diasDisponiblesDateObj = diasDisponibles.map(dia => new Date(dia));


     const obtenerCanchaSeleccionada = async (canchaId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/canchas/${canchaId}`);
            // Asegúrate de que la respuesta incluye un campo 'horarios_disponibles' y que es un arreglo
            return Array.isArray(response.data.horarios_disponibles) ? response.data.horarios_disponibles : [];
        } catch (error) {
            console.error('Error al obtener detalles de la cancha:', error);
            return [];
        }
    };


    // Actualizar la fecha seleccionada en el estado del componente padre (ReservaCancha) cuando cambie.
    return (
        <div className='datepicker-container'>
            <DatePicker
                selected={fechaSeleccionada}
                onChange={(fecha) => {
                    setFechaSeleccionada(fecha);
                    onFechaChange(fecha);
                }}
                dateFormat="dd/MM/yyyy"
            />
            <div>
            {Array.isArray(canchasDisponibles) && canchasDisponibles.length > 0 ? (
                <ul>
                    {canchasDisponibles.map((horario, index) => (
                        <li key={index}>
                            Horario Disponible: {horario}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay canchas disponibles para esta fecha.</p>
            )}
            </div>
        </div>
    );
};

export default CalendarioReservas;
