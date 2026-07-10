import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import frases from '../data/frases.js';
import logo from '../assets/logo.jpg';
import './Login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [frase] = useState(() => frases[Math.floor(Math.random() * frases.length)]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validate = () => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'El formato de email no es válido';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const success = await onLogin(formData.email.trim(), formData.password);

    if (success) {
      navigate('/dashboard');
    } else {
      setErrors((prev) => ({ ...prev, general: 'Credenciales inválidas' }));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <img src={logo} alt="BEROT TECNOLOGY" className="login-logo" />
          <span>BEROT TECNOLOGY</span>
        </div>
        <p className="login-frase">{frase}</p>
        <h1 className="login-title">Iniciar Sesión</h1>

        {errors.general && (
          <div className="login-error-general" role="alert">
            {errors.general}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="correo@ejemplo.com"
            error={errors.email}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Ingresa tu contraseña"
            error={errors.password}
            onChange={handleChange}
            required
          />

          <Button text="Iniciar Sesión" type="submit" variant="primary" />
        </form>

        <p className="login-register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
