import './Button.css';

function Button({ text, type = 'button', variant = 'primary', onClick }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
