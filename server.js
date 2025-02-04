const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/images/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });


app.use(express.json());


app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));


const db = new sqlite3.Database('items.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            cost REAL NOT NULL,
            image TEXT
        )`);
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/items', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/items.html'));
});


app.get('/items-gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/items-gallery.html'));
});


app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


function generateUniqueId() {
    return Math.floor(1000000 + Math.random() * 9000000);
}


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


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}); 