-- Insertar preguntas de ejemplo
INSERT INTO questions (question, options) VALUES 
(
  '¿Cuál es tu nivel de experiencia en programación?',
  '[
    {"text": "Principiante", "score": 1},
    {"text": "Intermedio", "score": 2},
    {"text": "Avanzado", "score": 3},
    {"text": "Experto", "score": 4}
  ]'::jsonb
),
(
  '¿Qué lenguaje de programación prefieres?',
  '[
    {"text": "JavaScript", "score": 3},
    {"text": "Python", "score": 2},
    {"text": "Java", "score": 1},
    {"text": "C++", "score": 4}
  ]'::jsonb
),
(
  '¿Con qué frecuencia programas?',
  '[
    {"text": "Diariamente", "score": 4},
    {"text": "Varias veces por semana", "score": 3},
    {"text": "Una vez por semana", "score": 2},
    {"text": "Ocasionalmente", "score": 1}
  ]'::jsonb
),
(
  '¿Cuál es tu área de interés principal?',
  '[
    {"text": "Desarrollo Web", "score": 2},
    {"text": "Inteligencia Artificial", "score": 4},
    {"text": "Desarrollo Móvil", "score": 3},
    {"text": "Ciencia de Datos", "score": 3}
  ]'::jsonb
),
(
  '¿Trabajas en equipo o individualmente?',
  '[
    {"text": "Siempre en equipo", "score": 3},
    {"text": "Mayormente en equipo", "score": 2},
    {"text": "Mayormente individual", "score": 1},
    {"text": "Siempre individual", "score": 1}
  ]'::jsonb
);
