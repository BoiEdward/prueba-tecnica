const axios = require('axios');
const app = require('/home/edward/Proyectos/Prueba-Tecnica/app');

describe('POST /api/registrar-libro', () => {
  it('Debería registrar un nuevo libro', async () => {
      const nuevoLibro = {
          nombre: 'Nuevo Libro',
          descripcion: 'Descripción del nuevo libro',
          estado: 'Disponible'
      };

      try {
          const response = await axios.post('http://localhost:3000/api/registrar-libro', nuevoLibro);
          if (response.status === 200) {
              console.log('El libro se registró correctamente.');
          } else {
              console.error('Error al registrar el libro. Estado de la respuesta:', response.status);
              throw new Error('La prueba falló');
          }
      } catch (error) {
          if (error.response) {
              console.error('Error en la respuesta:', error.response.data);
          } else if (error.request) {
              console.error('No se recibió respuesta del servidor');
          } else {
              console.error('Error durante la solicitud:', error.message);
          }
          throw error;
      }
  });
});
