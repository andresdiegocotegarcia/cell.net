import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import PhotoUpload from '../components/PhotoUpload';
import './OrderDetail.css';

function OrderDetail({ orders, onUpdateOrder, onDeleteOrder }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === Number(id));

  const [formData, setFormData] = useState({
    diagnostico: '',
    repuestos: '',
    procedimiento: '',
    costo: '',
    condiciones_entrega: '',
    fotos_recepcion: [],
    fotos_entrega: [],
    estado: '',
  });

  const [editData, setEditData] = useState({
    marca: '',
    modelo: '',
    color: '',
    imei: '',
    condiciones_ingreso: '',
    accesorios: '',
    motivo_reparacion: '',
    contrasena_equipo: '',
    cliente_nombre: '',
  });

  const [isEditing, setIsEditing] = useState(false);
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
        fotos_recepcion: order.fotos_recepcion || [],
        fotos_entrega: order.fotos_entrega || [],
        estado: order.estado || '',
      });
      setEditData({
        marca: order.marca || '',
        modelo: order.modelo || '',
        color: order.color || '',
        imei: order.imei || '',
        condiciones_ingreso: order.condiciones_ingreso || '',
        accesorios: order.accesorios || '',
        motivo_reparacion: order.motivo_reparacion || '',
        contrasena_equipo: order.contrasena_equipo || '',
        cliente_nombre: order.cliente_nombre || '',
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="page order-detail-page">
        <div className="order-not-found">
          <h1>Orden no encontrada</h1>
          <p>El ID proporcionado no corresponde a ninguna orden registrada.</p>
          <Button text="Volver a Órdenes" variant="primary" onClick={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditData({
      marca: order.marca || '',
      modelo: order.modelo || '',
      color: order.color || '',
      imei: order.imei || '',
      condiciones_ingreso: order.condiciones_ingreso || '',
      accesorios: order.accesorios || '',
      motivo_reparacion: order.motivo_reparacion || '',
      contrasena_equipo: order.contrasena_equipo || '',
      cliente_nombre: order.cliente_nombre || '',
    });
  };

  const handleSaveEdit = async () => {
    const updates = {
      marca: editData.marca.trim(),
      modelo: editData.modelo.trim(),
      color: editData.color.trim(),
      imei: editData.imei.trim(),
      condiciones_ingreso: editData.condiciones_ingreso.trim(),
      accesorios: editData.accesorios.trim(),
      motivo_reparacion: editData.motivo_reparacion.trim(),
      contrasena_equipo: editData.contrasena_equipo.trim(),
      cliente_nombre: editData.cliente_nombre.trim(),
    };

    const result = await onUpdateOrder(order.id, updates);
    if (result) {
      setIsEditing(false);
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
      fotos_recepcion: formData.fotos_recepcion,
      fotos_entrega: formData.fotos_entrega,
    };

    await onUpdateOrder(order.id, updates);
  };

  const handleTransition = async () => {
    const newState = formData.estado;

    if (newState === order.estado) {
      setTransitionError('El estado seleccionado es el mismo actual');
      return;
    }

    const newErrors = {};
    if (newState === 'entregado' && !formData.condiciones_entrega.trim()) {
      newErrors.condiciones_entrega = 'Las condiciones de entrega son obligatorias';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updates = { estado: newState };
    if (newState === 'entregado') {
      updates.condiciones_entrega = formData.condiciones_entrega.trim();
      updates.fecha_entrega = new Date().toISOString().split('T')[0];
      updates.fotos_entrega = formData.fotos_entrega;
    }

    await onUpdateOrder(order.id, updates);
    setTransitionError('');
  };

  return (
    <div className="page order-detail-page">
      <div className="order-detail-header">
        <h1>Orden #{order.numero_orden}</h1>
        <div className="order-detail-header-actions">
          <Button text="Volver a Órdenes" variant="secondary" onClick={() => navigate('/dashboard')} />
          {!isEditing && (
            <Button text="Editar Datos" variant="secondary" onClick={handleStartEditing} />
          )}
          <Button
            text="Eliminar Orden"
            variant="danger"
            onClick={() => {
              if (window.confirm('¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.')) {
                onDeleteOrder(order.id).then((success) => {
                  if (success) navigate('/dashboard');
                });
              }
            }}
          />
        </div>
      </div>

      {/* Estado actual */}
      <section className="form-section order-status-section">
        <div className="order-status-row">
          <div className="order-status-info">
            <h2 className="form-section-title">Estado</h2>
            <StatusBadge estado={order.estado} />
          </div>
          <div className="order-status-change">
            <select
              className="form-input"
              value={formData.estado || order.estado}
              onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
            >
              <option value="en_espera">En Espera</option>
              <option value="en_reparacion">En Reparación</option>
              <option value="listo">Listo</option>
              <option value="entregado">Entregado</option>
            </select>
            <Button text="Cambiar Estado" variant="primary" onClick={handleTransition} />
          </div>
        </div>
        {transitionError && (
          <p className="order-error-message" role="alert">{transitionError}</p>
        )}
      </section>

      {/* Datos del Cliente */}
      <section className="form-section">
        <h2 className="form-section-title">Datos del Cliente</h2>
        {isEditing ? (
          <div className="form-row">
            <FormInput
              label="Nombre del Cliente"
              name="cliente_nombre"
              value={editData.cliente_nombre}
              placeholder="Nombre del cliente"
              onChange={handleEditChange}
            />
          </div>
        ) : (
          <Card>
            <div className="order-info-grid">
              <div className="order-info-item">
                <span className="order-info-label">Nombre</span>
                <span className="order-info-value">{order.cliente_nombre}</span>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Datos del Equipo */}
      <section className="form-section">
        <h2 className="form-section-title">Datos del Equipo</h2>
        {isEditing ? (
          <>
            <div className="form-row">
              <FormInput
                label="Marca"
                name="marca"
                value={editData.marca}
                placeholder="Marca del equipo"
                onChange={handleEditChange}
              />
              <FormInput
                label="Modelo"
                name="modelo"
                value={editData.modelo}
                placeholder="Modelo del equipo"
                onChange={handleEditChange}
              />
            </div>
            <div className="form-row">
              <FormInput
                label="Color"
                name="color"
                value={editData.color}
                placeholder="Color del equipo"
                onChange={handleEditChange}
              />
              <FormInput
                label="IMEI"
                name="imei"
                value={editData.imei}
                placeholder="IMEI del equipo"
                onChange={handleEditChange}
              />
            </div>
          </>
        ) : (
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
        )}
      </section>

      {/* Información de Recepción */}
      <section className="form-section">
        <h2 className="form-section-title">Información de Recepción</h2>
        {isEditing ? (
          <>
            <div className="form-row">
              <FormInput
                label="Condiciones de Ingreso"
                name="condiciones_ingreso"
                value={editData.condiciones_ingreso}
                placeholder="Condiciones al ingresar"
                onChange={handleEditChange}
              />
              <FormInput
                label="Accesorios"
                name="accesorios"
                value={editData.accesorios}
                placeholder="Accesorios entregados"
                onChange={handleEditChange}
              />
            </div>
            <div className="form-row">
              <FormInput
                label="Motivo de Reparación"
                name="motivo_reparacion"
                value={editData.motivo_reparacion}
                placeholder="Motivo de la reparación"
                onChange={handleEditChange}
              />
              <FormInput
                label="Contraseña del Equipo"
                name="contrasena_equipo"
                value={editData.contrasena_equipo}
                placeholder="Contraseña del equipo"
                onChange={handleEditChange}
              />
            </div>
            <div className="order-edit-actions">
              <Button text="Guardar" variant="primary" onClick={handleSaveEdit} />
              <Button text="Cancelar" variant="secondary" onClick={handleCancelEditing} />
            </div>
          </>
        ) : (
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
        )}
      </section>

      {/* Fotos de Recepción */}
      <section className="form-section">
        <h2 className="form-section-title">Fotos de Recepción</h2>
        <PhotoUpload
          photos={formData.fotos_recepcion}
          onPhotosChange={(photos) => setFormData((prev) => ({ ...prev, fotos_recepcion: photos }))}
          maxPhotos={3}
          label="Fotos de condiciones de ingreso"
        />
      </section>

      {/* Fotos de Entrega */}
      <section className="form-section">
        <h2 className="form-section-title">Fotos de Entrega</h2>
        <PhotoUpload
          photos={formData.fotos_entrega}
          onPhotosChange={(photos) => setFormData((prev) => ({ ...prev, fotos_entrega: photos }))}
          maxPhotos={3}
          label="Fotos de condiciones de entrega"
        />
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
          />
          <FormInput
            label="Repuestos Utilizados"
            name="repuestos"
            value={formData.repuestos}
            placeholder="Repuestos utilizados"
            error={errors.repuestos}
            onChange={handleChange}
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
          />
          <FormInput
            label="Costo de Reparación"
            name="costo"
            value={formData.costo}
            placeholder="Monto numérico positivo"
            error={errors.costo}
            onChange={handleChange}
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
          />
        </div>

        <div className="form-actions">
          <Button text="Guardar Cambios" variant="primary" onClick={handleSaveChanges} />
        </div>

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
