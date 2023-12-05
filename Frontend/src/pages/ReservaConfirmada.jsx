import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function ReservaConfirmada({ location }) {
    const reserva = location.state.reserva;

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Header className="text-center">
                            <h4>Reserva Confirmada</h4>
                        </Card.Header>
                        <Card.Body>
                            <p>¡Gracias por tu reserva, {reserva.nombre}!</p>
                            <p>Cancha: {reserva.cancha}</p>
                            <p>Fecha: {reserva.fecha}</p>
                            <p>Hora: {reserva.hora}</p>
                            <p>Duración: {reserva.duracion}</p>
                            <p>RUT: {reserva.rut}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ReservaConfirmada;
