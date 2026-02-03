# Decisões de Implementação

## Arquitetura Geral

### Separação Backend/Frontend
- **Backend (API)**: Fastify server na porta 3001
- **Frontend**: Next.js na porta 49025
- **Comunicação**: REST API com JSON

---

## Backend (API)

### Framework: Fastify
**Decisão**: Utilizar Fastify
**Justificação**:
- **Requisito Implícito**: Pré-existente nas dependências do projeto inicial.

### Base de Dados: MongoDB
**Decisão**: MongoDB com driver oficial
**Justificação**:
- **Requisito**: Requisito do exercicio.

### Estrutura de Dados - Favoritos

{
  lineId: string,
  createdAtUnix: number,        // UnixTimestamp em milissegundos
  createdAtOperationalDate: string  // OperationalDate (formato: yyyyMMdd)
}


**Decisão**: Usar `Dates.now('utc')` da biblioteca TML
**Justificação**:
- **Requisito**: Cumpre o requisito obrigatório de usar a biblioteca `@tmlmobilidade/utils`.

### Proxy de API Externa
**Decisão**: Criar endpoint `/api/lines` que faz proxy para a API da Carris Metropolitana
**Justificação**:
- **Performance**: Implementação de cache in-memory (5 min) reduz drasticamente chamadas externas e latência.

### Gestão de Erros
**Decisão**: Tratamento de erros específico por tipo
**Justificação**:
- **Clareza**: Códigos HTTP semânticos (409, 404, 400) permitem ao frontend reagir adequadamente (ex: não tentar adicionar duplicado).

---

## Frontend (Next.js)

### Componentes TML UI
**Decisão**: Usar `Button` e `Text` da `@tmlmobilidade/ui`
**Justificação**:
- **Requisito**: Cumpre a obrigatoriedade de usar componentes da biblioteca proprietária.

### UI Otimista (Optimistic UI)
**Decisão**: Atualizar UI imediatamente ao clicar em favorito
**Justificação**:
- **Percepção de Performance**: A interface responde instantaneamente ao clique, parecendo "zero latency".
- **Resiliência**: O estado é revertido automaticamente se a operação no servidor falhar (rollback).

### Navegação para Site CM
**Decisão**: `window.open()`
**Justificação**:
- **Isolamento**: Mantém a aplicação original aberta, prevenindo perda de contexto do utilizador.
- **Simplicidade**: Método nativo do browser, sem dependências de routing complexas.

### Caching
**Decisão**: Cache in-memory simples para linhas (5 minutos)
**Justificação**:
- **Estabilidade**: Os dados das linhas (nomes, percursos) mudam muito raramente.
- **Eficiência**: Serve múltiplos utilizadores a partir de um único pedido à origem.
- **Simplicidade**: Implementação com zero dependências externas (sem Redis), ideal para a escala atual.

---

## Requisitos Atendidos

### ✅ Funcionalidades
1. **Listagem de Linhas**: Consumo da API pública CM
2. **Visualização**: Interface com grid responsivo
3. **Favoritar/Desfavoritar**: Com persistência MongoDB
4. **Navegação**: Click abre site CM em nova aba

### ✅ Requisitos Técnicos
1. **TML UI**: Componentes `Button`, `Text`
2. **TML Utils**: `Dates.now('utc')` para timestamps
3. **MongoDB**: Persistência com Docker
4. **Timestamps**: `unix_timestamp` e `operational_date`
5. **Separação**: API e Frontend claramente separados
6. **Código**: Organizado, modular, com responsabilidades únicas

---

## Melhorias Futuras (Fora do Scope)

1. **Autenticação**: Favoritos por utilizador
2. **Testes**: Unit tests e E2E tests
3. **Filtros**: Pesquisa e filtros por município
4. **Ordenação**: Por nome, número, favoritos
5. **Paginação**: Para grandes volumes de dados
6. **PWA**: Funcionalidade offline
7. **Analytics**: Tracking de linhas mais favoritadas
8. **Notificações**: Alertas sobre linhas favoritas

