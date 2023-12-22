// ExplorarCanchasPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

function ExplorarCanchasPage() {
    const [canchas, setCanchas] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/canchas')
            .then(response => {
                setCanchas(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las canchas:", error);
            });
    }, []);

    return (
        <Container>
            <h1 className="text-center my-4">Explorar Canchas</h1>
            <Row xs={1} md={2} lg={3} className="g-4">
                {canchas.map(cancha => (
                    <Col key={cancha.id}>
                        <Card>
                            {cancha.imagen && <Card.Img variant="top" src={cancha.imagen} />}
                            <Card.Body>
                                <Card.Title>{cancha.nombre}</Card.Title>
                                {/* Aquí puedes añadir más detalles de la cancha si lo deseas */}
                                <Link to={`/cancha/${cancha.id}`} className="btn btn-primary">Ver detalles</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ExplorarCanchasPage;
