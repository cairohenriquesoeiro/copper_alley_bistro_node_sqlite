# Copper Alley Bistro

Copper Alley Bistro é um projeto full-stack de site de restaurante com frontend responsivo e sistema de reservas.

## Visão geral

- Frontend estático em `frontend/index.html`
- Backend em Node.js com Express, usando SQLite para persistência de reservas
- Reserva de mesa com formulário e lista de reservas atualizadas dinamicamente
- API REST para consultar, criar e excluir bookings
- Site responsivo e adaptado para desktop e mobile

## Tecnologias

- Node.js
- Express
- SQLite (`better-sqlite3`)
- HTML/CSS/JavaScript puro
- CORS para permitir chamadas API locais

## Executando o projeto

1. Abra o terminal na pasta do projeto
2. Navegue para `backend`

```bash
cd backend
npm install
npm start
```

3. Abra o navegador em:

```text
http://localhost:3000
```

O frontend é servido diretamente pelo backend a partir de `../frontend`.

## Rotas da API

- `GET /api/bookings`
  - Retorna todas as reservas cadastradas
- `POST /api/bookings`
  - Cria uma nova reserva
  - Campos obrigatórios: `name`, `email`, `phone`, `guests`, `date`, `time`
- `DELETE /api/bookings/:id`
  - Remove uma reserva existente pelo `id`

## Estrutura de pastas

- `backend/`
  - `server.js` — servidor Express e roteamento
  - `db.js` — gerenciamento do banco SQLite
  - `package.json` — dependências e scripts
  - `copper_alley.db` — banco de dados SQLite
- `frontend/`
  - `index.html` — página principal e interface de reservas
  - `app.js` — lógica de frontend para reservas e chamadas API
  - `assets/` — imagens usadas pelo site

## Observações

- Não comitar `backend/node_modules/` — use `.gitignore`
- O site já inclui recurso de reserva com confirmação e histórico de reservas
- Para produção, recomenda-se adicionar otimização de imagens e minificação de assets
