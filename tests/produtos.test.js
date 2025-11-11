const request = require('supertest');
const express = require('express');
const db = require('../src/database');
const app = require('../src/server'); // Certifique-se que o server exporta o app

// Evita conflito com servidor já em execução
jest.setTimeout(10000);

describe('Testes da API de Produtos', () => {

  // Antes de cada teste, recria a tabela de produtos limpa
  beforeEach((done) => {
    db.serialize(() => {
      db.run("DROP TABLE IF EXISTS produtos");
      db.run(`
        CREATE TABLE produtos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          marca TEXT NOT NULL,
          preco REAL NOT NULL,
          quantidade INTEGER NOT NULL
        )
      `, () => {
        const stmt = db.prepare(
          "INSERT INTO produtos (nome, marca, preco, quantidade) VALUES (?, ?, ?, ?)"
        );
        stmt.run('Produto 1', 'Marca A', 10.0, 5);
        stmt.run('Produto 2', 'Marca B', 20.0, 3);
        stmt.finalize(done);
      });
    });
  });

  // 🧪 GET /api/produtos
  it('deve retornar todos os produtos', async () => {
    const res = await request(app).get('/api/produtos');
    expect(res.statusCode).toBe(200);
    expect(res.body.produtos).toBeInstanceOf(Array);
    expect(res.body.produtos.length).toBeGreaterThan(0);
  });

  // 🧪 POST /api/produtos
  it('deve criar um novo produto com sucesso', async () => {
    const novoProduto = {
      nome: "Produto Novo",
      marca: "Marca X",
      preco: 99.99,
      quantidade: 10
    };

    const res = await request(app)
      .post('/api/produtos')
      .send(novoProduto);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe(novoProduto.nome);
  });

  it('deve retornar 400 se faltar algum campo obrigatório', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .send({ nome: "Incompleto" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // 🧪 DELETE /api/produtos/:id
  it('deve retornar 404 ao tentar deletar um produto inexistente', async () => {
    const res = await request(app).delete('/api/produtos/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('deve deletar um produto existente e retornar 204', async () => {
    // Primeiro cria um produto
    const insert = await request(app)
      .post('/api/produtos')
      .send({ nome: "Produto Deletável", marca: "Marca Y", preco: 50.0, quantidade: 2 });

    const id = insert.body.id;

    const res = await request(app).delete(`/api/produtos/${id}`);
    expect(res.statusCode).toBe(204);

    // Confirma que foi removido
    const check = await request(app).get('/api/produtos');
    const ids = check.body.produtos.map(p => p.id);
    expect(ids).not.toContain(id);
  });
});
