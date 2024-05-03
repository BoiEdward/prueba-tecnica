// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Configurar el motor de plantillas EJS

// Servir archivos estáticos desde el directorio 'views'
app.use(express.static(path.join(__dirname, 'views')));

const connection = mysql.createConnection({
    host: '172.17.0.2',
    user: 'root',
    password: 'root', // Contraseña del mysql
    database: 'libreria' // Nombre de la base de datos
});


// Iniciar el servidor
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a MariaDB:', err);
        return;
    }
    console.log('Conexión exitosa a MariaDB');

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {

    // Obtener el número de página de la consulta (página 1 por defecto)
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Cantidad de resultados por página
    const offset = (page - 1) * limit; // Calcular el offset

    // Realizar la consulta a la base de datos con paginación
    connection.query('SELECT * FROM libros LIMIT ?, ?', [offset, limit], (err, resultados) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            return;
        }

        // Renderizar la página 'index' y pasar los resultados como datos
        res.render('index', { libros: resultados, page: page });
    });
});

// Ruta para la página de registro
app.get('/registrar-libro', (req, res) => {
    res.render('registrar-libro');
});

// Ruta para la API de editar un libro
app.get('/editar-libro/:id', (req, res) => {
    const libroId = req.params.id; // Obtener el ID del libro de los parámetros de la URL
    
    // Realizar la consulta a la base de datos para obtener la información del libro por su ID
    connection.query('SELECT * FROM libros WHERE id = ?', [libroId], (err, resultado) => {
        if (err) {
            console.error('Error al obtener la información del libro:', err);
            res.status(500).send('Error al obtener la información del libro');
            return;
        }
        
        // Verificar si se encontró un libro con el ID proporcionado
        if (resultado.length === 0) {
            // Si no se encontró ningún libro, enviar una respuesta de error 404
            res.status(404).send('Libro no encontrado');
            return;
        }

        // Renderizar una página especial con la información del libro encontrado
        res.render('editar-libro', { libro: resultado[0] });
    });
});


// Ruta para procesar la solicitud de registro
app.post('/api/registrar-libro', (req, res) => {
    const { nombre, descripcion, estado } = req.body;

    const nuevoLibro = { nombre, descripcion, estado };

    // Insertar el nuevo libro en la base de datos
    connection.query('INSERT INTO libros SET ?', nuevoLibro, (err, result) => {
        if (err) {
            console.error('Error al registrar el libro:', err);
            res.status(500).send('Error al registrar el libro');
            return;
        }

        console.log('Libro registrado con éxito:', result.insertId);
        res.redirect('/');
    });
});

// Ruta para la API de editar información de un libro por ID
app.post('/api/editar-libro', (req, res) => {
    // Obtener los datos del libro del cuerpo de la solicitud
    const { nombre, descripcion, estado, id } = req.body;

    // Realizar la actualización en la base de datos
    connection.query('UPDATE libros SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?', [nombre, descripcion, estado, id], (err, resultado) => {
        if (err) {
            console.error('Error al editar el libro:', err);
            res.status(500).send('Error al editar el libro');
            return;
        }
        // Redirigir al usuario a la página principal después de editar el libro
        res.redirect('/');
    });
});

// Ruta para manejar la eliminación de libros
app.delete('/api/eliminar/:id', (req, res) => {
    const libroId = req.params.id;

    // Eliminar el libro de la base de datos
    connection.query('DELETE FROM libros WHERE id = ?', libroId, (err, result) => {
        if (err) {
            console.error('Error al eliminar el libro:', err);
            return res.status(500).send('Error al eliminar el libro'); // Enviar un mensaje de error y código de estado 500
        }

        // Verificar si se eliminó algún libro
        if (result.affectedRows === 0) {
            console.log('No se encontró ningún libro con el ID proporcionado:', libroId);
            return res.status(404).send('No se encontró ningún libro con el ID proporcionado'); // Enviar un mensaje de error y código de estado 404 si no se encontró ningún libro
        }

        console.log('Libro eliminado con éxito:', libroId);
        res.status(200).send('Libro eliminado con éxito'); // Enviar un mensaje de éxito y código de estado 200
    });
});

