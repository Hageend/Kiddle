import axios from 'axios';

// Creamos una instancia de axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Usamos un "interceptor" para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;