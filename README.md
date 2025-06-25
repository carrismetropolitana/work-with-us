### Desafio Técnico — Fullstack Developer

O objetivo deste desafio é avaliar a tua capacidade de trabalhar num projeto fullstack, com foco na organização do código, utilização de bibliotecas externas, consumo de APIs públicas e persistência de dados.


### Objetivo

Construir uma mini-aplicação com as seguintes funcionalidades:
1. Listagem de Linhas — Consumir a API pública da Carris Metropolitana (https://api.carrismetropolitana.pt/v2/lines) e obter a lista de linhas disponíveis.
2. Visualização de Linhas — Apresentar as linhas numa interface visual (lista, grelha ou outro formato) utilizando os componentes da UI Library da TML.
3. Favoritar/Desfavoritar Linhas — Permitir que o utilizador possa adicionar/remover linhas dos seus favoritos.
4. Navegação para o site da CM — Ao clicar numa linha, redirecionar o utilizador para a página correspondente no site da Carris Metropolitana.


### Requisitos Técnicos

A aplicação deve cumprir os seguintes critérios:
- Utilizar a biblioteca de UI da TML: [@tmlmobilidade/ui](https://github.com/tmlmobilidade/core/tree/production/packages/ui)
- Utilizar a biblioteca de utils da TML: [@tmlmobilidade/utils](https://github.com/tmlmobilidade/core/tree/production/packages/utils), nomeadamente a funcionalidade `Dates`.
- Persistir os favoritos numa base de dados MongoDB
- Criar a instância MongoDB via Docker (see `compose.yml`)
- Cada favorito deve ser um objeto único na base de dados, e cada um deve ter como propriedades o valor da data de criação em UnixTimestamp e OperationalDate.
- Ter uma separação clara entre o `api` e o `frontend`
- Escrever código organizado, legível e modular, com componentes bem definidos e responsabilidades únicas.


### Notas Adicionais

- A aparência da aplicação fica ao teu critério, desde que sejam utilizados os componentes da UI da TML.
- Disponibilizamos o esqueleto do frontend já com as bibliotecas instaladas e com os providers de UI prontos. Nota: não mexer no `layout.tsx`.
- Este teste está montado com Turborepo. Para iniciar o projeto, basta correr `npm run dev` que ele irá correr as duas aplicações em simultâneo (`api` e `frontend`).


### Entrega

Por favor entrega o teu projeto num Pull Request a este repositório, com uma breve explicação das decisões tomadas num ficheiro `DECISOES.md`.