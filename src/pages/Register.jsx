import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import logo from '../assets/logo.jpg';
import './Register.css';

function Register({ onRegister }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error del campo al modificar su valor
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validar campos vacíos
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es obligatorio';
    }

    // Si hay errores de campos vacíos, mostrar y detener
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validar formato de email
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'El formato de email no es válido' });
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setErrors({ password: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    // Intentar registro
    const result = await onRegister({
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate('/login');
    } else if (result.error === 'email_exists') {
      setErrors({ email: 'El email ya está registrado' });
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-brand">
          <img src={logo} alt="BEROT TECNOLOGY" className="register-logo" />
          <span>BEROT TECNOLOGY</span>
        </div>
        <h1 className="register-title">Crear Cuenta</h1>
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            placeholder="Ingresa tu nombre"
            error={errors.nombre}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Ingresa tu email"
            error={errors.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Repite la contraseña"
            error={errors.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button text="Registrarse" type="submit" variant="primary" />
        </form>
        <p className="register-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
