# 🔄 Skill Swap — Troca de Conhecimentos

Skill Swap é uma plataforma onde pessoas podem trocar conhecimentos entre si: você oferece uma habilidade que domina (ex.: Violão, Programação, Yoga) e busca aprender outra com alguém da comunidade. O sistema conecta usuários, gerencia propostas de troca (matches) e permite conversar em tempo real após o match ser aceito.

## ✨ Funcionalidades

- **Autenticação**: cadastro/login com e-mail e senha (JWT) ou login com Google (OAuth2)
- **Perfil de habilidades**: cada usuário cadastra habilidades que **oferece** e habilidades que **procura**, organizadas por categoria
- **Matches**: proponha trocas, aceite, recuse ou cancele solicitações
- **Avaliação**: dê like/dislike na sua interação após um match aceito
- **Chat em tempo real**: converse com seus matches via Socket.IO, com mensagens criptografadas ponta a ponta usando o protocolo Nostr (NIP-17 gift wrap / NIP-44)

## 🛠️ Tecnologias

**Frontend**
- React 19 + Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client
- react-hot-toast
- lucide-react (ícones)

**Backend**
- Node.js + Express 5
- Prisma ORM + PostgreSQL
- Socket.IO
- JSON Web Token (autenticação)
- bcrypt (hash de senhas)
- Google Auth Library (login social)
- nostr-tools (mensagens criptografadas)

**Infraestrutura**
- Docker e Docker Compose

## 📁 Estrutura do projeto

```
.
├── backend/
│   ├── modules/         # prisma client, auth, nostr, utils
│   ├── routes/          # rotas de auth, users, skills, category, match, chat
│   ├── sockets/         # eventos de chat em tempo real
│   ├── prisma/          # schema e migrations
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # componentes reutilizáveis (Cards, Modais, Header...)
│   │   ├── pages/       # páginas da aplicação (Login, Index, Matches, User...)
│   │   └── services/    # api.js e useSocket.js
│   └── vite.config.js
└── docker-compose.yml
```

## 🚀 Como rodar o projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados
- ou Node.js 20+ e uma instância PostgreSQL, caso queira rodar sem Docker

### Usando Docker (recomendado)

1. Clone o repositório
   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
   ```

2. Configure as variáveis de ambiente do backend
   ```bash
   cp backend/.env.example backend/.env
   ```
   Preencha o arquivo `backend/.env`:
   ```
   POSTGRES_USER=
   POSTGRES_DB=
   POSTGRES_PASSWORD=

   PORT=3000
   DATABASE_URL=postgresql://<user>:<senha>@db:5432/<db>
   PRIVATE_KEY=       # chave secreta usada para assinar os JWT
   CLIENT_ID=         # Client ID do Google OAuth
   ```

3. Suba os containers
   ```bash
   docker compose up --build
   ```

4. Rode as migrations do Prisma (dentro do container do backend, se necessário)
   ```bash
   docker compose exec backend npx prisma migrate deploy
   ```

5. Acesse:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:3000](http://localhost:3000)

### Sem Docker

**Backend**
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Lembre-se de criar um arquivo `.env` no frontend com a variável `VITE_SERVER_URL` apontando para o backend (ex.: `http://localhost:3000`).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](frontend/LICENSE) para mais detalhes.