-- Crear tabla para las preguntas del formulario
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array de objetos con {text, score}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para las respuestas/participaciones
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL, -- Array de respuestas seleccionadas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON submissions(total_score);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
