export const environment = {
  production: true,
  // Em produção, o Nginx faz proxy de /api → backend:8080
  // Por isso usamos apenas '/api' sem host/porta
  apiUrl: '/api'
};
