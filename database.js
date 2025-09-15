const sqlite3 = require('sqlite3').verbose();

// Cria ou abre o banco de dados SQLite
const db = new sqlite3.Database('./db.sqlite3');

// Cria a tabela de produtos se ela não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            marca TEXT NOT NULL,
            preco REAL NOT NULL,
            quantidade INTEGER NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela:', err.message);
        } else {
            console.log('Tabela de produtos criada com sucesso!');
            
            // Inserir dados iniciais (produtos de exemplo)
            const stmt = db.prepare(`
                INSERT INTO produtos (nome, marca, preco, quantidade)
                VALUES (?, ?, ?, ?)
            `);
            
            // Adiciona 3 produtos de exemplo
            stmt.run('Smartphone XYZ', 'Marca A', 1500.50, 10);
            stmt.run('Laptop ABC', 'Marca B', 3500.00, 5);
            stmt.run('Fone de Ouvido Bluetooth', 'Marca C', 299.99, 20);
            
            stmt.finalize();
        }
    });
});

module.exports = db;
