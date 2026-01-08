arquitetura de recursos utilizada:
    - Azure App Services
        poucas aplicações; integradas no mesmo ambiente; fácil de gerenciar; always on; custo baixo com reservas; fácil de escalar.
        obviamente, não se torna necessário a utilização de um AKS para um ambiente pequeno e de pouca complexidade.
        além disso, utilizar uma máquina virtual com docker-compose torna o deploy mais complexo, e também se faz necessário gerenciar o próprio sistema operacional do servidor.
        utilização de azure functions talvez não seja viável para uma aplicação que não seja baseada em fila/eventos.
        por isso, acredito que a utilização de um service plan para abstrair o gerenciamento da infraestrutura e manter as aplicações em execução constante com baixo custo, é o melhor caso para esta aplicação.

estrutura de repositório:
    - diretórios separados por categorias
        apps, pipelines, infra
        'apps' com suas respectivas pastas, api e frontend.
        'pipelines' contendo as pipelines de build da api e do frontend; deploy da infraestrutura de cada ambiente e deploy das aplicações
        'infra' com a estrutura do código terraform + pasta para execução do ambiente localmente utilizando docker compose.

terraform:
    - por que usar diretórios separados para cada ambiente e não workspaces?
        utilizar terraform workspaces isola somente o state, mas não o código. Isso dificulta diferenciar os ambientes, ficamos presos a um código único para todos os workspaces, não é possível criar recursos que só existiriam em um ambiente e nos outros não.
        por isso, decidi separar a estrutura do terraform em pastas de ambiente, como dev, staging, prod e nonprod.
        em cada pasta, temos a flexibilidade de criar recursos sem interferir na estrutura de outro ambiente.
        a pasta "nonprod" refere-se a recursos que são compartilhados entre os ambientes não produtivos, como por exemplo o container registry, o recurso do banco de dados, e possivelmente redes virtuais.
    - utilizção de módulos
        foco em DRY e padronização das propriedades dos recursos.
        recursos estritamente ligados, como log analytics workspace + application insights, podem ser definidos no mesmo módulo.
    - naming convention
        foco nas boas práticas de código, variaveis sempre em snake_case, letras minusculas e numeros, nomes de blocos de fácil leitura.
        uso do cloud-adoption-framework para nomenclatura e organização de recursos na azure
    - outras decisões
        também se faz ideal o uso do 'ignore_changes' em algumas configurações dos recursos, como por exemplo dos web apps. O ideal é que propriedades que são alteradas com frequencia, como as variáveis de ambiente do web app e a imagem do container, sejam ignoradas pelo terraform e aplicadas via pipelines.

aplicações:
    dockerfile para cada aplicação, utilizando multi stage, separando as imagens em build e execução para otimização e redução de tamanho.
    uso de variáveis de ambiente de acordo com os requisitos da aplicação

ci/cd:
    - build
        uma pipeline para build de cada aplicação, integrado com sonarqube para controle de qualidade de código e também é possível a integração de outras ferramentas para automação de testes, dependecychecks e outras finalidades.
        publicação da imagem no azure container registry
    - deploy
        release pipelines para deploy da imagem gerada nos app services

referencias:
terraform: https://www.terraform-best-practices.com/
azure: 
    https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations
    https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming

mongodb:
    https://renatogroffe.medium.com/mongodb-mongo-express-docker-compose-montando-rapidamente-um-ambiente-para-uso-824f25ca6957
    https://hub.docker.com/_/mongo