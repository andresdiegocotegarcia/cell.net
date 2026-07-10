-- Add photo columns to ordenes table
ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS fotos_recepcion TEXT[] DEFAULT '{}';
ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS fotos_entrega TEXT[] DEFAULT '{}';
