import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const servicios = [
    {
      icono: '📱',
      titulo: 'Cambio de Pantalla',
      descripcion: 'Reemplazamos pantallas dañadas con repuestos originales y compatibles.',
    },
    {
      icono: '🔋',
      titulo: 'Reparación de Batería',
      descripcion: 'Cambio de baterías agotadas o hinchadas para cualquier modelo.',
    },
    {
      icono: '🔧',
      titulo: 'Diagnóstico Técnico',
      descripcion: 'Evaluamos tu equipo para identificar el problema exacto.',
    },
    {
      icono: '💧',
      titulo: 'Reparación por Agua',
      descripcion: 'Recuperamos equipos con daños por líquidos.',
    },
  ];

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="home-hero home-hero-dark">
        <h1 className="home-hero-title">Bienvenido a CeluFix</h1>
        <p className="home-hero-subtitle">Sistema de Gestión de Reparación de Celulares</p>
        <p className="home-hero-description">
          Somos un taller especializado en la reparación de dispositivos móviles.
          Ofrecemos diagnósticos precisos, reparaciones de calidad y un seguimiento
          transparente del estado de tu equipo.
        </p>
        <Link to="/login" className="home-cta-button">
          Iniciar Sesión
        </Link>
      </section>

      {/* Services Section */}
      <section className="home-services">
        <h2 className="home-services-title">Nuestros Servicios</h2>
        <div className="home-services-grid">
          {servicios.map((servicio, index) => (
            <div className="home-service-card" key={index}>
              <span className="home-service-icon">{servicio.icono}</span>
              <h3 className="home-service-name">{servicio.titulo}</h3>
              <p className="home-service-description">{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
