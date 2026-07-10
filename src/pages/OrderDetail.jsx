import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import './OrderDetail.css';

const NEXT_STATE = {
  en_espera: 'en_reparacion',
  en_reparacion: 'listo',
  listo: 'entregado',
};

const TRANSITION_LABELS = {
  en_espera: 'Iniciar Reparación',
  en_reparacion: 'Marcar como Listo',
  listo: 'Registrar Entrega',
};

function OrderDetail({ orders, onUpdateOrder }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === Number(id));

  const [formData, setFormData] = useState({
    diagnostico: '',
    repuestos: '',
    procedimiento: '',
    costo: '',
    condiciones_entrega: '',
  });
  const [errors, setErrors] = useState({});
  const [transitionError, setTransitionError] = useState('');

  useEffect(() => {
    if (order) {
      setFormData({
        diagnostico: order.diagnostico || '',
        repuestos: order.repuestos || '',
        procedimiento: order.procedimiento || '',
        costo: order.costo !== null && order.costo !== undefined ? String(order.costo) : '',
        condiciones_entrega: order.condiciones_entrega || '',
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="page order-detail-page">
        <div className="order-not-found">
          <h1>Orden no encontrada</h1>
          <p>El ID proporcionado no corresponde a ninguna orden registrada.</p>
          <Button text="Volver al Dashboard" variant="primary" onClick={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  const isTechnicalFieldsDisabled = order.estado === 'en_espera';
  const isOrderFinalized = order.estado === 'entregado';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (transitionError) {
      setTransitionError('');
    }
  };

  const validateCosto = () => {
    if (formData.costo.trim() !== '') {
      const costoNum = Number(formData.costo);
      if (isNaN(costoNum) || costoNum <= 0) {
        return 'El costo debe ser un valor numérico positivo';
      }
    }
    return '';
  };

  const handleSaveChanges = async () => {
    if (isTechnicalFieldsDisabled) return;

    const newErrors = {};
    const costoError = validateCosto();
    if (costoError) newErrors.costo = costoError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updates = {
      diagnostico: formData.diagnostico.trim(),
      repuestos: formData.repuestos.trim(),
      procedimiento: formData.procedimiento.trim(),
      costo: formData.costo.trim() !== '' ? Number(formData.costo) : null,
      condiciones_entrega: formData.condiciones_entrega.trim(),
    };

    await onUpdateOrder(order.id, updates);
  };

  const handleTransition = async () => {
    const nextState = NEXT_STATE[order.estado];

    if (!nextState) {
      setTransitionError('La transición de estado no es permitida');
      return;
    }

    const newErrors = {};

    if (nextState === 'listo') {
      // Validate costo when transitioning to listo
      const costoError = validateCosto();
      if (costoError) newErrors.costo = costoError;
    }

    if (nextState === 'entregado') {
      // Validate condiciones_entrega when transitioning to entregado
      if (!formData.condiciones_entrega.trim()) {
        newErrors.condiciones_entrega = 'Las condiciones de entrega son obligatorias para completar la entrega';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build updates
    const updates = {
      estado: nextState,
    };

    if (nextState === 'listo') {
      updates.diagnostico = formData.diagnostico.trim();
      updates.repuestos = formData.repuestos.trim();
      updates.procedimiento = formData.procedimiento.trim();
      updates.costo = formData.costo.trim() !== '' ? Number(formData.costo) : null;
    }

    if (nextState === 'entregado') {
      updates.condiciones_entrega = formData.condiciones_entrega.trim();
      updates.fecha_entrega = new Date().toISOString().split('T')[0];
    }

    await onUpdateOrder(order.id, updates);
    setTransitionError('');
  };

  return (
    <div className="page order-detail-page">
      <div className="order-detail-header">
        <h1>Orden #{order.numero_orden}</h1>
        <Button text="Volver al Dashboard" variant="secondary" onClick={() => navigate('/dashboard')} />
      </div>

      {/* Estado actual */}
      <section className="form-section order-status-section">
        <div className="order-status-row">
          <div className="order-status-info">
            <h2 className="form-section-title">Estado</h2>
            <StatusBadge estado={order.estado} />
          </div>
          {!isOrderFinalized && (
            <Button
              text={TRANSITION_LABELS[order.estado]}
              variant="primary"
              onClick={handleTransition}
            />
          )}
        </div>
        {transitionError && (
          <p className="order-error-message" role="alert">{transitionError}</p>
        )}
      </section>

      {/* Datos del Cliente */}
      <section className="form-section">
        <h2 className="form-section-title">Datos del Cliente</h2>
        <Card>
          <div className="order-info-grid">
            <div className="order-info-item">
              <span className="order-info-label">Nombre</span>
              <span className="order-info-value">{order.cliente_nombre}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Datos del Equipo */}
      <section className="form-section">
        <h2 className="form-section-title">Datos del Equipo</h2>
        <Card>
          <div className="order-info-grid">
            <div className="order-info-item">
              <span className="order-info-label">Marca</span>
              <span className="order-info-value">{order.marca}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Modelo</span>
              <span className="order-info-value">{order.modelo}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Color</span>
              <span className="order-info-value">{order.color || '—'}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">IMEI</span>
              <span className="order-info-value">{order.imei || '—'}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Información de Recepción */}
      <section className="form-section">
        <h2 className="form-section-title">Información de Recepción</h2>
        <Card>
          <div className="order-info-grid order-info-grid--full">
            <div className="order-info-item">
              <span className="order-info-label">Fecha de Recepción</span>
              <span className="order-info-value">{order.fecha_recepcion}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Condiciones de Ingreso</span>
              <span className="order-info-value">{order.condiciones_ingreso}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Accesorios</span>
              <span className="order-info-value">{order.accesorios || '—'}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Motivo de Reparación</span>
              <span className="order-info-value">{order.motivo_reparacion}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Contraseña del Equipo</span>
              <span className="order-info-value">{order.contrasena_equipo || '—'}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Campos Técnicos (editables) */}
      <section className="form-section">
        <h2 className="form-section-title">Información Técnica</h2>

        <div className="form-row">
          <FormInput
            label="Diagnóstico"
            name="diagnostico"
            value={formData.diagnostico}
            placeholder="Diagnóstico del equipo"
            error={errors.diagnostico}
            onChange={handleChange}
            disabled={isTechnicalFieldsDisabled || isOrderFinalized}
          />
          <FormInput
            label="Repuestos Utilizados"
            name="repuestos"
            value={formData.repuestos}
            placeholder="Repuestos utilizados"
            error={errors.repuestos}
            onChange={handleChange}
            disabled={isTechnicalFieldsDisabled || isOrderFinalized}
          />
        </div>

        <div className="form-row">
          <FormInput
            label="Procedimiento Realizado"
            name="procedimiento"
            value={formData.procedimiento}
            placeholder="Procedimiento realizado"
            error={errors.procedimiento}
            onChange={handleChange}
            disabled={isTechnicalFieldsDisabled || isOrderFinalized}
          />
          <FormInput
            label="Costo de Reparación"
            name="costo"
            value={formData.costo}
            placeholder="Monto numérico positivo"
            error={errors.costo}
            onChange={handleChange}
            disabled={isTechnicalFieldsDisabled || isOrderFinalized}
          />
        </div>

        <div className="form-row">
          <FormInput
            label="Condiciones de Entrega"
            name="condiciones_entrega"
            value={formData.condiciones_entrega}
            placeholder="Condiciones al entregar el equipo"
            error={errors.condiciones_entrega}
            onChange={handleChange}
            disabled={isOrderFinalized}
          />
        </div>

        {!isOrderFinalized && !isTechnicalFieldsDisabled && (
          <div className="form-actions">
            <Button text="Guardar Cambios" variant="primary" onClick={handleSaveChanges} />
          </div>
        )}

        {order.fecha_entrega && (
          <div className="order-delivery-date">
            <span className="order-info-label">Fecha de Entrega:</span>
            <span className="order-info-value">{order.fecha_entrega}</span>
          </div>
        )}
      </section>
    </div>
  );
}

export default OrderDetail;
