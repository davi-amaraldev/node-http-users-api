# Node HTTP Users API

API REST de usuários desenvolvida com **JavaScript** utilizando o módulo nativo `node:http` do Node.js, sem frameworks web.

O projeto foi criado com o objetivo de estudar na prática os fundamentos por trás de uma API HTTP: roteamento, métodos HTTP, headers, status codes, leitura de streams, validação, tratamento de erros, persistência e testes automatizados.

## Funcionalidades

* Listagem de usuários
* Busca de usuário por ID
* Criação de usuários
* Substituição completa de usuários com `PUT`
* Atualização parcial com `PATCH`
* Remoção de usuários
* Persistência com SQLite
* Validação de dados
* Validação de IDs
* Validação de `Content-Type`
* Email único
* Limite de tamanho do body
* CORS
* Rotas estritas
* Tratamento centralizado de erros HTTP
* Testes unitários
* Testes de integração HTTP

## Tecnologias

* JavaScript
* Node.js
* `node:http`
* `node:sqlite`
* `node:test`
* `node:assert`
* SQLite

Nenhum framework web, como Express ou Fastify, é utilizado.

## Rotas

| Método   | Rota         | Descrição                          |
| -------- | ------------ | ---------------------------------- |
| `GET`    | `/`          | Página inicial                     |
| `GET`    | `/users`     | Lista todos os usuários            |
| `GET`    | `/users/:id` | Busca um usuário pelo ID           |
| `POST`   | `/users`     | Cria um novo usuário               |
| `PUT`    | `/users/:id` | Substitui completamente um usuário |
| `PATCH`  | `/users/:id` | Atualiza parcialmente um usuário   |
| `DELETE` | `/users/:id` | Remove um usuário                  |

## Estrutura de um usuário

```json
{
  "name": "Davi",
  "email": "davi@example.com",
  "age": 18
}
```

Um usuário persistido possui também um `id`:

```json
{
  "id": 1,
  "name": "Davi",
  "email": "davi@example.com",
  "age": 18
}
```

## Exemplos

### Criar usuário

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Davi",
  "email": "davi@example.com",
  "age": 18
}
```

Resposta:

```json
{
  "id": 1,
  "name": "Davi",
  "email": "davi@example.com",
  "age": 18
}
```

Status:

```text
201 Created
```

### Listar usuários

```http
GET /users
```

Resposta:

```json
[
  {
    "id": 1,
    "name": "Davi",
    "email": "davi@example.com",
    "age": 18
  }
]
```

### Buscar usuário

```http
GET /users/1
```

### Substituir usuário

`PUT` exige os campos necessários para substituir os dados atuais do usuário.

```http
PUT /users/1
Content-Type: application/json
```

```json
{
  "name": "Davi Amaral",
  "email": "davi.amaral@example.com",
  "age": 18
}
```

### Atualizar parcialmente

```http
PATCH /users/1
Content-Type: application/json
```

```json
{
  "name": "Davi Amaral"
}
```

### Remover usuário

```http
DELETE /users/1
```

## Status HTTP

A API utiliza diferentes status codes de acordo com o resultado da requisição.

| Status | Significado                                      |
| ------ | ------------------------------------------------ |
| `200`  | Requisição concluída com sucesso                 |
| `201`  | Recurso criado com sucesso                       |
| `204`  | Requisição concluída sem conteúdo de resposta    |
| `400`  | Dados ou parâmetros inválidos                    |
| `404`  | Recurso ou rota não encontrada                   |
| `405`  | Método HTTP não permitido para a rota            |
| `409`  | Conflito, como email já cadastrado               |
| `413`  | Corpo da requisição maior que o limite permitido |
| `415`  | `Content-Type` não suportado                     |
| `500`  | Erro interno inesperado                          |

## Validações

Os dados dos usuários passam por validação antes de serem persistidos.

Entre as validações estão:

* `name` deve ser texto
* `name` deve possuir pelo menos 2 caracteres
* `email` deve possuir formato válido
* `email` deve ser único
* `age` deve ser um número inteiro não negativo
* IDs devem ser números inteiros positivos
* `POST` e `PUT` exigem os campos obrigatórios
* `PATCH` exige pelo menos um campo válido
* requisições com body devem utilizar `application/json`

## Limite do body

O corpo das requisições possui limite de:

```text
100 KB
```

Caso o limite seja excedido, a API responde com:

```text
413 Payload Too Large
```

O tamanho é verificado durante a leitura dos chunks da requisição.

## CORS

A API possui suporte a CORS para permitir que clientes executados em outros domínios, como o portfólio web, possam consumi-la pelo navegador.

Métodos permitidos:

```text
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

Também existe suporte a requisições de preflight utilizando `OPTIONS`.

## Persistência

Os usuários são armazenados em um banco SQLite utilizando o módulo nativo:

```js
node:sqlite
```

A tabela de usuários possui:

```text
id
name
email
age
```

O campo `email` possui restrição `UNIQUE`.

Durante os testes, a aplicação utiliza um banco SQLite em memória:

```text
:memory:
```

Isso impede que os testes alterem os dados utilizados no ambiente de desenvolvimento.

## Tratamento de erros

A aplicação utiliza classes específicas para representar diferentes erros:

```text
ValidationError
ConflictError
UnsupportedMediaTypeError
PayloadTooLargeError
```

Esses erros são convertidos para seus respectivos status HTTP pela camada da aplicação.

Erros inesperados retornam:

```text
500 Internal Server Error
```

sem expor detalhes internos da aplicação ao cliente.

## Estrutura do projeto

```text
.
├── data/
│   └── database.sqlite
│
├── src/
│   ├── database/
│   │   └── database.js
│   │
│   ├── errors/
│   │   ├── conflict-error.js
│   │   ├── payload-too-large-error.js
│   │   ├── unsupported-media-type-error.js
│   │   └── validation-error.js
│   │
│   ├── repositories/
│   │   └── user-repository.js
│   │
│   ├── routes/
│   │   └── users-routes.js
│   │
│   ├── utils/
│   │   └── http.js
│   │
│   ├── validators/
│   │   └── user-validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── test/
│   ├── user-validator.test.js
│   └── users-api.test.js
│
├── package.json
└── README.md
```

## Arquitetura

A aplicação foi dividida por responsabilidade.

### `server.js`

Responsável por iniciar o servidor HTTP e definir a porta utilizada pela aplicação.

### `app.js`

Contém o fluxo principal das requisições, tratamento de erros, CORS e delegação para os módulos de rotas.

### `routes/`

Responsável por identificar e executar as rotas relacionadas a cada recurso.

### `repositories/`

Responsável pelo acesso e manipulação dos dados persistidos no SQLite.

### `validators/`

Responsável pela validação dos dados recebidos pela API.

### `utils/`

Contém funcionalidades reutilizáveis relacionadas ao protocolo HTTP, como leitura do body e envio de respostas JSON.

### `errors/`

Contém classes de erro utilizadas para representar diferentes situações da aplicação.

## Executando localmente

Clone o projeto e entre no diretório:

```bash
git clone <URL-DO-REPOSITORIO>
cd node-http-users-api
```

Instale as dependências do projeto:

```bash
npm install
```

Inicie em modo de desenvolvimento:

```bash
npm run dev
```

Por padrão, a aplicação fica disponível em:

```text
http://localhost:3000
```

Também é possível iniciar normalmente com:

```bash
npm start
```

## Porta

A aplicação utiliza a variável de ambiente `PORT` quando ela estiver disponível.

Caso contrário, utiliza:

```text
3000
```

Exemplo:

```bash
PORT=8080 npm start
```

Isso permite executar a API em diferentes ambientes de hospedagem.

## Testes

Os testes utilizam o test runner nativo do Node.js:

```text
node:test
```

Para executar:

```bash
npm test
```

Os testes cobrem casos como:

* validação de usuários
* validação de IDs
* criação de usuários
* busca por ID
* atualização parcial
* remoção
* rotas inexistentes
* métodos não permitidos
* email duplicado
* `Content-Type` inválido
* CORS e preflight
* roteamento estrito

## Por que utilizar `node:http`?

Frameworks como Express e Fastify simplificam grande parte do desenvolvimento de APIs.

Neste projeto, a intenção foi trabalhar diretamente com as primitivas fornecidas pelo Node.js para compreender melhor o que essas ferramentas abstraem.

Durante o desenvolvimento foram explorados conceitos como:

* request e response
* métodos HTTP
* headers
* status codes
* streams
* leitura de body
* serialização JSON
* parsing de URLs
* roteamento
* CORS
* validação
* persistência
* tratamento de erros
* testes HTTP
* separação de responsabilidades

O objetivo principal não é substituir frameworks modernos, mas compreender melhor os fundamentos utilizados por eles.

## Objetivo do projeto

Este projeto faz parte dos meus estudos de desenvolvimento back-end e engenharia de software.

A proposta foi construir uma API REST funcional sem utilizar um framework HTTP, passando progressivamente de um servidor básico para uma aplicação com persistência, validações, tratamento de erros, testes automatizados e organização por responsabilidades.

## Licença

Este projeto está disponível para fins de estudo e aprendizado.
