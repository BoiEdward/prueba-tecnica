const axios = require('axios');
const app = require('/home/edward/Proyectos/Prueba-Tecnica/app');

describe('DELETE /api/eliminar/:id', () => {
  it('Debería eliminar un libro existente', async () => {
      try {
          const response = await axios.delete('http://localhost:3000/api/eliminar/59');
          if (response.status === 200) {
              console.log('El libro se eliminó correctamente.');
          } else {
              console.error('Error al eliminar el libro. Estado de la respuesta:', response.status);
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


