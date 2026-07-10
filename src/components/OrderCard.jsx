import StatusBadge from './StatusBadge';
import './OrderCard.css';

function OrderCard({ numero, cliente, marca, modelo, estado, fecha, onClick }) {
  return (
    <div className={`order-card order-card--${estado}`} onClick={onClick}>
      <div className="order-card-header">
        <span className="order-card-numero">{numero}</span>
        <StatusBadge estado={estado} />
      </div>
      <div className="order-card-body">
        <p className="order-card-cliente">{cliente}</p>
        <p className="order-card-equipo">{marca} {modelo}</p>
        <p className="order-card-fecha">{fecha}</p>
      </div>
    </div>
  );
}

export default OrderCard;
