# GoPet Frontend (MVP)

Interface web que apresenta a visão completa do app de transporte de pets (tipo Uber) descrito no documento de arquitetura. O foco é validar fluxos principais (Tutor, Motorista, Admin e Suporte), simulando dados em tempo real, preços e incidentes.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS 3** com tema customizado, cartões em vidro e layout responsivo
- **Zustand** para estado/mocks (pets, corridas, chat, incidentes, tickets)
- **React Router 6** para as 5 rotas principais (`/`, `/tutor`, `/driver`, `/admin`, `/support`)
- **Recharts + date-fns** para métricas e timeline

## Scripts

```bash
npm install          # instala dependências
npm run dev          # sobe Vite em modo desenvolvimento
npm run build        # compila para produção (dist/)
npm run preview      # serve build de produção
npm run lint         # validação eslint
```

## Integração com API, mocks e realtime

- Copie `.env.example` para `.env` e configure `VITE_API_BASE_URL` (por padrão `/api`). Em produção, aponte para o gateway NestJS (ex.: `https://api.gopet.com/api`).
- Em desenvolvimento usamos **MSW (Mock Service Worker)** que intercepta `/api` e expõe os endpoints `GET /dashboard`, `POST /rides`, `POST /rides/:id/messages` e `POST /incidents`, reutilizando os mesmos seeds do domínio.
- Para testar contra o backend real basta parar o service worker (botão “Mocking enabled” no DevTools ou removendo `VITE_API_BASE_URL` customizado) e garantir CORS habilitado.
- O `appStore` consome esses endpoints e mantém fallback local caso a chamada falhe, assegurando experiência offline/demo.
- `simulateRideLifecycle` segue disponível até que o canal WebSocket/SSE real seja plugado.

## Estrutura

```
src/
 ├─ components/      # Navegação, cards, timeline, chat, mapa etc.
 ├─ pages/           # Landing + painéis Tutor, Motorista, Admin, Suporte
 ├─ data/mock.ts     # Seeds e tabelas de referência (pets, drivers, pricing...)
 ├─ store/appStore.ts# Estado global + ações (criar corrida, simular lifecycle)
 ├─ types/           # Tipagens de domínio (Ride, Pet, Incident...)
 └─ utils/           # Formatadores (currency, time, ids)
```

## Funcionalidades implementadas

- **Landing** – hero com proposta de valor, KPIs, categorias, cronograma tech e roadmap.
- **Tutor** – formulário completo de solicitação (origem/destino/horário/notas), seleção de pet, cálculo estimado, mapa, timeline ao vivo, chat tutor/motorista, carteira e suporte.
- **Motorista** – fila de ofertas com status, ganhos semanais, checklist interativo, corrida ativa com SLA e painel de compliance/treinamentos.
- **Admin** – cards de SLA/cancelamento, ajuste de regras de preço, gráfico de matching p95, runbook e feed de incidentes/tickets.
- **Suporte** – registro manual de incidentes, fila de tickets, SOS priorizado e atalhos de atendimento (chat/voz mascarada).

## Próximos passos sugeridos

1. Conectar as ações do `appStore` com APIs reais (NestJS) e WebSockets para substituir mocks.
2. Implementar autenticação real (OAuth2/OIDC) e proteger rotas sensíveis.
3. Evoluir gráficos/tabelas com dados vindos de observabilidade/pagamentos.
4. Ajustar chunk splitting de build (`vite.config.ts`) se o bundle ultrapassar o limite padrão (aviso exibido no `npm run build`).

> Projeto pronto para ser publicado em ambientes estáticos (Vercel/Netlify/CloudFront) e servir como referência visual durante o desenvolvimento dos apps mobile.*** End Patch``` to=functions.apply_patch
