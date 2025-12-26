# Decisões técnicas

## Frontend
- Listagem de linhas obtida a partir da API pública `https://api.carrismetropolitana.pt/v2/lines`.
- Utilizado o componente **Button** da biblioteca `@tmlmobilidade/ui`.
- Redirecionamento para o site oficial feito com `https://carrismetropolitana.pt/lines/${line.id}` (o campo `id` da API corresponde ao identificador usado no site).
- Botão de favorito/desfavoritar implementado com emoji (❤️ / ♡)
- Chamadas ao backend feitas diretamente para `http://localhost:3001` devido à arquitetura Turborepo (apps frontend e api em portas separadas).
- Código organizado em componente único `page.tsx`

## Backend
- Implementado servidor Express completo com Mongoose para interação com o MongoDB.
- Model `Favorite` com:
  - `lineId` (String, required, unique) – garante objeto único por linha.
  - `createdAtUnix` (Number) – UnixTimestamp em milissegundos, gerado com `Dates.now('utc').unix_timestamp`.
  - `operationalDate` (String) – data operacional no formato yyyyMMdd, gerada com `Dates.now('utc').operational_date`.
- Utilizada a classe **Dates** da biblioteca `@tmlmobilidade/utils`
- Rotas RESTful: GET, POST e DELETE /favorites.
- Conexão ao MongoDB com `mongodb://127.0.0.1:27001/testdb`

## Infraestrutura
- Instância MongoDB criada via `docker compose up -d` conforme o compose.yml fornecido.
- Separação clara entre frontend (Next.js/Turborepo) e api (Express) – comunicação via HTTP.

## Outras notas
- Persistência comprovada: favoritos mantêm-se após refresh da página, guardados corretamente no MongoDB com os campos required.
- Código modular, legível e com comentários onde necessário para facilitar manutenção.
