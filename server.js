const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Definindo a pasta "public" como a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o arquivo JSON
app.get('/movies', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'latest_movies.json'));
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
