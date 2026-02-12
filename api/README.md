# GoPet API (NestJS)

Backend mínimo em NestJS para dar suporte ao frontend (dashboard e apps Tutor/Motorista). Mantém dados in-memory e expõe os mesmos endpoints utilizados pelo `webapp`, facilitando a substituição futura por Postgres/Redis.

## Stack

- NestJS 11 (Node 20+) com prefixo global `/api`
- DTOs validadas via `class-validator`
- Seeds baseados no documento do produto (pets, drivers, rides, incidents…)
- Testes E2E com Jest + Supertest

## Scripts

```bash
npm install        # instala dependências
npm run start:dev  # modo watch (porta 3333)
npm run start      # produção local
npm run test:e2e   # roda testes end‑to‑end básicos
npm run prisma:migrate  # aplica migrations (Postgres)
npm run prisma:generate # regenera client Prisma
```

> `npm run test` não possui specs unitários ainda; use `test:e2e` para validar o fluxo principal.

## Endpoints

Todos estão sob `/api`.

| Método | Caminho | Descrição |
| ------ | ------- | --------- |
| `GET`  | `/dashboard` | Snapshot completo (pets, drivers, rides, tickets, incidents, mensagens) |
| `POST` | `/rides` | Cria uma corrida (`tutorName`, `petId`, `category`, `pickupAddress`, `destinationAddress`, `scheduledAt`, `notes?`) |
| `POST` | `/rides/:id/messages` | Registra mensagem tutor/motorista/suporte para o ride informado |
| `POST` | `/incidents` | Abre incidente com severidade/status |
| `GET`  | `/drivers` | Lista todos os motoristas cadastrados (mock ou Postgres) |
| `POST` | `/drivers` | Cria um motorista com dados de KYC e veículo |
| `GET`  | `/drivers/:id` | Detalha um motorista |
| `PATCH` | `/drivers/:id/status` | Atualiza status do onboard (`PENDING`, `APPROVED`, etc.) |
| `POST` | `/uploads` | Recebe arquivos (CNH/foto) e retorna a URL servida em `/uploads/...` |

As respostas refletem o mesmo formato usado pelo frontend (`Ride`, `Incident`, `ChatMessage` etc.). Os IDs são gerados via `randomUUID` e armazenados em memória.

## Integração com o front

1. Suba o backend (`npm run start:dev`). Ele escuta por padrão em `http://localhost:3333`.
2. No `webapp`, crie `.env` e defina `VITE_API_BASE_URL=http://localhost:3333/api`.
3. Opcionalmente desabilite o MSW (botão “Mocking enabled” no DevTools) para garantir que as requisições atinjam o backend real.
4. O frontend continuará usando `simulateRideLifecycle` para animar o estado até que o canal realtime seja implementado.

## Drivers + Postgres

- O projeto já vem com `prisma/schema.prisma` configurado para **PostgreSQL** e scripts (`npm run prisma:migrate`, `npm run prisma:generate`).
- Configure `DATABASE_URL` no `.env` (veja `.env.example`) e rode `npm run prisma:migrate` para criar a tabela `Driver`.
- Defina `DRIVER_STORAGE=postgres` para que o módulo de motoristas use o repositório Prisma. Caso contrário, um repositório em memória (com seeds) é usado.
- Os endpoints `/drivers` funcionam com ambos os storages, mantendo o mesmo contrato usado pelo dashboard.

## Execução com Docker

Há um `docker-compose.yml` na raiz que sobe Postgres + API:

```bash
# build e subir os serviços
docker compose up --build -d

# aplicar migrations dentro do container da API
docker compose exec api npx prisma migrate deploy
```

- A API fica disponível em `http://localhost:3333`.
- O Postgres expõe a porta `5432` (usuário/senha `postgres`).
- As variáveis `DATABASE_URL` e `DRIVER_STORAGE=postgres` já são passadas no serviço `api`.
- A pasta `api/uploads` é montada no container e exposta como `/uploads/...`, usada pelos anexos de CNH/foto enviados em `/uploads`.

## Próximos passos

- Persistir dados em Postgres + Prisma (versão futura).
- Implementar autenticação (OAuth2/OIDC) e RBAC.
- Adicionar endpoints adicionais (`GET /rides`, `PATCH /rides/:id/status`, webhooks de pagamento etc.).
