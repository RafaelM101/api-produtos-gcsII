# API de Produtos Eletrônicos

[![Docker Hub](https://badgen.net/badge/Docker%20Hub/gcsii%2Fapi-produtos-gcsii?icon=docker&labelColor=0db7ed)]
(https://hub.docker.com/r/gcsii/api-produtos-gcsii)

Uma API simples construída com **Node.js**, **Express** e **SQLite** para gerenciar produtos eletrônicos. Agora com **rota de remoção**, **testes automatizados (Jest + Supertest)**, **verificação de estilo (ESLint)** e **pipelines do GitHub Actions** com **cobertura mínima de 90% na branch principal**.

---
## Sumário Rápido
- [Guia rápido (Docker Hub)](#-guia-rápido-docker-hub)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como executar](#-como-executar)
- [Testes e cobertura](#-testes-e-cobertura)
- [Lint](#-lint-eslint)
- [CI (GitHub Actions)](#-ci-github-actions)
- [Imagem Docker](#-imagem-docker)
- [Workflow de desenvolvimento](#-workflow-de-desenvolvimento-github-flow)

---

## Guia rápido (Docker Hub)
Baixe e rode a imagem pronta sem precisar configurar Node localmente:
```bash
docker pull gcsii/api-produtos-gcsii:latest
docker run -d -p 8080:8080 --name api-produtos gcsii/api-produtos-gcsii:latest
```
Depois acesse `http://localhost:8080/api/produtos` para conferir a API em execução.

---

## Funcionalidades

- **GET /api/produtos** → Lista todos os produtos cadastrados.
  - **200 OK** com `{ produtos: [...] }`
  - **500** em erro interno de banco
- **POST /api/produtos** → Cria um novo produto.
  - **201 Created** com o objeto criado `{ id, nome, marca, preco, quantidade }`
  - **400** se faltar `nome`, `marca`, `preco` ou `quantidade`
  - **500** em erro interno de banco
- **DELETE /api/produtos/:id** → Remove um produto existente.
  - **204 No Content** quando removido
  - **404** se o produto não existir
  - **500** em erro interno de banco

> A tabela **produtos** é criada automaticamente (e populada com exemplos) na inicialização.

---

## Tecnologias Utilizadas

- **Node.js 20+**
- **Express**
- **SQLite (sqlite3)**
- **Jest + Supertest** (testes)
- **ESLint** (estilo/código)
- **GitHub Actions** (CI)
- **Nodemon** (opcional para dev)

---

## Pré-requisitos

- **Node.js** (20 ou superior)
- **npm**

---

## Estrutura do Projeto

```
api-produtos-gcsII/
├── .github/
│   └── workflows/
│       ├── commit.yml                # Lint + testes em pushes (sem travar por cobertura)
│       └── pull_request.yml          # Lint + cobertura mínima 90% em PR para main/master
├── src/
│   ├── database.js                   # Configura o SQLite e cria/popula a tabela
│   └── server.js                     # Rotas Express (GET/POST/DELETE) e export do app
├── tests/
│   ├── produtos.test.js              # Fluxos felizes e cenários 400/404
│   └── produtos.errors.test.js       # Mocks do DB para cobrir ramos de erro (500)
├── db.sqlite3                        # Banco local (gerado automaticamente)
├── eslint.config.mjs                 # ESLint com suporte a Jest
├── package.json
└── README.md
```

---

## Como Executar

### 1) Instalar dependências
```bash
npm install
```

### 2) Rodar em desenvolvimento
Se usar nodemon:
```bash
npm run dev
```
Sem nodemon:
```bash
npm start
```
Por padrão, a API rodará em **http://localhost:8080**.

### 3) Testar as rotas (exemplos `curl`)

**GET /api/produtos**
```bash
curl -s http://localhost:8080/api/produtos | jq
```

**POST /api/produtos**
```bash
curl -s -X POST http://localhost:8080/api/produtos   -H "Content-Type: application/json"   -d '{"nome":"Smartphone ABC","marca":"Marca X","preco":2000,"quantidade":15}' | jq
```

**DELETE /api/produtos/:id**
```bash
curl -i -X DELETE http://localhost:8080/api/produtos/1
```

---

## Testes e Cobertura

### Rodar testes localmente
```bash
npm test
```
Isso executa **Jest com cobertura** e gera um relatório no terminal.

### Onde a cobertura é exigida (≥ 90%)
- Em **Pull Requests** direcionados para `main`/`master`, o workflow `pull_request.yml` **falha** se a cobertura global ficar **abaixo de 90%**.

> Dica: os testes de erro em `tests/produtos.errors.test.js` mocam o módulo `src/database.js` para exercitar ramos de erro (500), ajudando a atingir a cobertura mínima.

---

## Lint (ESLint)

### Rodar lint localmente
```bash
npm run lint
```

O projeto inclui `eslint.config.mjs` com:
- Ambiente **Node**;
- Suporte ao **Jest** (arquivos `*.test.js`);
- Regras úteis para padronização.

---

## CI (GitHub Actions)

### `.github/workflows/commit.yml`
- **Dispara em pushes** nas branches `main`, `master` e `feature/**`.
- **Jobs**:
  - `lint`: roda ESLint
  - `tests`: roda Jest (sem travar por cobertura, foco é feedback rápido)
  - `docker_build`: constrói a imagem Docker com tags derivadas do git
  - `docker_smoke`: sobe o container e valida `/api/produtos` antes de publicar
  - `docker_publish`: publica a imagem no Docker Hub (`gcsii/api-produtos-gcsii`)

## 🐳 Imagem Docker

[Repositório no Docker Hub: `gcsii/api-produtos-gcsii`](https://hub.docker.com/r/gcsii/api-produtos-gcsii)

### Como baixar e executar
```bash
docker pull gcsii/api-produtos-gcsii:latest
docker run -d -p 8080:8080 --name api-produtos gcsii/api-produtos-gcsii:latest
```
Depois acesse `http://localhost:8080/api/produtos`.

---

### `.github/workflows/pull_request.yml`
- **Dispara em PRs** para `main`/`master`.
- **Jobs**:
  - `lint`: roda ESLint
  - `coverage`: roda Jest com cobertura e **valida ≥ 90%** (falha se menor)

---

## Proteção da Branch Principal

No GitHub (Settings → Branches → Branch protection rules):
1. **Branch name pattern**: `main` (ou `master`)
2. Habilitar:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging** (selecione os jobs de lint e coverage)
   - **Require signed commits** (opcional, recomendado pela atividade)

---

## Commits Semânticos + Assinados (GPG)

### Exemplos de mensagens
- `feat(produtos): adicionar rota DELETE /api/produtos/:id`
- `test(produtos): cobrir cenários 500 com mock do banco`
- `ci(workflows): validar cobertura mínima de 90% em PR`
- `chore: configurar ESLint com suporte ao ambiente Jest`

### Assinar commits por padrão
```bash
git config --global user.signingkey <SEU_KEY_ID_GPG>
git config --global commit.gpgsign true
```
Para um commit específico:
```bash
git commit -S -m "feat: exemplo assinado"
```

---

## API de Referência

### `GET /api/produtos`
- **200**
```json
{
  "produtos": [
    { "id": 1, "nome": "Smartphone XYZ", "marca": "Marca A", "preco": 1500.5, "quantidade": 10 }
  ]
}
```
- **500** `{ "error": "mensagem" }`

### `POST /api/produtos`
**Body**:
```json
{ "nome": "Smartphone ABC", "marca": "Marca X", "preco": 2000, "quantidade": 15 }
```
- **201**
```json
{ "id": 4, "nome": "Smartphone ABC", "marca": "Marca X", "preco": 2000, "quantidade": 15 }
```
- **400** `{ "error": "Nome, marca, preço e quantidade são obrigatórios" }`
- **500** `{ "error": "mensagem" }`

### `DELETE /api/produtos/:id`
- **204** (sem corpo)
- **404** `{ "error": "Produto não encontrado" }`
- **500** `{ "error": "mensagem" }`

---

## Scripts úteis (`package.json` sugerido)

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "lint": "eslint ."
  }
}
```

> Ajuste conforme suas dependências (ex.: instale `nodemon` se quiser usar `npm run dev`).

---

## Workflow de Desenvolvimento (GitHub Flow)

1. Crie uma branch a partir da `main`/`master`:
   ```bash
   git checkout main && git pull origin main
   git checkout -b feat/nova-funcionalidade
   ```
2. Faça commits **semânticos e assinados**.
3. Abra um **Pull Request**; a CI validará **lint** e **cobertura ≥ 90%**.
4. Após aprovação, faça o merge na `main`/`master`.

---

## Observações

- O arquivo `db.sqlite3` é criado automaticamente em **modo local**. Para testes unitários, mocks são usados para simular erros do banco e aumentar cobertura.
- Certifique-se de ter o **Node 20** para compatibilidade com as actions e dependências.

---

Feito com ❤️ para a atividade de **Gestão de Configuração 2 — Qualidade de código**.
