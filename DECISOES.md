# Decisões Técnicas

## Como arrancar

```bash
docker compose up -d   # MongoDB em localhost:37001
cp .env.example .env   # já com as credenciais do compose.yml
npm install            # raiz; o npm workspaces apanha tudo
npm run dev            # arranca API (49026) + Frontend (49025) via Turbo
```

Abre `http://localhost:49025`.

---

## Visão geral

Monorepo Turbo com dois apps:

- `apps/api` — Fastify (ESM, NodeNext) que expõe `/favorites` e fala com MongoDB.
- `apps/frontend` — Next.js 15 (App Router, React 19) que consome a API pública da Carris e a nossa API.

A separação é estrita: nada no `frontend` importa de `api`. Optei por **não criar** um `packages/shared` para tipos partilhados — os únicos tipos sobrepostos (`Favorite`, `Line`) são triviais e duplicar 8 linhas é mais barato do que introduzir um workspace adicional só por isso.

---

## Backend

### Driver MongoDB nativo (em vez de Mongoose)
A schema do favorito tem 3 campos. O Mongoose introduzia uma camada de schema, hidratação de documentos e dependências adicionais sem benefício real. O driver `mongodb` nativo dá-me:
- Tipagem genérica (`Collection<Favorite>`) suficiente
- Controlo direto sobre o `unique index` em `line_id`, que materializa o requisito *"cada favorito deve ser um objeto único na base de dados"*
- Menos peso e zero magia

### Forma do documento
```ts
{
  line_id: string,                  // chave de negócio, com unique index
  created_at: UnixTimestamp,        // ms desde epoch (Dates.now().unix_timestamp)
  operational_date: OperationalDate // "yyyyMMdd" (Dates.now().operational_date)
}
```

- Apenas guardo `line_id`, **não** o snapshot da linha. A fonte de verdade da linha é a API pública da CM; duplicar nome/cor/etc. levaria a divergência sem necessidade.
- `created_at` e `operational_date` são derivados via `Dates.now('Europe/Lisbon')` da `@tmlmobilidade/utils` — o requisito menciona explicitamente os dois e a `Dates` é o caminho idiomático.
- Timezone `Europe/Lisbon` porque a operação CM é em Portugal: a `operational_date` define o "dia de operação" (relevante p.ex. para serviços noturnos que cruzam a meia-noite e ainda contam como o dia anterior). Tipo definido `as const` para o TypeScript aceitar a string como `TimezoneIdentified`.
- Os tipos `UnixTimestamp` e `OperationalDate` são os branded types exportados por `@tmlmobilidade/types` — a `Dates` já devolve o branded type, por isso a tipagem flui sem casts.

### POST `/favorites` é idempotente
Uso `updateOne({ line_id }, { $setOnInsert: favorite }, { upsert: true })` em vez de `insertOne`. Razões:
- Se o utilizador clicar duas vezes na estrela, o segundo POST não levanta `E11000 duplicate key` ao nível da rede.
- Mantém-se a `created_at` original (não a sobrescreve em re-pedidos).
- O `unique index` continua a ser a garantia *real* de unicidade ao nível dos dados.

Validei isto no teste: dois POSTs consecutivos de `line_id: "1234"` devolveram exatamente o mesmo `created_at: 1777299477777`.

### Connection-pool singleton
`db/mongo.ts` mantém um único `MongoClient`. Funções subsequentes pedem a coleção via `favoritesCollection()`. Isto evita conexões por pedido (custo desnecessário em latência) e simplifica o `ensureIndexes()` (corre uma vez no arranque).

### CORS — múltiplas origens e métodos explícitos
A configuração lê `API_CORS_ORIGIN` como **lista separada por vírgulas** (em vez de uma única origem). Suporta dev local, staging e produção sem código novo.

Tive de declarar **explicitamente** os métodos permitidos:
```ts
await app.register(cors, {
  methods: ['GET', 'POST', 'DELETE'],
  origin: config.cors_origin,
});
```
Sem isto, o `@fastify/cors` deduzia os métodos a partir das rotas registadas para o caminho do preflight (`/favorites`) e respondia `GET, HEAD, POST` — omitindo o `DELETE` (que vive em `/favorites/:line_id`). Detetei o problema no browser: o preflight devolvia 204 sem `DELETE` no `Access-Control-Allow-Methods`, e a remoção do favorito falhava só em alguns casos. Ser explícito remove a ambiguidade.

### Logger pino-pretty
Já vinha como dependência. Configurado de forma minimal para output legível em dev.

### Shutdown limpo
`SIGINT`/`SIGTERM` fecham Fastify e MongoClient antes de sair. Não é crítico em dev, mas é boa higiene e cabe em 6 linhas.

### Validação de input
Validação manual (`typeof line_id !== 'string' || line_id.trim() === ''`) com 400 em caso de falha. Para um endpoint com um campo, montar zod + `@fastify/type-provider-zod` seria desproporcional; com mais 2 endpoints já valeria a pena.

---

## Frontend

### Next.js App Router + componente client único
`app/page.tsx` é `'use client'` porque consome SWR (hooks). O `layout.tsx` foi mantido **intocável** como pedido — toda a configuração de tema e providers vive lá. O `ThemeContextProvider` da TML já inclui `MantineProvider`, `ModalsProvider` e `Notifications`, por isso o `useToast` funciona sem mais setup.

### SWR para data fetching
Já estava instalado. Uso para os dois fluxos:
- `useLines()` → CM API. Configurada com `revalidateIfStale: false` + `revalidateOnFocus: false` porque a lista de linhas muda raramente; cache agressivo poupa requests (são 715 linhas no payload).
- `useFavorites()` → nossa API. Os toggles fazem `mutate` **otimista** com `rollbackOnError: true` — UX imediato (a estrela enche/esvazia sem esperar a rede), mas se a chamada falhar o estado volta atrás e mostra um toast de erro.

### Componentes da TML usados
Mais do que o mínimo (1) pedido:
- `ActionIcon` (variantes `warning` / `muted`) — botão de favorito.
- `Loader` — estado de loading da lista.
- `useToast` — feedback de erro nos toggles. **Não é um hook** apesar do nome — é uma instância singleton (`new Toast()`), por isso usa-se directamente como `useToast.error(...)` e não `const t = useToast(); t.error(...)`.

Os ícones de estrela vêm de `@tabler/icons-react` (também já instalado).

### Cor do card = identidade da linha
Cada linha da CM tem `color` e `text_color` próprios. O `LineCard` usa-os no fundo e texto, replicando a identidade visual oficial. O badge interno **inverte** as cores (fundo = `text_color`, texto = `color`) para destacar o `short_name` com bom contraste em qualquer linha.

### Navegação para o site da CM
Cada card é um `<a href="https://www.carrismetropolitana.pt/lines/{id}">` (mesma aba, conforme "redirecionar" no enunciado). O `FavoriteButton` faz `event.preventDefault()` + `event.stopPropagation()` para que clicar na estrela não dispare a navegação. URL gerada em `lib/env.ts` para ficar centralizada e fácil de mudar.

### Secção "Favoritas" no topo
Quando há favoritos, surge uma secção dedicada acima da lista completa — assim o feature de favoritar passa a ter utilidade real (atalho rápido) e não fica só "dois cliques sem consequência visível". Só aparece se houver pelo menos um favorito, para não criar ruído quando está vazia.

### CSS modules
Sem Tailwind no projeto. CSS modules são suportados out-of-the-box pelo Next, são scoped por ficheiro e compõem bem com os componentes da Mantine (que o `@tmlmobilidade/ui` usa por baixo).

---

## Variáveis de ambiente

```env
MONGO_URI=mongodb://root:root@localhost:37001/?authSource=admin
MONGO_DB=production
API_PORT=49026
API_CORS_ORIGIN=http://localhost:49025   # podem ser várias separadas por vírgula
NEXT_PUBLIC_API_BASE_URL=http://localhost:49026
```

- O `dotenv-run` da raiz carrega `.env` antes do Turbo arrancar, e o Turbo (com `envMode: "loose"` já configurado) propaga para os apps.
- Porta 49026 escolhida para o backend para simetria com a 49025 do frontend e evitar choque com portas comuns.
- O prefixo `NEXT_PUBLIC_` é obrigatório para o Next.js expor a variável ao browser.

---

## Verificação end-to-end realizada

Tudo testado contra a stack real (Mongo via Docker + API + frontend):

1. **API + Mongo via curl/mongosh:**
   - `GET /favorites` em base vazia → `[]`
   - `POST /favorites { line_id: "1001" }` → 201 com `created_at` e `operational_date: "20260427"`
   - `POST` repetido para o mesmo `line_id` → mesmo `created_at` (idempotência ✓)
   - `POST { }` (sem `line_id`) → 400 com mensagem de erro
   - `GET /favorites` → ordenado por `created_at` desc
   - `DELETE /favorites/1001` → 204
   - `DELETE /favorites/1001` (já apagado) → 404
   - `db.favorites.getIndexes()` → confirmado `unique: true` em `line_id`
   - Tentar `db.favorites.insertOne({ line_id: "x", … })` duas vezes → rejeitado com erro `11000` (unique constraint ✓)

2. **Frontend no browser (Playwright headless):**
   - Página renderiza header, subtítulo, e secção "Todas as linhas (715)"
   - Cards mostram `short_name`, `long_name` truncado com ellipsis, estrela vazia
   - Cor de fundo de cada card respeita o `color` da linha; texto respeita `text_color`
   - `useFavorites` mostra banner de erro tratado quando a API não responde

3. **Ciclo completo POST/DELETE através do browser (com CORS real):**
   - `fetch('http://…/favorites')` antes/depois de POST e DELETE bate com o estado em Mongo
   - Idempotência confirmada também via browser (`created_at` igual em dois POSTs consecutivos)

4. **Lint + type-check (`npm run lint` na raiz):**
   - Ambos os packages passam `eslint . && tsc --noEmit`

---

## O que ficou de fora (e porquê)

- **Testes automatizados** — não pedidos; a superfície é pequena e o esforço seria desproporcional. Em produção adicionaria pelo menos um teste de integração para a API com `mongodb-memory-server` e um Playwright básico para o toggle de favorito.
- **Search/filter na lista de linhas** — não pedido. A secção "Favoritas" no topo dá utilidade real ao feature; um filtro seria uma extensão natural mas fora do âmbito.
- **Auth/rate-limit** — não pedidos; a app é local.
- **Validação com zod** — para 1 endpoint com 1 campo, validação manual é suficiente.
- **Package partilhado de tipos** — overhead injustificado para 2 interfaces.
- **Variantes de tema dark/light** — `ThemeContextProvider` da TML já dá suporte; a UI funciona nas duas. Não criei um toggle dedicado por não ser pedido.
