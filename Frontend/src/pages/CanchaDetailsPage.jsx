import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button  } from 'react-bootstrap';

function CanchaDetailsPage() {
    const [cancha, setCancha] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/explorar-canchas'); // Ajusta la ruta según sea necesario
    };
    
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8000/api/canchas/${id}`)
                .then(response => {
                    console.log("Detalles de la cancha:", response.data);
                    setCancha(response.data);
                })
                .catch(error => {
                    console.error("Error al obtener los detalles de la cancha:", error);
                });
        }
    }, [id]);

    if (!cancha) {
        return <div>Cargando detalles de la cancha...</div>;
    }

    return (
        <Container className="my-4">
            <Row>
                <Col md={6}>
                    {/* Mostrar imagen si está disponible */}
                    {cancha.imagen && (
                        <img src={cancha.imagen} alt={cancha.nombre} className="img-fluid" />
                    )}
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{cancha.nombre}</Card.Title>
                            <Card.Text>
                                <strong>Tipo de Superficie:</strong> {cancha.tipo_superficie}
                            </Card.Text>
                            <Card.Text>
                                <strong>Ubicación:</strong> {cancha.ubicacion}
                            </Card.Text>
                            <Card.Text>
                                <strong>Descripción:</strong> {cancha.descripcion}
                            </Card.Text>
                            <Card.Text>
                                <strong>Horarios Disponibles:</strong>
                                {cancha.horarios_disponibles.map((horario, index) => (
                                    <div key={index}>
                                        <strong>{horario.dia}:</strong>
                                        <ul>
                                            {horario.horarios.map((hora, horaIndex) => (
                                                <li key={horaIndex}>{hora}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Button variant="secondary" onClick={handleBackClick} className="mt-3">
                        Volver a Explorar Canchas
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default CanchaDetailsPage;
