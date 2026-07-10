import './FormInput.css';

function FormInput({
  label,
  type = 'text',
  name,
  value,
  placeholder = '',
  error = '',
  onChange,
  disabled = false,
  required = false,
}) {
  return (
    <div className="form-input-group">
      {label && (
        <label className="form-input-label" htmlFor={name}>
          {label}
          {required && <span className="form-input-required">*</span>}
        </label>
      )}
      <input
        className={`form-input${error ? ' form-input--error' : ''}`}
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span className="form-input-error" id={`${name}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormInput;
