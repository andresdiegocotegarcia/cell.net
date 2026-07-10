import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import './Clients.css';

function Clients({ clients, loading, onDeleteClient, onUpdateClient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ nombre: '', cedula: '', telefono: '', email: '' });

  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    return (
      client.nombre.toLowerCase().includes(term) ||
      client.cedula.toLowerCase().includes(term) ||
      client.telefono.toLowerCase().includes(term)
    );
  });

  const startEditing = (client) => {
    setEditingId(client.id);
    setEditData({
      nombre: client.nombre,
      cedula: client.cedula,
      telefono: client.telefono,
      email: client.email || '',
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ nombre: '', cedula: '', telefono: '', email: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    const result = await onUpdateClient(id, editData);
    if (result) {
      setEditingId(null);
    }
  };

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar al cliente "${nombre}"?`)) {
      onDeleteClient(id);
    }
  };

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
              {editingId === client.id ? (
                <div className="client-edit-form">
                  <FormInput
                    label="Nombre"
                    name="nombre"
                    value={editData.nombre}
                    placeholder="Nombre del cliente"
                    onChange={handleEditChange}
                  />
                  <FormInput
                    label="Cédula"
                    name="cedula"
                    value={editData.cedula}
                    placeholder="Cédula"
                    onChange={handleEditChange}
                  />
                  <FormInput
                    label="Teléfono"
                    name="telefono"
                    value={editData.telefono}
                    placeholder="Teléfono"
                    onChange={handleEditChange}
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    value={editData.email}
                    placeholder="Email"
                    onChange={handleEditChange}
                  />
                  <div className="client-edit-actions">
                    <Button text="Guardar" variant="primary" onClick={() => handleSave(client.id)} />
                    <Button text="Cancelar" variant="secondary" onClick={cancelEditing} />
                  </div>
                </div>
              ) : (
                <div className="client-info">
                  <h3 className="client-name">{client.nombre}</h3>
                  <p className="client-detail">
                    <span className="client-label">Cédula:</span> {client.cedula}
                  </p>
                  <p className="client-detail">
                    <span className="client-label">Teléfono:</span> {client.telefono}
                  </p>
                  <p className="client-detail">
                    <span className="client-label">Email:</span> {client.email || '—'}
                  </p>
                  <div className="client-actions">
                    <Button text="Editar" variant="secondary" onClick={() => startEditing(client)} />
                    <Button text="Eliminar" variant="danger" onClick={() => handleDelete(client.id, client.nombre)} />
                  </div>
                </div>
              )}
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
