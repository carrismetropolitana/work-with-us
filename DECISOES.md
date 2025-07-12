# DECISOES.md

## Estrutura do Projeto  
- Organização com duas pastas principais: `api` e `frontend`.  
- Separação das responsabilidades: backend cuida da persistência e da API REST, frontend consome a API pública e a API interna de favoritos.

## Backend  
- **MongoDB via Docker** para facilitar setup local e consistência.  
- Modelo `Favorite` utiliza o `Dates` da biblioteca `@tmlmobilidade/utils` para manipulação de datas..  
- Campos `lineId` e `longName` são essenciais para identificar e exibir as linhas favoritas.  
- Rota `/api/favorites`:  
  - POST para criar favorito, com verificação de erros.  
  - GET para listar favoritos ordenados pela data de criação, facilitando mostrar os mais recentes.  
  - DELETE com validação de ID, garantindo robustez e feedback adequado ao cliente. 

## Frontend  
- Utilização dos componentes da UI Library `@tmlmobilidade/ui`, incluindo `<Button>`, `<Label>`, `<ComponentWrapper>`, e `<Loader>`.  
- Estado local para armazenar os favoritos como um objeto que mapeia `lineId` para o `_id` do MongoDB.  
- Função `toggleFavorite` realiza chamadas HTTP no backend, para criar e remover dos favorito.  
- Uso de `useEffect` para consumo da API pública da Carris Metropolitana para criar a visualização das linhas.
- Link que redireciona para o site da Carris Metropolitana ao clicar na linha, conforme requisito.  
- Layout simples e clean, com carregamento visual via componente `<Loader>` para melhor experiência do usuário.  
- Uso do provider `ThemeContextProvider` da biblioteca UI para garantir consistência visual e tema global.  

## Decisões adicionais  
- Optou-se por armazenar no banco apenas o necessário (lineId, longName, timestamps) 
- `lineId` unique ID para evitar favoritos duplicados, prevenindo inconsistências.
- No frontend, o estado dos favoritos é armazenado em um objeto para otimizar buscas e atualizações.