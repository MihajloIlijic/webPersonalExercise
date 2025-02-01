const express = require('express');
const app = express();
const path = require('path');

// Middleware für statische Dateien (CSS, JS, Bilder)
app.use('/css', express.static(path.join(__dirname, 'assets/css')));
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

// Route für die Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route für die Items-Seite
app.get('/items', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/items.html'));
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}); 