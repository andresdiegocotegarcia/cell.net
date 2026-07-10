import { useState } from 'react';
import Card from '../components/Card';
import './Clients.css';

function Clients({ clients }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    return (
      client.nombre.toLowerCase().includes(term) ||
      client.cedula.toLowerCase().includes(term) ||
      client.telefono.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page clients-page">
      <h1>Clientes</h1>

      <div className="clients-search-container">
        <input
          type="text"
          className="clients-search"
          placeholder="Buscar por nombre, cédula o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClients.length > 0 ? (
        <div className="clients-grid">
          {filteredClients.map((client) => (
            <Card key={client.id}>
              <div className="client-info">
                <h3 className="client-name">{client.nombre}</h3>
                <p className="client-detail">
                  <span className="client-label">Cédula:</span> {client.cedula}
                </p>
                <p className="client-detail">
                  <span className="client-label">Teléfono:</span> {client.telefono}
                </p>
                <p className="client-detail">
                  <span className="client-label">Email:</span> {client.email}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="clients-empty">No se encontraron clientes</p>
      )}
    </div>
  );
}

export default Clients;
