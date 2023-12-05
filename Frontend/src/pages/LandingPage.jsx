import React from 'react';
import { Container, Row, Col, Button, Card, Carousel, CarouselItem } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import ReservaPage from './ReservaPage';
import './LandingPage.css';
import backgroundImage from '../assets/Cancha_1.jpg';

function LandingPage() {
    return (
        <div className="landing-page">
            <CustomNavbar />
            {/* Sección Principal */}
            <section className="hero-section text-center bg-success text-dark py-5" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover'}}>
                <Container>
                    <h1 className="display-3">Encuentra y reserva tu cancha ideal</h1>
                    <p className="lead">La mejor plataforma para reservar canchas de fútbol en tu ciudad.</p>
                    <Button variant="success" size="lg" as={Link} to="/reservas">Reservar Cancha</Button>
                </Container>
            </section>

            {/* Sección de Características */}
            <section className="features-section my-5">
                <Container>
                    <h2 className="text-center mb-4">¿Por qué elegirnos?</h2>
                    <Row>
                        <Col md={4}>
                            <Card className="mb-4 feature-card">
                                <Card.Body className='d-flex flex-column'>
                                    <Card.Title>Búsqueda Fácil</Card.Title>
                                    <Card.Text>Encuentra la cancha perfecta en pocos clics.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4 feature-card h-100">
                                <Card.Body>
                                    <Card.Title>Variedad de Canchas</Card.Title>
                                    <Card.Text>Una amplia variedad de canchas a tu disposición.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4 feature-card h-100">
                                <Card.Body className='d-flex flex-column'>
                                    <Card.Title>Reservas Seguras</Card.Title>
                                    <Card.Text>Reserva con confianza y seguridad.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <h3 className='text-center mt-5'>Nuestras Instalaciones</h3>
                    <Carousel className='mt-4'>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/src/assets/Canchafut1.jpg"
                                alt="Primero slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/src/assets/Canchafut2.jpg"
                                alt="Segundo slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/src/assets/Canchafut3.webp"
                                alt="Tercero slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/src/assets/Canchafut4.jpg"
                                alt="Cuarto slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="src/assets/Canchafut5.jpg"
                                alt="Quinto slide"
                            />
                        </Carousel.Item>
                    </Carousel>
                </Container>
            </section>

            {/* Sección de Testimonios */}
            <section className="testimonials-section bg-light py-5">
                <Container>
                    <h2 className="text-center mb-4">Lo que dicen nuestros usuarios</h2>
                    <Row>
                        <Col md={4}>
                            <Card className="mb-4 testimonial-card">
                                <Card.Body>
                                    <Card.Text>"La mejor plataforma para reservar canchas. Rápido y fácil."</Card.Text>
                                    <Card.Footer>- Usuario Satisfecho</Card.Footer>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4 testimonial-card">
                                <Card.Body>
                                    <Card.Text>"La mejor plataforma para reservar canchas. Rápido y fácil."</Card.Text>
                                    <Card.Footer>- Usuario Satisfecho</Card.Footer>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4 testimonial-card">
                                <Card.Body>
                                    <Card.Text>"La mejor plataforma para reservar canchas. Rápido y fácil."</Card.Text>
                                    <Card.Footer>- Usuario Satisfecho</Card.Footer>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Puedes agregar más testimonios aquí */}
                    </Row>
                </Container>
                <div className="text-center mt-4">
                    <Link to="/reservas" className="btn btn-success btn-lg">
                        Ir a Reservas
                    </Link>
                </div>
            </section>

            {/* Llamado a la Acción Final */}
            <section className="cta-section text-center py-5 bg-dark text-dark" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover'}}>
                <Container>
                    <h2 className="display-4">¿Listo para reservar tu cancha?</h2>
                    <p className="lead">No esperes más y descubre las mejores canchas cerca de ti.</p>
                    <Button variant="success" size="lg">Comenzar</Button>

                    {/* Detalles de contacto */}
                    <div className="contact-details mt-4">
                        <p><strong>Teléfono:</strong> +1 234 567 890</p>
                        <p><strong>Dirección:</strong> Calle Ejemplo 123, Ciudad, País</p>
                    </div>
                </Container>
            </section>
        </div>
    );
}

export default LandingPage;