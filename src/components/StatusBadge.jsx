import './StatusBadge.css';

const STATUS_LABELS = {
  en_espera: 'En Espera',
  en_reparacion: 'En Reparación',
  listo: 'Listo',
  entregado: 'Entregado',
};

function StatusBadge({ estado }) {
  const label = STATUS_LABELS[estado] || estado;

  return (
    <span className={`status-badge status-badge-${estado}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
