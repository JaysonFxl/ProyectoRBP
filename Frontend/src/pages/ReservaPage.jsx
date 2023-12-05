import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import {useAuth} from '../context/authContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import CalendarioReservas from '../components/CalendarioReservas';

function ReservaPage() {
    const [canchas, setCanchas] = useState([]);
    const [selectedCancha, setSelectedCancha] = useState('');
    const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [customDuration, setCustomDuration] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("10");
    const navigate = useNavigate();

    // Función para manejar el cambio de duración de la reserva (personalizada o predefinida).
    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value);
        if (e.target.value !== "custom") {
            setCustomDuration(""); // Limpiar el campo personalizado si no se selecciona "personalizado"
        }
    };

    // Este useEffect se usa para obtener las canchas desde el backend.
    // Se ejecuta solo una vez cuando el componente se monta.
    useEffect(() => {
        axios.get('http://localhost:8000/canchas/')
            .then(response => {
                setCanchas(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las canchas:", error);
            });
    }, []); // Array vacío para ejecutar solo al montar el componente

    // Este useEffect se usa para actualizar la información de la cancha seleccionada.
    // Se ejecuta cada vez que cambia el valor de selectedCancha.
    useEffect(() => {
        const cancha = canchas.find(c => c.id === selectedCancha);
        setCanchaSeleccionada(cancha);
    }, [selectedCancha]); // Depende solo de selectedCancha


    const handleReserva = (event) => {
        event.preventDefault();
        //Aqui se envian las reservas al BackEnd.
        const reservaData = {
            cancha: selectedCancha,
            rut: event.target.rutInput.value,
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
                    state: { reserva: reservaData }
                });
            })
            .catch(error => {
                console.error("Error al hacer la reserva:", error);
            });

        // Redirige al usuario a la página de confirmación
        navigate({
        pathname: '/confirmacion',
        state: { reserva: reservaData }
        });

    };

    const { currentUser } = useAuth();

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
    }, [currentUser, navigate]);
    
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
                    <div className="text-center mt-3">
                        <img src={canchaSeleccionada.imageUrl} alt={`Imagen de ${canchaSeleccionada.nombre}`} className="img-fluid" />
                    </div>
                )}
                </Form.Group>

                {/* Componente CalendarioReservas */}
                <CalendarioReservas />
    
                <Form.Group as={Row} controlId="rutInput" className="mb-3">
                    <Form.Label column sm={2}>RUT</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Ejemplo: 12345678-9" pattern="\d{7,8}-[\dKk]" title="Formato: 12345678-9" required />
                    </Col>
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="dateSelect" className="mb-3">
                            <Form.Label column sm={4}>Fecha</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="timeSelect" className="mb-3">
                            <Form.Label column sm={4}>Hora</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
                            </Col>
                        </Form.Group>
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