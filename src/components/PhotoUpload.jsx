import { useRef } from 'react';
import './PhotoUpload.css';

function PhotoUpload({ photos = [], onPhotosChange, maxPhotos = 3, disabled = false, label = "Fotos" }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = maxPhotos - photos.length;
    const filesToProcess = files.slice(0, remaining);

    let currentPhotos = [...photos];

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        currentPhotos = [...currentPhotos, reader.result].slice(0, maxPhotos);
        onPhotosChange(currentPhotos);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <div className="photo-upload">
      <label className="photo-upload-label">{label} ({photos.length}/{maxPhotos})</label>
      <div className="photo-upload-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-upload-item">
            <img src={photo} alt={`Foto ${index + 1}`} className="photo-upload-img" />
            {!disabled && (
              <button type="button" className="photo-upload-remove" onClick={() => removePhoto(index)}>✕</button>
            )}
          </div>
        ))}
        {photos.length < maxPhotos && !disabled && (
          <button type="button" className="photo-upload-add" onClick={() => inputRef.current?.click()}>
            <span className="photo-upload-add-icon">📷</span>
            <span className="photo-upload-add-text">Agregar</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </div>
  );
}

export default PhotoUpload;
