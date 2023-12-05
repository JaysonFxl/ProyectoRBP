import React from 'react';
import Dashboardlayout from '../components/Dashboardlayout';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  datasets: [
    {
      label: 'Reservas por día',
      data: [12, 19, 3, 5, 2, 3, 7],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

const GestionReservas = () => {
    return (
        <Dashboardlayout>
            <div className="gestion-reservas">
                <h2>Gestión de Reservas</h2>

                <section className="reservas-activas">
                    <h3>Reservas Activas</h3>
                    {/* Componente o lógica para mostrar las reservas activas */}
                </section>

                <section className="estadisticas-reservas">
                    <h3>Estadísticas de Reservas</h3>
                    <Bar data={data} />
                </section>

                {/* Otras secciones */}
            </div>
        </Dashboardlayout>
    );
};

export default GestionReservas;

