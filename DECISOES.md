# Decisões Técnicas

## Visão Geral

O objetivo era construir um MVP funcional para visualizar e gerir linhas da Carris Metropolitana, que permitisse filtrar entre todas as linhas e as suas favoritas (mantendo os dados persistentes de diferentes sessão astravés do MongoDB).

## Estrutura do Projeto

O repositório já vinha com o Turborepo configurado como monorepo com dois apps: a `api` em Node/Fastify e o `frontend` em Next.js. Mantive essa estrutura que permitia desenvolver todo o projeto em dois principais módulos, a API como um backend e o fronted, _como um frontend..._ 

O MongoDB corre num container Docker, com um volume para persistência dos dados. Foi o primeiro passo seguido, adicionar o volume no .yml, subí-lo e validar a base com o Compass.

Busquei uma estrutura similar ao site atual e utilizar mais funções da API da Carris para enriquecer a app e suas funcionalidades
![ideia de listagem de linhas](all_lines.png)

## API (Fastify + MongoDB)

### O modelo de Favoritos

Após a base ter sido montada, o schema das informações dos favvoritos deveria ser implementada, conforme o solicitado.`lineId`, `createdAt` e `operationalDate`. As datas são definidas pelo handler (na própria route) e não pelo model, pois havia inconsistência na função `pre()` do Mongoose, (descobri da pior forma que o Mongoose valida os campos obrigatórios ANTES de correr os hooks). Ou seja, rebentava com "Path `createdAt` is required" mesmo que o hook fosse definir esse valor a seguir. A solução foi mover o `Dates.now('Europe/Lisbon')` diretamente para o handler do POST.

Usei o utilitário `Dates` da tmlmobilidade para garantir que as datas ficam sempre no timezone correto (Europa/Lisboa) e com o conceito de `operational_date`, que é importante para os serviços de madrugada que pertencem ao dia anterior.

### Os endpoints

Fiz os quatro básicos: GET all, GET one, POST e DELETE. Cada resposta mapeia os dados para um objeto `visibleFavorite` que só expõe o que interessa ao cliente (lineId, createdAt, createdAtHumanReadable, operationalDate), sem expor o `_id` interno do Mongo nem outros campos internos como `__v`.

Aprendi também que no Fastify, ao contrário do Flask, o `reply.send()` não para a execução da função. No início o endpoint de DELETE estava a tentar enviar duas respostas porque eu não tinha o `return` antes do `reply.send()` no bloco de erro. Ficou corrigido e por isto todos os `replys` possuem um `return` junto.

### CORS

Ativei o CORS com `origin: '*'` para o frontend conseguir comunicar com a API sem problemas, pois a API do backend bloqueava requisições do lado do frontend, impedindo guardar, eliminar e listar os favoritos. Numa situação de produção real restringia a origem, mas para um MVP local faz sentido estar aberto.

## Frontend (Next.js + React)

### Dados das linhas

As linhas vêm da API pública da Carris Metropolitana. Criei a função `getEnrichedLines()` em `lib/carris.ts` que faz três pedidos em paralelo (linhas, rotas e paragens) com `Promise.all` e depois cruza a informação com um filtro para as paragens e rotas. Desta forma conseguimos mais informações que enversões futuras poderiam ser dispostas diretamente no "cartão da linha". 
Por serem apenas três requisições com as informações tratadas pela própria app, não são feitas inúmeras requisições À API da Carris mas sim somente 3 e em paralelo, para diminuir o tempo de espera o máximo possível, sendo _Server Component_ e o resultado vai direto ao cliente já pronto.

### Server Components vs Client Components

A página principal (`page.tsx`) é um Server Component. Faz os dois fetches em paralelo (linhas da Carris e favoritos da API interna) e passa os dados ao `LinesGrid`. Isso significa que o HTML chega já renderizado ao browser, o que é mais rápido e não expõe a lógica de fetch no cliente. Assim a lógica da webapp é segura, protegida e modularizada, permitindo alterações em apenas um elemento, sem afetar os outros. 
O `LinesGrid` e o `LineCard` são Client Components porque precisam de estado (filtros, favoritos) e de event handlers para interatividade. Só marquei como `'use client'` ano inícios dos ficheiros.

### Gestão de Favoritos

O estado dos favoritos vive no `LinesGrid` com `useState`. Quando o utilizador clica no coração de uma linha, o estado local atualiza imediatamente e a chamada à API acontece em paralelo. Assim a interface responde de imediato sem esperar pela rede.
A lista de linhas favoritas é inicializada com os favoritos que já existem na base de dados, carregados no Server Component da página. Desta forma, ao recarregar a página, os favoritos persistem.

### LineCard

O card de cada linha tem o ID da linha dentro de um `Badge` da tmlmobilidade UI (com as cores reais da linha), o nome da linha, listagem de paragens e rotas (até a segunda, caso tenham mais aparecem como "..." e se não tiverem nenhuma registada aparecera como "Não Listada", incentivando à carregar na secção de "Ver mais informações" e aceder ao site da Carris), um botão de favorito com coração, e um link lateral amarelo para a página da linha no site da Carris. Tentei aproximar o visual ao Cartão Navegante da carris para cada linha.

### UI

Usei os componentes da `@tmlmobilidade/ui` sempre que fez sentido (Badge, Button e CMIcon). Para o layout usei CSS inline com flexbox e grid.

## O que ficou de fora (por agora)

Não implementei a página individual de cada linha pois aproveita-se a oficial do site, a pesquisa por linha era um dos principais objetivos meus mas devido ao tempo não foi possível seguir e um sistema de autenticação foi imaginado para teres diferentes favoritos, mas para um MVP desconsiderei a ideia.
O MVP foca-se no que foi pedido: listar linhas, favoritar e filtrar entre todas e favoritas. Mas com um trabalho a mais no lado do backend, com a APi permitindo retornar um favorito e tendo as `enrichedLines` para optimizar a experiência de um hipotético user final que poderias ver paragens, rotas e futuramente veículos ou chegadas, endpoints fornecidos pela API oficial da Carris.

## Muito obrigado pela oportunidade! Desejo muito tê-los como colegas!
