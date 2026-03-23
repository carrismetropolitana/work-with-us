# Decisões Técnicas

## Arquitetura Geral

A API (Fastify) é responsável pela gestão de favoritos e guarda os dados em MongoDB.
O frontend (Next.js) consome diretamente a API pública da Carris para listagem de linhas e utiliza a API interna apenas para operações de favoritos.

A separação entre frontend e API segue a estrutura do Turborepo

## Backend (API)

Foi utilizado Fastify por ser uma framework leve e simples de configurar.

Para persistência, usei MongoDB através de Docker, conforme o requisito.

Cada favorito é armazenado com:
	•	lineId (identificador único da linha)
	•	createdAt (timestamp em milissegundos)
	•	operationalDate, gerado com a biblioteca @tmlmobilidade/utils através de Dates.now('Europe/Lisbon') para garantir o fuso horário de Lisboa

O MongoDB adiciona automaticamente um identificador único (_id) a cada documento e foi criado um índice único em lineId para evitar favoritos duplicados.

## Frontend

O frontend consome diretamente a API pública da Carris para obter as linhas.

Para gestão de dados utilizei SWR, permitindo fazer fetch e sincronização dos favoritos de forma simples.

Separei as chamadas à API num ficheiro lib/api.ts, evitando misturar lógica de rede com os componentes.

Criei um componente LineCard para representar cada linha, mantendo o page.tsx mais limpo.

O LineCard inclui ainda uma border com a cor correspondente à linha, melhorando a identificação visual.

Os botões de favoritos refletem o estado atual de cada linha, permitindo adicionar ou remover favoritos com feedback visual imediato.

Cada LineCard inclui também um botão que redireciona para a página correspondente no site da Carris Metropolitana.
O redirecionamento é feito através de uma funcionalidade nativa do browser, permitindo manter a aplicação aberta e evitar perda de contexto.

---

# Possíveis melhorias futuras:
	•	Pesquisa e filtragem de linhas
	•	Paginação ou carregamento progressivo
	•	Melhorias da UI/UX
	•	Testes automatizados
    •   Notificações sobre linhas favoritas

---

# Validação dos requisitos
	[x]	Consumo da API pública da Carris Metropolitana para listagem de linhas 
	[x]	Visualização das linhas com componentes da biblioteca @tmlmobilidade/ui 
	[x]	Possibilidade de favoritar e desfavoritar linhas 
	[x]	Persistência dos favoritos em MongoDB 
	[x]	Instância de MongoDB criada via Docker 
	[x]	Cada favorito contém lineId, createdAt e operationalDate 
	[x]	Utilização da biblioteca @tmlmobilidade/utils (Dates) 
	[x]	Redirecionamento para a página da Carris Metropolitana ao selecionar uma linha 
	[x]	Separação clara entre frontend e API 
	[x]	Código organizado e modular 
