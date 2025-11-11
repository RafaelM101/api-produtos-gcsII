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

app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;

    // Verifica se o produto existe
    db.get("SELECT * FROM produtos WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        // Remove o produto
        db.run("DELETE FROM produtos WHERE id = ?", [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // 204: No Content (sem corpo de resposta)
            return res.status(204).send();
        });
    });
});


// Inicia o servidor na porta 8080
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
