const express = require('express');
const db = require('../database');
const app = express();
const port = 8080;

app.use(express.json()); 

app.get('/api/produtos', (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ produtos: rows });
    });
});


app.post('/api/produtos', (req, res) => {
    const { nome, marca, preco, quantidade } = req.body;


    if (!nome || !marca || !preco || !quantidade) {
        return res.status(400).json({ error: "Nome, marca, preço e quantidade são obrigatórios" });
    }


    const stmt = db.prepare("INSERT INTO produtos (nome, marca, preco, quantidade) VALUES (?, ?, ?, ?)");

 
    stmt.run(nome, marca, preco, quantidade, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(201).json({
            id: this.lastID,  
            nome,
            marca,
            preco,
            quantidade
        });
    });
    stmt.finalize();  
});

// Inicia o servidor na porta 8080
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
