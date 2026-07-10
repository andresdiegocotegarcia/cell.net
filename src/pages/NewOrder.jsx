import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import './NewOrder.css';

function NewOrder({ clients, orders, onAddOrder, onAddClient }) {
  const navigate = useNavigate();

  const [selectedClient, setSelectedClient] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    marca: '',
    modelo: '',
    color: '',
    imei: '',
    condiciones_ingreso: '',
    accesorios: '',
    motivo_reparacion: '',
    contrasena_equipo: '',
  });
  const [errors, setErrors] = useState({});

  const handleClientSelect = (e) => {
    const value = e.target.value;
    setSelectedClient(value);

    if (value === '') {
      // "Nuevo Cliente" selected - clear client fields
      setFormData((prev) => ({
        ...prev,
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
      }));
    } else {
      // Existing client selected - fill fields
      const client = clients.find((c) => c.id === Number(value));
      if (client) {
        setFormData((prev) => ({
          ...prev,
          nombre: client.nombre,
          cedula: client.cedula,
          telefono: client.telefono,
          email: client.email || '',
        }));
      }
    }

    // Clear client-related errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.nombre;
      delete newErrors.cedula;
      delete newErrors.telefono;
      delete newErrors.email;
      return newErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const imeiRegex = /^\d{15}$/;

    // Required fields
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.cedula.trim()) newErrors.cedula = 'La cédula es obligatoria';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.marca.trim()) newErrors.marca = 'La marca es obligatoria';
    if (!formData.modelo.trim()) newErrors.modelo = 'El modelo es obligatorio';
    if (!formData.condiciones_ingreso.trim())
      newErrors.condiciones_ingreso = 'Las condiciones de ingreso son obligatorias';
    if (!formData.motivo_reparacion.trim())
      newErrors.motivo_reparacion = 'El motivo de reparación es obligatorio';

    // Optional field validations
    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'El formato de email no es válido';
    }
    if (formData.imei.trim() && !imeiRegex.test(formData.imei.trim())) {
      newErrors.imei = 'El IMEI debe contener exactamente 15 dígitos numéricos';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Determine client_id
    let clienteId;
    if (selectedClient) {
      clienteId = Number(selectedClient);
    } else {
      // New client - register
      const newClientData = {
        nombre: formData.nombre.trim(),
        cedula: formData.cedula.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
      };
      const newClient = await onAddClient(newClientData);
      clienteId = newClient ? newClient.id : null;
    }

    // Create order data
    const orderData = {
      cliente_id: clienteId,
      cliente_nombre: formData.nombre.trim(),
      marca: formData.marca.trim(),
      modelo: formData.modelo.trim(),
      color: formData.color.trim(),
      imei: formData.imei.trim(),
      condiciones_ingreso: formData.condiciones_ingreso.trim(),
      accesorios: formData.accesorios.trim(),
      motivo_reparacion: formData.motivo_reparacion.trim(),
      contrasena_equipo: formData.contrasena_equipo.trim(),
    };

    await onAddOrder(orderData);
    navigate('/dashboard');
  };

  return (
    <div className="page new-order-page">
      <h1>Nueva Orden de Reparación</h1>

      <form className="new-order-form" onSubmit={handleSubmit} noValidate>
        {/* Sección 1: Datos del Cliente */}
        <section className="form-section">
          <h2 className="form-section-title">Datos del Cliente</h2>

          <div className="form-input-group">
            <label className="form-input-label" htmlFor="client-select">
              Cliente existente
            </label>
            <select
              id="client-select"
              className={`form-input form-select`}
              value={selectedClient}
              onChange={handleClientSelect}
            >
              <option value="">-- Nuevo Cliente --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <FormInput
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              placeholder="Nombre del cliente"
              error={errors.nombre}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Cédula"
              name="cedula"
              value={formData.cedula}
              placeholder="Cédula de identidad"
              error={errors.cedula}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              placeholder="Número de teléfono"
              error={errors.telefono}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              placeholder="correo@ejemplo.com"
              error={errors.email}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Sección 2: Datos del Equipo */}
        <section className="form-section">
          <h2 className="form-section-title">Datos del Equipo</h2>

          <div className="form-row">
            <FormInput
              label="Marca"
              name="marca"
              value={formData.marca}
              placeholder="Marca del equipo"
              error={errors.marca}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Modelo"
              name="modelo"
              value={formData.modelo}
              placeholder="Modelo del equipo"
              error={errors.modelo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Color"
              name="color"
              value={formData.color}
              placeholder="Color del equipo"
              onChange={handleChange}
            />
            <FormInput
              label="IMEI"
              name="imei"
              value={formData.imei}
              placeholder="15 dígitos numéricos"
              error={errors.imei}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Sección 3: Información de Ingreso */}
        <section className="form-section">
          <h2 className="form-section-title">Información de Ingreso</h2>

          <div className="form-input-group form-full-width">
            <label className="form-input-label" htmlFor="condiciones_ingreso">
              Condiciones de Ingreso
              <span className="form-input-required">*</span>
            </label>
            <textarea
              id="condiciones_ingreso"
              name="condiciones_ingreso"
              className={`form-input form-textarea${errors.condiciones_ingreso ? ' form-input--error' : ''}`}
              value={formData.condiciones_ingreso}
              placeholder="Describa las condiciones en que se recibe el equipo"
              onChange={handleChange}
              rows={3}
              aria-invalid={errors.condiciones_ingreso ? 'true' : undefined}
              aria-describedby={errors.condiciones_ingreso ? 'condiciones_ingreso-error' : undefined}
            />
            {errors.condiciones_ingreso && (
              <span className="form-input-error" id="condiciones_ingreso-error" role="alert">
                {errors.condiciones_ingreso}
              </span>
            )}
          </div>

          <div className="form-input-group form-full-width">
            <label className="form-input-label" htmlFor="accesorios">
              Accesorios Entregados
            </label>
            <textarea
              id="accesorios"
              name="accesorios"
              className="form-input form-textarea"
              value={formData.accesorios}
              placeholder="Cargador, funda, etc."
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="form-input-group form-full-width">
            <label className="form-input-label" htmlFor="motivo_reparacion">
              Motivo de Reparación
              <span className="form-input-required">*</span>
            </label>
            <textarea
              id="motivo_reparacion"
              name="motivo_reparacion"
              className={`form-input form-textarea${errors.motivo_reparacion ? ' form-input--error' : ''}`}
              value={formData.motivo_reparacion}
              placeholder="Describa el motivo de la reparación"
              onChange={handleChange}
              rows={3}
              aria-invalid={errors.motivo_reparacion ? 'true' : undefined}
              aria-describedby={errors.motivo_reparacion ? 'motivo_reparacion-error' : undefined}
            />
            {errors.motivo_reparacion && (
              <span className="form-input-error" id="motivo_reparacion-error" role="alert">
                {errors.motivo_reparacion}
              </span>
            )}
          </div>

          <div className="form-input-group form-full-width">
            <label className="form-input-label" htmlFor="contrasena_equipo">
              Contraseña del Equipo
            </label>
            <input
              type="text"
              id="contrasena_equipo"
              name="contrasena_equipo"
              className="form-input"
              value={formData.contrasena_equipo}
              placeholder="Contraseña o patrón del equipo"
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="form-actions">
          <Button text="Registrar Orden" type="submit" variant="primary" />
          <Button
            text="Cancelar"
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </form>
    </div>
  );
}

export default NewOrder;
