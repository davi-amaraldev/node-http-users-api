# Node HTTP Users API

API CRUD de usuários desenvolvida com JavaScript e o módulo nativo `node:http`.

## Funcionalidades

- Listar usuários
- Buscar usuário por ID
- Criar usuário
- Substituir usuário
- Atualizar parcialmente um usuário
- Remover usuário

## Rotas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Página inicial |
| GET | `/users` | Lista os usuários |
| GET | `/users/:id` | Busca um usuário |
| POST | `/users` | Cria um usuário |
| PUT | `/users/:id` | Substitui um usuário |
| PATCH | `/users/:id` | Atualiza campos de um usuário |
| DELETE | `/users/:id` | Remove um usuário |

## Executando

```bash
npm run dev