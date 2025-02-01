const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

// Konfigurieren Sie multer für Bildupload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/images/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Middleware für JSON-Parsing
app.use(express.json());

// Middleware für statische Dateien (CSS, JS, Bilder)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

// Speicher für Items (in einer echten App würde man eine Datenbank verwenden)
let items = [];

// Route für die Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route für die Items-Seite
app.get('/items', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/items.html'));
});

// Route für die Items-Gallery-Seite
app.get('/items-gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/items-gallery.html'));
});

// API-Route zum Abrufen aller Items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// API-Route zum Hinzufügen eines Items (mit Bildupload)
app.post('/api/items', upload.single('image'), (req, res) => {
    const newItem = {
        id: req.body.id,
        name: req.body.name,
        cost: req.body.cost,
        image: req.file ? `/images/uploads/${req.file.filename}` : null
    };
    items.push(newItem);
    res.json(newItem);
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}); 