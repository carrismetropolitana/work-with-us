# Decisões Técnicas

Este documento descreve as principais decisões técnicas tomadas durante o desenvolvimento do desafio.

## Arquitetura Geral

### Monorepo com Turborepo
O projeto já estava estruturado com **Turborepo**, o que permite:
- Execução simultânea das duas aplicações (`npm run dev`)
- Compartilhamento de configurações e dependências
- Build cache otimizado
- Escalabilidade futura (fácil adicionar mais packages)

### Separação API/Frontend
- **Backend**: `apps/api` - API REST independente
- **Frontend**: `apps/frontend` - Aplicação Next.js que consome a API
- Comunicação via HTTP REST, permitindo deploy separado e escalabilidade

---

## Backend (API)

### Framework: Fastify
Escolhi **Fastify** em vez de Express por:
- **Performance superior**: Até 2x mais rápido que Express
- **TypeScript nativo**: Melhor suporte e tipagem out-of-the-box
- **Arquitetura de plugins**: Modular e extensível
- **Logger integrado (Pino)**: Logs estruturados e performáticos
- **Validação automática**: Schema-based validation

### Banco de Dados: MongoDB + Mongoose
- **MongoDB**: Requisito do desafio, rodando via Docker
- **Mongoose**: ODM escolhido por oferecer:
  - Schema com validação de tipos
  - Índices automáticos (importante para `line_id` único)
  - Timestamps automáticos (`createdAt`, `updatedAt`)
  - API intuitiva para queries

### Estrutura do Model Favorite
```typescript
{
  line_id: string (único, indexado)
  created_at_unix: number (timestamp em segundos)
  created_at_operational_date: string (formato TML)
}
```

**Decisão**: Adicionar índice único em `line_id` para:
- Garantir que não haja favoritos duplicados
- Melhorar performance de buscas e validações
- Evitar race conditions

### Uso de @tmlmobilidade/utils
Utilizei `Dates.now('Europe/Lisbon')` para:
- **Consistência**: Mesmo formato usado em toda a organização
- **Timezone correto**: Garante fuso horário de Lisboa
- **Manutenibilidade**: Se o formato mudar, basta atualizar a lib

### API REST
Implementei 3 endpoints seguindo padrões REST:
- `GET /favorites` - Lista favoritos
- `POST /favorites` - Adiciona favorito (retorna 409 se já existe)
- `DELETE /favorites/:line_id` - Remove favorito

**Decisão**: Usar `line_id` como identificador na URL do DELETE em vez do `_id` do MongoDB, pois:
- Mais semântico (recurso é identificado pela linha)
- Frontend não precisa conhecer IDs internos do banco
- Melhor DX (Developer Experience)

### CORS e Segurança
- CORS habilitado para permitir requisições do frontend
- Health check endpoint (`/health`) para monitoramento

---

## Frontend (Next.js)

### Next.js 15 com App Router
- **App Router**: Nova arquitetura do Next.js, mais moderna
- **'use client'**: Necessário para componentes interativos com hooks
- **TypeScript**: Tipagem forte em todo o projeto

### Gerenciamento de Estado: SWR
Escolhi **SWR** (Stale-While-Revalidate) em vez de React Query ou Redux por:
- **Simplicidade**: API minimalista e intuitiva
- **Cache inteligente**: Revalidação automática em foco/reconexão
- **Optimistic UI**: Função `mutate` para atualizações instantâneas
- **Performance**: Cache compartilhado entre componentes
- **Desenvolvido pelo Vercel**: Integração perfeita com Next.js

### Optimistic UI Updates
Implementei atualizações otimistas ao favoritar/desfavoritar:
```typescript
// Remove da UI imediatamente
mutate(favorites?.filter(f => f.line_id !== line_id), false);
// Faz requisição
await removeFavorite(line_id);
// Revalida do servidor
mutate();
```
**Benefício**: UX mais responsiva, usuário vê mudanças instantaneamente

### Estrutura de Dados: Set para Favoritos
```typescript
const favoriteIds = new Set(favorites?.map(f => f.line_id) || []);
```
**Decisão**: Usar `Set` em vez de `Array.find()` porque:
- **Performance**: O(1) vs O(n) para verificar se linha é favorita
- **Escalabilidade**: Eficiente mesmo com muitos favoritos
- **Simplicidade**: `favoriteIds.has(line_id)` é mais legível

### Componente LineCard
Criei um componente reutilizável e encapsulado:
- **Responsabilidade única**: Renderizar uma linha
- **Props bem definidas**: `line`, `isFavorite`, `onToggleFavorite`
- **Interatividade**: Hover effects, click handlers
- **Acessibilidade**: Stop propagation no botão de favorito

### Design e UX

#### Grid Responsivo
```css
grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))
```
- Adapta automaticamente ao tamanho da tela
- Sem media queries, CSS puro
- Mínimo 350px por card (ideal para conteúdo)

#### Visual das Linhas
- **Badge colorido**: Usa cores reais das linhas (`color` e `text_color`)
- **Ícones Tabler**: Modernos, leves, e open-source
- **Hover feedback**: Sombra sutil ao passar mouse
- **Estados claros**: Coração preenchido vs vazio

#### Filtro de Favoritos
- Botão toggle usando `<Button />` da **@tmlmobilidade/ui** ✅
- Label dinâmico: "Mostrar Favoritos" ↔ "Mostrar Todas"
- Contador de linhas e favoritos visível

### Navegação Externa
Click no card abre página da linha no site da Carris Metropolitana:
```typescript
window.open(`https://www.carrismetropolitana.pt/lines/${line.id}`, '_blank')
```
- Nova aba (`_blank`) para não perder contexto
- `stopPropagation` no botão de favorito para não abrir link

---

## Integração com Bibliotecas TML

### @tmlmobilidade/ui
Utilizei o componente **`<Button />`** no filtro de favoritos, cumprindo o requisito de usar pelo menos 1 componente da UI Library.

**Por que só um componente?**
- Design customizado para match com o site da CM
- Liberdade criativa dentro dos requisitos
- Foco em funcionalidade e código limpo

### @tmlmobilidade/utils
Utilizei **`Dates.now()`** no backend para gerar timestamps consistentes:
- Requisito explícito do desafio
- Garante padronização com outros projetos da TML
- Timezone correto (Europe/Lisbon)

---

## DevOps e Ambiente

### Docker Compose
- MongoDB rodando em container isolado
- Porta 37001 (externa) mapeada para 27017 (interna)
- Credenciais configuradas via environment variables
- Restart automático (`unless-stopped`)

### Variáveis de Ambiente
**Backend**:
- `MONGODB_URI`: Conexão com MongoDB
- `API_PORT`: Porta do servidor (default: 5050)
- `API_HOST`: Host do servidor (default: 0.0.0.0)

**Frontend**:
- `NEXT_PUBLIC_API_URL`: URL da API (default: http://localhost:5050)
