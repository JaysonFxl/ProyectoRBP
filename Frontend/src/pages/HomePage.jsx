import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CustomNavbar from '../components/NavBar';
import Footer from '../components/Footer';
import LandingPage from './LandingPage';

function HomePage() {
    const [canchas, setCanchas] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/canchas/') //URL de la API que se va a consumir para obtener las canchas registradas en la base de datos.
            .then(response => {
                console.log("Datos recibidos:", response.data);
                setCanchas(response.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener las canchas:", error);
            });
    }, []);

    return (
        <div className='d-flex flex-column min-vh-100'>
            <LandingPage />
            <Container className='flex-grow-1'>
                <Row>
                    {canchas.map(cancha => (
                        <Col key={cancha.id} md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{cancha.nombre}</Card.Title>
                                    {/* Añade aquí más detalles de la cancha */}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default HomePage;
