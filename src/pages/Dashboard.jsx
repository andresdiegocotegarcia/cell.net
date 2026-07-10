import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import './Dashboard.css';

function Dashboard({ orders, clients }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const navigate = useNavigate();

  const filteredOrders = orders.filter((order) => {
    // Filtro por estado
    if (statusFilter !== 'todos' && order.estado !== statusFilter) {
      return false;
    }

    // Filtro por búsqueda
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchNumero = order.numero_orden.toLowerCase().includes(term);
      const matchCliente = order.cliente_nombre.toLowerCase().includes(term);
      const matchMarca = order.marca.toLowerCase().includes(term);
      const matchModelo = order.modelo.toLowerCase().includes(term);
      if (!matchNumero && !matchCliente && !matchMarca && !matchModelo) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="page dashboard-page">
      <h1>Órdenes de Reparación</h1>

      <div className="dashboard-filters">
        <input
          type="text"
          className="dashboard-search"
          placeholder="Buscar por orden, cliente, marca o modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="dashboard-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="en_espera">En Espera</option>
          <option value="en_reparacion">En Reparación</option>
          <option value="listo">Listo</option>
          <option value="entregado">Entregado</option>
        </select>
      </div>

      <p className="dashboard-order-count">
        {filteredOrders.length} {filteredOrders.length === 1 ? 'orden encontrada' : 'órdenes encontradas'}
      </p>

      {filteredOrders.length === 0 ? (
        <p className="dashboard-empty">No se encontraron órdenes</p>
      ) : (
        <div className="dashboard-grid">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              numero={order.numero_orden}
              cliente={order.cliente_nombre}
              marca={order.marca}
              modelo={order.modelo}
              estado={order.estado}
              fecha={order.fecha_recepcion}
              onClick={() => navigate(`/orden/${order.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
