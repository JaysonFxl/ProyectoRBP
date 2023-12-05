import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/authContext';
import CanchaDetailsPage from './pages/CanchaDetailsPage';
import ReservaPage from './pages/ReservaPage';
import ReservaConfirmada from './pages/Reservaconfirmada';
import LoginPage from './pages/LoginPage';
import PasswordResetPage from './pages/PasswordResetPage';
import RegisterPage from './pages/RegisterPage';
import Admindashboard from './pages/AdminDashboard/AdminDashboard';
import Gestionreservas from './pages/AdminDashboard/views/Dashboardreservas';
import Gestionusuarios from './pages/AdminDashboard/views/Dashboardgestionusuarios';
import { ThemeProvider } from './theme/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cancha/:id" element={<CanchaDetailsPage />} />
                    <Route path="/reservas" element={<ReservaPage />} />
                    <Route path="/confirmacion" element={<ReservaConfirmada />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/password-reset" element={<PasswordResetPage />} />
                    <Route path="/admin" element={<Admindashboard />} />
                    <Route path="/admin/reservas" element={<Gestionreservas />} />
                    <Route path="/admin/usuarios" element={<Gestionusuarios />} />
                    {/* ... otras rutas ... */}
                </Routes>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
