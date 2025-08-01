# DECISOES.md

## Estrutura do Projeto

- Organização com duas pastas principais: `api` e `frontend`.  
- Separação clara entre lógica de dados (`useLines`, `useFavorites`) e UI (`LineGrid`, `LineCard`, etc).
- Dados da API pública da Carris são enriquecidos com favoritos locais via backend.

## Backend

- **MongoDB com Mongoose** para persistência simples e eficiente.
    
- Modelo `Favorite` guarda `lineId`, `createdAt` e `operationalDate`.
- Uso do `Dates.fromJSDate` da `@tmlmobilidade/utils` para consistência na data operacional.
- API REST em Fastify:
    - `GET /favorites`: lista favoritos.
    - `POST /favorites`: adiciona novo favorito (com check de duplicado).
    - `DELETE /favorites/:lineId`: remove favorito por ID.
        

## Frontend

- **SWR** usado para fetch e cache de dados (`lines` e `favorites`), com `mutate` otimista ao fazer toggle.
- Hooks separados (`useLines`, `useFavorites`) encapsulam lógica de dados e estado de UI.
- Combinação de `useDebouncedValue`, `useEffect` e `useMemo` para otimizar filtros e pesquisa.
- Alguns componentes da `@tmlmobilidade/ui`: `<Button>`, `<Combobox>`, `<Loader>`, `<Text>`, entre outros.
- Filtros bem definidos:
    - Pesquisa por nome ou ID.
    - Ordenação (ID asc/desc, Nome A-Z).
    - Tab de todas vs favoritas.
- Estilos com `module.css` para manter a consistência visual.
- URLs e endpoints centralizados em ficheiros de `consts` para evitar hardcoding.
    

## Decisões Técnicas

- SWR escolhido por simplicidade + controle sobre cache e revalidação.
- Mongoose pela familiaridade e suporte robusto a schemas e validação.
- `mutate()` com update otimista no toggle de favoritos evita esperar roundtrip do backend.
    

## Possíveis Melhorias Futuras

- Paginação para grandes volumes de linhas.