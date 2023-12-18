import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import {useAuth} from '../context/authContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './LandingPage.css';
import CalendarioReservas from '../components/CalendarioReservas';

// Componente para la página de reserva.
function ReservaPage() {
    const [canchas, setCanchas] = useState([]);
    const [selectedCancha, setSelectedCancha] = useState('');
    const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDuration, setSelectedDuration] = useState("10");
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [precios, setPrecios] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    //Función para manejar el cambio de duración de la reserva (personalizada o predefinida).
    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value);
        if (e.target.value !== "custom") {
            setCustomDuration(""); //Limpiar el campo personalizado si no se selecciona "personalizado"
        }
    };

    //Este useEffect se usa para obtener las canchas desde el backend.
    //Se ejecuta solo una vez cuando el componente se monta.
    useEffect(() => {
        axios.get('http://localhost:8000/canchas/')
            .then(response => {
                setCanchas(response.data); //Establecer las canchas en el estado.
                if(response.data.length > 0) {
                    setSelectedCancha(response.data[0].id.toString()); // Establecer la primera cancha como seleccionada
                }
            })
            //Catch para manejar errores en la solicitud.
            .catch(error => {
                console.error("Error al obtener las canchas:", error);
            });
    }, []);
    
    // Este useEffect se usa para actualizar la información de la cancha seleccionada.
    // Se ejecuta cada vez que cambia el valor de selectedCancha.
    useEffect(() => {
        const cancha = canchas.find(c => c.id === parseInt(selectedCancha, 10));
        setCanchaSeleccionada(cancha);
    }, [selectedCancha, canchas]);

    // Este useEffect se usa para actualizar la información de la cancha seleccionada.
    useEffect(() => {
        console.log("Canchas:", canchas);
        console.log("Selected Cancha:", selectedCancha); // El valor de selectedCancha es una cadena, por lo que se debe convertir a un número entero.
    
        // Si hay una cancha seleccionada, obtener la información de la cancha seleccionada.
        if(selectedCancha) {
            const canchaId = parseInt(selectedCancha, 10); 
            const cancha = canchas.find(c => c.id === canchaId);
            setCanchaSeleccionada(cancha);
        }
    
        console.log("Cancha seleccionada:", canchaSeleccionada);
    }, [selectedCancha, canchas]); // Se ejecuta cada vez que cambia el valor de selectedCancha o canchas.
    
    // Obtener los horarios disponibles para la cancha seleccionada y el día seleccionado.
    useEffect(() => {
        console.log("selectedCancha:", selectedCancha, "selectedDate:", selectedDate);
        if (selectedCancha && selectedDate) {
            const fechaFormato = selectedDate.toISOString().split('T')[0];
            console.log("URL de solicitud:", `http://localhost:8000/api/canchas/${selectedCancha}/disponibilidad/${fechaFormato}`);
            axios.get(`http://localhost:8000/api/canchas/${selectedCancha}/disponibilidad/${fechaFormato}`)
                .then(response => {
                    console.log("Respuesta del servidor:", response.data);
                    if (response.data && response.data.horarios_disponibles) {
                        setHorariosDisponibles(response.data.horarios_disponibles.map(h => h.hora)); // Establecer los horarios disponibles para el día seleccionado.
                        // Aquí también manejar los precios
                    } else {
                        setHorariosDisponibles([]); // Limpiar los horarios disponibles si no hay horarios disponibles para el día seleccionado.
                    }
                })
                .catch(error => {
                    console.error("Error al obtener horarios y precios:", error);
                    setHorariosDisponibles([]); // Limpiar los horarios disponibles si hay un error en la solicitud.
                });
        }
    }, [selectedCancha, selectedDate]);

    // Obtener los precios de la cancha seleccionada para el día seleccionado.
    useEffect(() => {
        if (selectedDate && canchaSeleccionada) {
          const diaSeleccionado = format(selectedDate, 'EEEE', { locale: es }).toLowerCase(); // Obtener el día de la semana en español.
          
          const horariosDelDia = canchaSeleccionada.horarios_disponibles.find(h => h.dia.toLowerCase() === diaSeleccionado); // Buscar los horarios disponibles para el día seleccionado.
      
          if (horariosDelDia) {
            setHorariosDisponibles(horariosDelDia.horarios); // Establecer los horarios disponibles para el día seleccionado.
          } else {
            setHorariosDisponibles([]); // Limpiar los horarios disponibles si no hay horarios disponibles para el día seleccionado.
          }
        }
      }, [selectedDate, canchaSeleccionada]); // Se ejecuta cada vez que cambia el valor de selectedDate o canchaSeleccionada.
    
    // Obtener los precios de la cancha seleccionada para el día seleccionado. 
    const handleReserva = (event) => {
        event.preventDefault();
        //Aqui se envian las reservas al BackEnd.
        const reservaData = {
            cancha: selectedCancha,
            fecha: event.target.dateSelect.value,
            hora: event.target.timeSelect.value,
            duracion: selectedDuration === "custom" ? customDuration : selectedDuration,
            //Aqui pueden agregar más campos si es necesario (por ejemplo, el usuario que hizo la reserva).
        };
        axios.post('http://localhost:8000/api/ruta-de-tu-endpoint', reservaData)
            .then(response => {
                // Redirige al usuario a la página de confirmación
                navigate({
                    pathname: '/confirmacion',
                    state: { reserva: reservaData } //Pasar la información de la reserva a la página de confirmación a través del estado de la ubicación.
                });
            })
            .catch(error => {
                console.error("Error al hacer la reserva:", error);
            });


    };

    // Este useEffect se usa para verificar si el usuario ha iniciado sesión o no.
    useEffect(() => {
        if (!currentUser) {
            Swal.fire({
                title: '¡Atención!',
                text: 'Debes iniciar sesión o crear una cuenta para realizar una reserva.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirigir al usuario a la página de inicio de sesión o registro
                    navigate('/login'); //Ajusta la ruta según sea necesario
                }
            });
        }
    }, [currentUser, navigate]); // Se ejecuta cada vez que cambia el valor de currentUser o navigate.
    
    return (
        <Container className="mt-5 reserva-container">
             <h2 className="text-center mb-4 titulo-reserva">Realiza tu Reserva</h2>
             <Form onSubmit={handleReserva} className="reserva-form border p-4 rounded shadow">
                <Form.Group as={Row} controlId="canchaSelect" className="mb-3">
                    <Form.Label column sm={2}>Cancha</Form.Label>
                    <Col sm={10}>
                    <Form.Control as="select" value={selectedCancha} onChange={e => setSelectedCancha(e.target.value)}>
                        {canchas.map(cancha => (
                            <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
                        ))}
                    </Form.Control>

                    </Col>
                    {/* Mostrar la imagen de referencia si se ha seleccionado una cancha */}
                    {canchaSeleccionada && (
                        <div className="cancha-detalles">
                            <img src={canchaSeleccionada.imagen} alt={`Imagen de ${canchaSeleccionada.nombre}`} className="img-fluid" />
                            <h3>{canchaSeleccionada.nombre}</h3>
                            <p>Ubicación: {canchaSeleccionada.ubicacion}</p>
                            <p>Tipo de Superficie: {canchaSeleccionada.tipo_superficie}</p>
                            <p>Descripción: {canchaSeleccionada.descripcion}</p>
                        </div>  
                    )}
                </Form.Group>
                {/* Componente CalendarioReservas */}
                <CalendarioReservas 
                    selectedCancha={selectedCancha}
                    selectedDate={selectedDate}
                    onFechaChange={(fecha) => setSelectedDate(fecha)}
                />
                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="timeSelect" className="mb-3">
                            <Form.Label column sm={4}>Hora</Form.Label>
                            <Col sm={8}>
                                <Form.Control as="select" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                                    <option value="">Seleccione un horario</option>
                                    {console.log("Horarios disponibles antes del render:", horariosDisponibles)}
                                    {horariosDisponibles.length > 0 ? (
                                        horariosDisponibles.map((horario, index) => (
                                            <option key={index} value={horario}>{horario}</option>
                                        ))
                                    ) : (
                                        <option disabled>No hay horarios disponibles</option>
                                    )}
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        {selectedTime && precios[selectedTime] && (
                            <div className="precios">
                                <p>Precio para la duración seleccionada: 
                                    {precios[selectedTime]}
                                </p>
                            </div>
                        )}
                    </Col>
                </Row>

                <Form.Group as={Row} controlId="durationSelect" className="mb-3">
                    <Form.Label column sm={2}>Duración</Form.Label>
                    <Col sm={10}>
                        <Form.Control as="select" value={selectedDuration} onChange={handleDurationChange}>
                            <option value="10">10 minutos</option>
                            <option value="20">20 minutos</option>
                            <option value="30">30 minutos</option>
                            <option value="40">40 minutos</option>
                            <option value="60">1 hora</option>
                            <option value="custom">Personalizado</option>
                        </Form.Control>
                        {selectedDuration === "custom" && (
                            <Form.Control 
                                type="text" 
                                placeholder="Especifica la duración en minutos" 
                                value={customDuration} 
                                onChange={e => setCustomDuration(e.target.value)}
                                className="mt-2"
                            />
                        )}
                    </Col>
                </Form.Group>
                    <div className="d-flex justify-content-center mt-4text-center mt-4">
                        <Button type="submit" variant="primary" size="lg" disabled={!currentUser}>Reservar</Button>
                        {/* Botón para volver al menú principal */}
                        <Button onClick={() => navigate('/')} style={{ marginLeft: '20px' }} className="btn btn-secondary ml-2">Menú Principal</Button>
                    </div>
            </Form>
        </Container>
    );
}

export default ReservaPage;