import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="footer bg-dark text-white text-center py-3">
            <Container>
                <p>© 2023 Futbolito. Todos los derechos reservados.</p>
                <p><strong>Teléfono:</strong> +1 234 567 890</p>
                <p><strong>Dirección:</strong> Calle Ejemplo 123, Ciudad, País</p>

                {/* Iconos de Redes Sociales */}
                <div className="social-icons my-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;

