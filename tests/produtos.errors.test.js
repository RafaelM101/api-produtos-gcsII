// tests/produtos.errors.test.js
const request = require('supertest');

describe('Erros da API de Produtos (500)', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('GET /api/produtos → deve retornar 500 quando db.all falhar', async () => {
    jest.doMock('../src/database', () => ({
      all: (_sql, _params, cb) => cb(new Error('db all falhou')),
      // as rotas não chamam prepare/get/run nesse endpoint
    }));

    const app = requireFreshApp();
    const res = await request(app).get('/api/produtos');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/produtos → deve retornar 500 quando stmt.run falhar', async () => {
    const finalize = jest.fn();
    const run = (_n, _m, _p, _q, cb) => cb(new Error('inserção falhou'));

    jest.doMock('../src/database', () => ({
      prepare: () => ({ run, finalize }),
      // não é usado aqui: all/get/run direto do db
    }));

    const app = requireFreshApp();
    const res = await request(app)
      .post('/api/produtos')
      .send({ nome: 'A', marca: 'B', preco: 10, quantidade: 1 });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(finalize).toHaveBeenCalled();
  });

  test('DELETE /api/produtos/:id → deve retornar 500 quando db.get falhar', async () => {
    jest.doMock('../src/database', () => ({
      get: (_sql, _params, cb) => cb(new Error('select falhou')),
    }));

    const app = requireFreshApp();
    const res = await request(app).delete('/api/produtos/1');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /api/produtos/:id → deve retornar 500 quando db.run (delete) falhar', async () => {
    jest.doMock('../src/database', () => ({
      get: (_sql, _params, cb) => cb(null, { id: 1, nome: 'X' }), // existe
      run: (_sql, _params, cb) => cb(new Error('delete falhou')),
    }));

    const app = requireFreshApp();
    const res = await request(app).delete('/api/produtos/1');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

/** Carrega o app com o mock já aplicado, sem cache de módulos */
function requireFreshApp() {
  let app;
  jest.isolateModules(() => {
    app = require('../src/server'); // server importa ../src/database (já mocada)
  });
  return app;
}
