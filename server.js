const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

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
app.use('/css', express.static(path.join(__dirname, 'assets/css')));
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

// Datenbank-Setup
const db = new sqlite3.Database('items.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Erstelle Tabelle, wenn sie nicht existiert
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            cost REAL NOT NULL,
            image TEXT
        )`);
    }
});

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
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Funktion zur Generierung einer zufälligen 7-stelligen ID
function generateUniqueId() {
    return Math.floor(1000000 + Math.random() * 9000000);
}

// API-Route zum Hinzufügen eines Items (mit Bildupload)
app.post('/api/items', upload.single('image'), (req, res) => {
    const id = generateUniqueId();
    const newItem = {
        id: id,
        name: req.body.name,
        cost: req.body.cost,
        image: req.file ? `/images/uploads/${req.file.filename}` : null
    };

    db.run(
        'INSERT INTO items (id, name, cost, image) VALUES (?, ?, ?, ?)',
        [newItem.id, newItem.name, newItem.cost, newItem.image],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(newItem);
        }
    );
});

// API-Route zum Löschen eines Items
app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    
    db.run('DELETE FROM items WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Item not found" });
            return;
        }
        res.json({ message: "Item deleted" });
    });
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}); 