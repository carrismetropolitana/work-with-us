# Decisões Técnicas

## Arquitetura

API (Fastify) cuida dos favoritos + MongoDB. Frontend (Next.js) busca linhas direto da API pública da Carris e fala com a API interna só pra favoritos. Separação natural do Turborepo.

## MongoDB

Collection `favorites` com índice único em `line_id`. Timestamps (`createdAt`, `operationalDate`) gerados com `Dates.now('utc')` do `@tmlmobilidade/utils`. Conexão singleton — `connect()` roda uma vez no boot e a promise é reusada.

## Frontend

SWR pra fetch e cache (linhas + favoritos). `useFavorites` combina `useOptimistic` com `useTransition` pra toggle instantâneo. Tem um `useRef` pra estabilizar o callback e não forçar re-render nos cards toda vez que o SWR revalida.

Pesquisa e filtro de favoritas no hook `useLineFilter` — `useDeferredValue` pro input não travar com 700+ linhas.

`LineCard` é o único componente extraído (é usado N vezes na grid e é memoizado). O resto da UI vive no `page.tsx` porque não justifica ficheiros separados.

## Libs TML

`Button`, `TextInput` e `ThemeContextProvider` do `@tmlmobilidade/ui`. `Dates` do `@tmlmobilidade/utils`.

## API

Fastify + CORS (porta 49025). `GET`, `POST`, `DELETE` em `/favorites`. POST e DELETE validam input com JSON Schema do Fastify. Startup com `.catch()` pra logar erros de boot e morrer limpo.
