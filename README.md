API de Produtos Eletrônicos

Esta é uma API simples construída com Node.js, Express e SQLite para gerenciar produtos eletrônicos. A API permite realizar a operação de listar os produtos eletrônicos cadastrados no banco de dados.

Funcionalidades

GET /api/produtos: Retorna todos os produtos eletrônicos cadastrados no banco de dados.

Tecnologias Utilizadas

Node.js: Ambiente de execução JavaScript no lado do servidor.

Express: Framework para construir a API.

SQLite: Banco de dados leve para persistir os dados.

Nodemon (opcional): Utilizado para reiniciar o servidor automaticamente durante o desenvolvimento.

Pré-requisitos

Node.js (versão 12 ou superior) instalado.

npm (gerenciador de pacotes do Node.js) instalado.

Instruções de Execução

1\\. Clonando o Repositório

Clone o repositório para o seu ambiente local:

bash

git clone https://github.com/RafaelM101/api-produtos-gcsII

cd api-produtos

2\\. Instalando as Dependências

Instale as dependências necessárias para o projeto:

bash

npm install

3\\. Rodando o Servidor

Para iniciar a API, execute o seguinte comando:

bash

npm run dev

Isso iniciará o servidor localmente na porta 8080. O nodemon será usado para reiniciar o servidor automaticamente a cada modificação nos arquivos.

4\\. Testando a API

Agora que a API está rodando, você pode testar a rota GET /api/produtos utilizando ferramentas como Postman, Insomnia ou cURL.

GET /api/produtos

Esta rota retorna todos os produtos cadastrados no banco de dados.

Exemplo de requisição:

bash

GET http://localhost:8080/api/produtos

Resposta esperada:

json

{

  "produtos": \[

    {

      "id": 1,

      "nome": "Smartphone XYZ",

      "marca": "Marca A",

      "preco": 1500.50,

      "quantidade": 10

    },

    {

      "id": 2,

      "nome": "Laptop ABC",

      "marca": "Marca B",

      "preco": 3500.00,

      "quantidade": 5

    },

    {

      "id": 3,

      "nome": "Fone de Ouvido Bluetooth",

      "marca": "Marca C",

      "preco": 299.99,

      "quantidade": 20

    }

  \]

}

Banco de Dados

O banco de dados utilizado é o SQLite. Ele é armazenado em um arquivo local chamado db.sqlite3. A tabela produtos é criada automaticamente quando o servidor é iniciado e populada com alguns produtos de exemplo.

Fluxo de Trabalho

Este projeto segue o GitHub Flow, um fluxo de trabalho simples que utiliza uma única branch principal (main) para o desenvolvimento contínuo. A cada nova funcionalidade ou correção, você cria uma branch de feature a partir da main, faz as alterações, e depois abre um pull request para mesclar com a main.
