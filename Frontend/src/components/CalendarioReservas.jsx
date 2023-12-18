import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './CalendarioReservas.css';

const CalendarioReservas = ({ selectedCancha, selectedDate, onFechaChange }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [canchasDisponibles, setCanchasDisponibles] = useState([]);
    const [fechasDisponibles, setFechasDisponibles] = useState([]);
    const [fechasNoDisponibles, setFechasNoDisponibles] = useState([]);

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
    const consultarDisponibilidad = (fecha) => {
        const fechaFormato = format(fecha, 'yyyy-MM-dd');
    
        axios.get(`http://localhost:8000/api/canchas/${selectedCancha}/disponibilidad/${fechaFormato}`)
            .then(response => {
                if (response.data && response.data.horarios_disponibles) {
                    setCanchasDisponibles(response.data.horarios_disponibles);
                    console.log("Día seleccionado:", format(fecha, 'EEEE'));
                } else {
                    console.error('Formato inesperado de la respuesta:', response.data);
                    setCanchasDisponibles([]);
                }
            })
            .catch(error => {
                console.error("Error al obtener canchas disponibles:", error);
                setCanchasDisponibles([]);
            });
    };
    
    // Obtener las fechas disponibles y no disponibles cuando se seleccione una fecha.
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

    // Actualizar la fecha seleccionada en el estado del componente padre (ReservaCancha) cuando cambie.
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
                    {canchasDisponibles.map((item, index) => (
                        <li key={index}>
                            Cancha {item.cancha} - Horario Disponible: {item.hora} - Precio: {item.precio} CLP
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
