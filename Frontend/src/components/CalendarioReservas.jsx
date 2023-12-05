import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './CalendarioReservas.css';

const CalendarioReservas = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [canchasDisponibles, setCanchasDisponibles] = useState([]);
    const [fechasDisponibles, setFechasDisponibles] = useState([]);
    const [fechasNoDisponibles, setFechasNoDisponibles] = useState([]);

    const obtenerFechas = async (fechaInicio) => {
        // Asegúrate de que la fecha de inicio esté definida
        if (!fechaInicio) {
            console.error('La fecha de inicio es requerida');
            return { disponibles: [], noDisponibles: [] };
        }
    
        // Formatea la fecha de inicio al formato YYYY-MM-DD
        const fechaInicioFormato = format(fechaInicio, 'yyyy-MM-dd');
    
        try {
            const response = await axios.get(`http://localhost:8000/api/disponibilidad_fecha/?fecha_inicio=${fechaInicioFormato}&fecha_fin=${fechaInicioFormato}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las fechas', error);
            return { disponibles: [], noDisponibles: [] };
        }
    };
        
    const consultarDisponibilidad = (fecha) => {
        const fechaFormato = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        // Convertir las fechas no disponibles a objetos Date para comparación
        const fechasNoDisponiblesDateObj = fechasNoDisponibles.map(fechaStr => new Date(fechaStr));
    
        // Verificar si la fecha seleccionada está en la lista de fechas no disponibles
        const esFechaNoDisponible = fechasNoDisponiblesDateObj.some(fechaNoDisponible => 
            fechaNoDisponible.toISOString().split('T')[0] === fechaFormato);
    
        if (esFechaNoDisponible) {
            setCanchasDisponibles([]); // No hay canchas disponibles
        } else {
            axios.get(`/api/disponibilidad_canchas/?fecha_inicio=${fechaFormato}`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setCanchasDisponibles(response.data);
                    } else {
                        console.error('La respuesta no es un arreglo:', response.data);
                        setCanchasDisponibles([]); // Establece un arreglo vacío si la respuesta no es un arreglo
                    }
                    console.log(response.data);
                })
                .catch(error => {
                    if (error.response) {
                        console.error('Error en la respuesta del servidor:', error.response.data);
                        setCanchasDisponibles([]);
                        console.error('Estado de la respuesta:', error.response.status);
                        console.error('Encabezados de la respuesta:', error.response.headers);
                    } else if (error.request) {
                        console.error('No se recibió ninguna respuesta:', error.request);
                    } else {
                        console.error('Error al configurar la solicitud:', error.message);
                    }
                    console.error('Configuración completa de la solicitud:', error.config);
                });
        }
    };
    
    useEffect(() => {
        if (fechaSeleccionada) {
            obtenerFechas(fechaSeleccionada).then(data => {
                setFechasDisponibles(data.disponibles);
                setFechasNoDisponibles(data.noDisponibles);
            });
        }
    }, [fechaSeleccionada]);
    
     // Convertir las fechas a objetos Date
     const fechasNoDisponiblesDateObj = Array.isArray(fechasNoDisponibles) ? fechasNoDisponibles.map(fechaStr => new Date(fechaStr)) : [];
     const fechasDisponiblesDateObj = Array.isArray(fechasDisponibles) ? fechasDisponibles.map(fecha => new Date(fecha)) : [];


    return (
        <div className='datepicker-container'>
            <DatePicker
                selected={fechaSeleccionada}
                onChange={(fecha) => {
                    setFechaSeleccionada(fecha);
                    consultarDisponibilidad(fecha);
                }}
                dateFormat="dd/MM/yyyy" // Formato de visualización de la fecha
                highlightDates={{
                    "highlighted-dates": fechasDisponiblesDateObj, // Usa los objetos Date convertidos
                    "non-highlighted-dates": fechasNoDisponiblesDateObj // Usa los objetos Date convertidos
                }}
            />
            <div>
                {canchasDisponibles.length > 0 ? (
                    <ul>
                        {canchasDisponibles.map(cancha => (
                            <li key={cancha.id}>{cancha.nombre} - {cancha.ubicacion}</li>
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
