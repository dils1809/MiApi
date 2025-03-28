const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/mensaje', (req, res) => {
    const { mensaje } = req.body;
    req.json({respuesta: 'Recibí tu mensaje: ${mensaje}'});
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
