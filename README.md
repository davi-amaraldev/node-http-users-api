# Node HTTP Users API

API REST de usuários desenvolvida com **JavaScript** utilizando diretamente o módulo nativo `node:http` do Node.js, sem frameworks web.

O projeto foi criado para estudar, na prática, os fundamentos por trás de uma API HTTP: roteamento, métodos HTTP, headers, status codes, streams, validação, persistência, testes automatizados, containerização e deploy.

A aplicação está atualmente containerizada com **Docker**, executada em uma VM da **Oracle Cloud Infrastructure (OCI)** e disponibilizada publicamente através de um reverse proxy **Caddy** com HTTPS.

## Live API

Base URL:

```text
https://api.140-238-181-238.sslip.io
```

Exemplo:

```http
GET https://api.140-238-181-238.sslip.io/users
```

Resposta inicial de um banco vazio:

```json
[]
```

---

## Funcionalidades

* Listagem de usuários
* Busca de usuário por ID
* Criação de usuários
* Substituição completa com `PUT`
* Atualização parcial com `PATCH`
* Remoção de usuários
* Persistência com SQLite
* Validação de dados
* Validação de IDs
* Validação de `Content-Type`
* Restrição de email único
* Limite de tamanho do body
* CORS
* Suporte a preflight com `OPTIONS`
* Rotas estritas
* `405 Method Not Allowed` com header `Allow`
* Tratamento centralizado de erros HTTP
* Testes unitários
* Testes de integração HTTP
* Banco isolado em memória durante os testes
* Containerização com Docker
* Persistência do SQLite com Docker Volume
* Reverse proxy com Caddy
* HTTPS automático
* Deploy em Oracle Cloud Infrastructure

---

## Tecnologias

### Aplicação

* JavaScript
* Node.js
* `node:http`
* `node:sqlite`
* `node:test`
* `node:assert`
* SQLite

### Infraestrutura

* Docker
* Docker Compose
* Caddy
* Oracle Cloud Infrastructure
* Ubuntu Server
* HTTPS / TLS

Nenhum framework web, como Express ou Fastify, é utilizado.

---

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

---

## Estrutura de um usuário

Para criação:

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

---

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

`PUT` exige os dados necessários para substituir o recurso atual.

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

---

## Exemplo com cURL

Criar:

```bash
curl -X POST https://api.140-238-181-238.sslip.io/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Davi",
    "email": "davi@example.com",
    "age": 18
  }'
```

Listar:

```bash
curl https://api.140-238-181-238.sslip.io/users
```

Buscar por ID:

```bash
curl https://api.140-238-181-238.sslip.io/users/1
```

---

## Status HTTP

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

---

## Validações

Os dados recebidos passam por validação antes de serem persistidos.

Entre as regras implementadas:

* `name` deve ser texto
* `name` deve possuir pelo menos 2 caracteres
* `email` deve ser texto
* `email` deve possuir formato válido
* `email` deve ser único
* `age` deve ser um número inteiro não negativo
* IDs devem ser números inteiros positivos
* `POST` e `PUT` exigem os campos obrigatórios
* `PATCH` exige pelo menos um campo válido
* requisições com body devem utilizar `application/json`

---

## Limite do body

O corpo das requisições possui um limite de:

```text
100 KB
```

O tamanho é calculado durante a leitura dos chunks da requisição.

Caso o limite seja ultrapassado:

```text
413 Payload Too Large
```

---

## CORS

A API possui suporte a CORS para permitir consumo por aplicações executadas em outros domínios, incluindo o portfólio web.

Métodos permitidos:

```text
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

Headers permitidos:

```text
Content-Type
```

Também existe suporte a requisições de preflight através do método `OPTIONS`.

---

## Persistência

Os usuários são armazenados em SQLite através do módulo nativo:

```text
node:sqlite
```

A tabela possui os campos:

```text
id
name
email
age
```

O campo `email` utiliza uma restrição `UNIQUE`.

### Desenvolvimento

Em execução local normal, o banco é armazenado em:

```text
data/database.sqlite
```

### Testes

Durante os testes, é utilizado um banco SQLite em memória:

```text
:memory:
```

Isso evita que os testes modifiquem os dados reais da aplicação.

### Produção

Em produção, o diretório:

```text
/app/data
```

é montado em um volume persistente do Docker.

Dessa forma, o arquivo SQLite continua existindo mesmo quando o container da API é recriado.

---

## Tratamento de erros

A aplicação utiliza classes específicas para representar diferentes situações:

```text
ValidationError
ConflictError
UnsupportedMediaTypeError
PayloadTooLargeError
```

Esses erros são transformados em respostas HTTP apropriadas pela camada principal da aplicação.

Erros inesperados retornam:

```text
500 Internal Server Error
```

sem expor detalhes internos da aplicação ao cliente.

---

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
├── .dockerignore
├── .gitignore
├── Caddyfile
├── compose.yml
├── Dockerfile
├── package.json
└── README.md
```

---

## Arquitetura da aplicação

A aplicação é dividida por responsabilidades.

### `server.js`

Responsável por criar o servidor HTTP e iniciar a aplicação na porta configurada.

### `app.js`

Contém o fluxo principal das requisições, CORS, tratamento de erros e delegação para as rotas.

### `routes/`

Responsável por identificar e executar as rotas de cada recurso.

### `repositories/`

Responsável pela comunicação com o banco SQLite.

### `validators/`

Responsável pela validação dos dados recebidos.

### `utils/`

Contém funções reutilizáveis relacionadas ao protocolo HTTP, como leitura do body e envio de respostas JSON.

### `errors/`

Contém as classes de erro utilizadas pela aplicação.

---

## Arquitetura de produção

A aplicação está hospedada em uma VM da Oracle Cloud Infrastructure.

```text
Internet
   │
   │ HTTPS :443
   ▼
┌─────────────┐
│    Caddy    │
│ Reverse     │
│ Proxy       │
└──────┬──────┘
       │
       │ Docker network
       ▼
┌─────────────────────┐
│ Node HTTP Users API │
│      :3000          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│       SQLite        │
│  Docker Volume      │
└─────────────────────┘
```

A porta `3000` da aplicação é utilizada internamente entre os containers.

O acesso público ocorre através do Caddy nas portas:

```text
80
443
```

---

## Docker

A aplicação possui uma imagem própria baseada em Node.js.

Para construir e iniciar localmente:

```bash
docker compose up -d --build
```

Verificar containers:

```bash
docker compose ps
```

Visualizar logs:

```bash
docker compose logs -f
```

Parar:

```bash
docker compose down
```

O comando acima mantém o volume persistente.

Para remover também os volumes:

```bash
docker compose down -v
```

> Atenção: utilizar `-v` remove também o volume que contém o banco SQLite.

---

## Reverse proxy e HTTPS

O Caddy é executado em um container separado e atua como reverse proxy.

Fluxo:

```text
HTTPS request
      ↓
    Caddy
      ↓
   api:3000
      ↓
 Node.js API
```

O `Caddyfile` atual aponta o domínio público para o serviço interno da API.

Além do reverse proxy, o Caddy gerencia automaticamente os certificados TLS utilizados pelo endpoint HTTPS.

---

## Executando sem Docker

Clone o projeto:

```bash
git clone https://github.com/davi-amaraldev/node-http-users-api.git
cd node-http-users-api
```

A aplicação não possui dependências externas de runtime.

Inicie em modo de desenvolvimento:

```bash
npm run dev
```

Ou:

```bash
npm start
```

Por padrão:

```text
http://localhost:3000
```

---

## Porta

A aplicação utiliza a variável de ambiente:

```text
PORT
```

Quando ela não é definida, utiliza:

```text
3000
```

Exemplo:

```bash
PORT=8080 npm start
```

O servidor escuta em:

```text
0.0.0.0
```

permitindo execução em containers e ambientes de hospedagem.

---

## Testes

Os testes utilizam as ferramentas nativas:

```text
node:test
node:assert
```

Execute:

```bash
npm test
```

Atualmente a suíte possui testes unitários e de integração HTTP cobrindo comportamentos como:

* validação de usuários
* validação de IDs
* criação
* busca por ID
* atualização parcial
* remoção
* persistência
* rotas inexistentes
* roteamento estrito
* métodos HTTP não permitidos
* header `Allow`
* email duplicado
* `Content-Type` inválido
* CORS
* preflight
* respostas HTTP

Os testes de integração iniciam um servidor HTTP real em uma porta temporária e fazem requisições utilizando `fetch`.

---

## Deploy

O projeto está atualmente executando em:

```text
Oracle Cloud Infrastructure
```

O processo de deploy utiliza:

```text
GitHub
   ↓
Oracle Compute VM
   ↓
Docker Compose
   ├── API
   └── Caddy
```

Atualizações podem ser publicadas na VM através de:

```bash
git pull
docker compose up -d --build
```

O volume do SQLite permanece preservado entre os deploys.

---

## Por que utilizar `node:http`?

Frameworks como Express e Fastify abstraem grande parte do trabalho necessário para construir um servidor HTTP.

Neste projeto, a proposta foi implementar essas responsabilidades diretamente utilizando as APIs fornecidas pelo Node.js.

Durante o desenvolvimento foram explorados conceitos como:

* request e response
* métodos HTTP
* headers
* status codes
* streams
* async iteration
* leitura de body
* limite de payload
* serialização JSON
* parsing de URLs
* roteamento
* rotas estritas
* CORS
* validação
* persistência
* constraints do banco
* tratamento de erros
* testes unitários
* testes de integração HTTP
* separação de responsabilidades
* containerização
* volumes persistentes
* reverse proxy
* HTTPS
* deploy em cloud

O objetivo não é substituir frameworks modernos, mas compreender melhor os mecanismos que eles abstraem.

---

## Objetivo do projeto

Este projeto faz parte dos meus estudos de desenvolvimento back-end e engenharia de software.

A aplicação começou como um servidor básico utilizando `http.createServer()` e evoluiu progressivamente para uma API REST completa com:

```text
HTTP nativo
→ CRUD
→ validação
→ SQLite
→ tratamento de erros
→ roteamento
→ testes
→ Docker
→ persistência em volume
→ cloud
→ reverse proxy
→ HTTPS
```

O projeto busca demonstrar não apenas a implementação de um CRUD, mas a compreensão das camadas envolvidas entre uma requisição HTTP e uma aplicação back-end executando em produção.

---

## Licença

Este projeto está disponível para fins de estudo e aprendizado.
