# Grav — Backend API

API de gerenciamento de treinos. Permite criar treinos, associar exercícios, registrar séries e gerenciar autenticação de usuários.


---

## Deployment
A API está hospedada na DigitalOcean em uma Droplet e acessível em:
URL Base: https://grav-treino.tech

## Estado da API

Verifique se a API está operacional em:

🔗 **[https://grav-treino.tech/health](https://grav-treino.tech/health)**

---

---

## Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT (access token + refresh token)
- **Validação:** Zod
- **Segurança:** Helmet, CORS, express-rate-limit
- **Containerização:** Docker

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados

---

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/Gabriel-zet/workout-repo.git
cd workout-repo
```

2. Crie o arquivo `.env` na raiz do projeto com base no exemplo:

```bash
cp .env.example .env
```

3. Preencha as variáveis no `.env`:

```dotenv
PORT=3000

DB_USER="your-user"
DB_PASSWORD="your-secure-password"
DB_NAME="grav_db"
DATABASE_URL="postgresql://your-user:your-secure-password@db:5432/grav_db?schema=public"

# JWT Config
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="1d"
```

4. Suba os containers:

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000`.

---

## Endpoints

> Rotas marcadas com 🔒 exigem autenticação via Bearer Token no header `Authorization`.

---

## Rate Limiting

A API possui dois níveis de rate limiting:

| Limiter | Rotas | Janela | Limite |
|---------|-------|--------|--------|
| **Global** | Todas | 15 min | 100 req/IP |
| **Auth** | `/auth/login`, `/auth/register` | 15 min | 5 req/IP |

> O limiter de auth ignora requisições bem-sucedidas.



### Auth — `/auth`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/register` | Cadastro de usuário | ❌ |
| `POST` | `/auth/login` | Login — retorna access e refresh token | ❌ |
| `POST` | `/auth/logout` | Logout do usuário autenticado | 🔒 |
| `POST` | `/auth/refresh` | Renovação do access token via refresh token | ❌ |

> As rotas de login e registro possuem **rate limit** para prevenção de abusos.

---

### Usuário — `/me`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/me` | Retorna os dados do usuário autenticado | 🔒 |

---

### Treinos — `/workouts`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/workouts/create` | Cria um novo treino | 🔒 |
| `GET` | `/workouts/list` | Lista os treinos do usuário | 🔒 |
| `GET` | `/workouts/profile/:id` | Busca um treino pelo ID | 🔒 |
| `PUT` | `/workouts/profile/:id` | Atualiza um treino pelo ID | 🔒 |
| `DELETE` | `/workouts/delete/:id` | Remove um treino pelo ID | 🔒 |

---

### Exercícios — `/exercises`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/exercises` | Cria um exercício | 🔒 |
| `GET` | `/exercises` | Lista todos os exercícios | 🔒 |
| `DELETE` | `/exercises/:id` | Remove um exercício pelo ID | 🔒 |

---

### Exercícios do Treino — `/workout-exercises`

Associa exercícios a um treino específico.

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/workout-exercises` | Associa um exercício a um treino | 🔒 |
| `GET` | `/workout-exercises/workout/:workoutId` | Lista os exercícios de um treino | 🔒 |
| `DELETE` | `/workout-exercises/:id` | Remove uma associação pelo ID | 🔒 |

---

### Séries (Sets) — `/sets`

As séries pertencem a um `WorkoutExercise`. Ownership é validado via `workout.userId`.

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/workout-exercises/:workoutExerciseId/sets` | Cria uma série em um exercício do treino | 🔒 |
| `GET` | `/workout-exercises/:workoutExerciseId/sets` | Lista as séries de um exercício do treino | 🔒 |
| `PUT` | `/workout-exercises/:workoutExerciseId/sets/:setId` | Atualiza uma série | 🔒 |
| `DELETE` | `/workout-exercises/:workoutExerciseId/sets/:setId` | Remove uma série | 🔒 |

---

## Arquitetura

```
backend/
├── docs/
│   └── erd.md                  # Diagrama entidade-relacionamento
├── prisma/                     # Schema e migrations do Prisma
├── src/
│   ├── @types/                 # Tipagens globais TypeScript
│   ├── controllers/            # Handlers das rotas
│   ├── database/               # Configuração da conexão com o banco
│   ├── middlewares/
│   │   ├── ensureAuth.ts       # Validação do JWT
│   │   ├── errorHandler.ts     # Tratamento centralizado de erros
│   │   ├── rateLimiter.ts      # Rate limit nas rotas de auth
│   │   ├── validateIdParam.ts  # Validação de parâmetros de ID
│   │   └── validateRequest.ts  # Validação de body via Zod
│   ├── repositories/           # Acesso ao banco via Prisma
│   ├── routes/                 # Definição das rotas por domínio
│   ├── schemas/                # Schemas de validação Zod
│   ├── services/               # Lógica de negócio
│   └── server.ts               # Entry point do servidor

```

> A estrutura segue separação por responsabilidade, com middlewares de segurança aplicados na camada de rota.

---

## Segurança

- Headers HTTP protegidos via **Helmet**
- **Rate limit** nas rotas de autenticação
- **CORS** configurado
- Senhas com hash via **bcrypt**
- Autenticação stateless via **JWT**
- Validação de entrada com **Zod**

---
