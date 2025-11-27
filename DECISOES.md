### Solução
### Carris Metropolitana — Fullstack Application

Mini-aplicação Fullstack para listagem e gestão de linhas da Carris Metropolitana, implementada como parte do desafio técnico. A aplicação permite visualizar, favoritar/desfavoritar linhas e navegar para os detalhes no site oficial da CM.

O repositório inclui um ficheiro .env.example com todas as variáveis necessárias para o MongoDB.

Cria o ficheiro .env a partir do exemplo:
```bash
cp .env.example .env
```
### Screenshots da Aplicação
O repositório inclui uma pasta /screenshots com várias imagens da interface da aplicação, úteis para visualizar rapidamente o funcionamento do sistema.

### Funcionalidades
### Funcionalidades Obrigatórias

- Listagem de Linhas: Consumo da API pública da Carris Metropolitana.
- Visualização de Linhas: Interface simples usando componentes da UI TML (Button, Text, Badge, Surface, Title).
- Favoritar/Desfavoritar Linhas: Persistência em MongoDB.
- Redirecionamento: Clique em uma linha leva à página oficial (https://www.carrismetropolitana.pt/lines/{id}).
- Separação API/Frontend: Estrutura clara entre apps/api e apps/frontend.
- Código Modular e Organizado: Componentes com responsabilidades únicas.

### Funcionalidades Adicionais
- Interface mobile-first e responsiva.
- Sistema de filtros (Todas vs Favoritas).
- Estatísticas em tempo real.
- Loading states e tratamento de erros robusto.
- Fallback com dados mock quando a API está indisponível.

### Arquitetura e Stack
Estrutura do Projeto
```bash
apps/
├── api/        # Backend Express.js + MongoDB
│   └── src/index.ts
└── frontend/   # Frontend Next.js + React
    ├── app/        # Páginas Next.js
    ├── components/ # Componentes React
    ├── lib/        # Utilities e API client
    └── types/      # Tipagens TypeScript
compose.yml         # Configuração Docker MongoDB
package.json        # Configuração Turborepo

```
### Stack Tecnológica
- Frontend: Next.js 15, TypeScript, TML UI, Tailwind CSS
- Backend: Express.js, MongoDB, CORS
- DevOps: Docker Compose para MongoDB
- Gestão de Estado: React useState e useEffect, updates otimistas
### Setup & Execução
### Instalar dependências
```bash
npm install
```
### Iniciar MongoDB via Docker
```bash
docker-compose up -d
```
### Rodar aplicações

```bash
npm run dev
```
### Testar

- Frontend: http://localhost:49025
- API Health: http://localhost:3001/api/health
- Listar Linhas: http://localhost:3001/api/lines
- Listar Favoritos: http://localhost:3001/api/favorites


### Notas de Implementação

- Todos os requisitos técnicos foram cumpridos ✅
- Código escrito em TypeScript com tipagem forte
- Componentes organizados e modulares, responsabilidades claras
- Interface responsiva, intuitiva e com feedback visual
- Sistema de favoritos persistente em MongoDB
- Tratamento robusto de erros e fallback quando API indisponível
