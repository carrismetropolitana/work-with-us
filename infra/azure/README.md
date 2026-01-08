# Infraestrutura Azure - Mini App

Este diretório contém a infraestrutura como código (IaC) para provisionar os recursos Azure necessários para a aplicação Mini App.

## 📋 Arquitetura

### Recursos Compartilhados (Shared)
- **Azure Container Registry (ACR)**: Armazena as imagens Docker da API e Frontend
- **Azure Cosmos DB for MongoDB**: Banco de dados compartilhado entre ambientes

### Recursos por Ambiente (Dev/Staging/Prod)
- **Resource Group**: Grupo de recursos isolado por ambiente
- **App Service Plan**: Plano de hospedagem para os Web Apps
- **Web App - API**: Aplicação Fastify (Node.js)
- **Web App - Frontend**: Aplicação Next.js
- **Application Insights**: Monitoramento e telemetria
- **Log Analytics Workspace**: Armazenamento de logs

## 🏗️ Estrutura de Diretórios

```
terraform/
├── modules/                    # Módulos reutilizáveis
│   ├── container_registry/     # Azure Container Registry
│   ├── cosmos_db/              # Cosmos DB for MongoDB
│   ├── monitoring/             # App Insights + Log Analytics
│   ├── service_plan/           # App Service Plan
│   └── web_app/                # Linux Web App
│
└── live/                       # Ambientes
    ├── shared-nonprod/         # Recursos compartilhados (dev + staging)
    ├── shared-prod/            # Recursos compartilhados (prod)
    ├── dev/                    # Ambiente de desenvolvimento
    ├── staging/                # Ambiente de homologação
    └── prod/                   # Ambiente de produção
```

## 🚀 Como Usar

### Pré-requisitos

1. **Azure CLI** instalado e autenticado:
   ```bash
   az login
   az account set --subscription "YOUR_SUBSCRIPTION_ID"
   ```

2. **Terraform** >= 1.0 instalado

3. **Subscription ID** do Azure

### Ordem de Provisionamento

⚠️ **IMPORTANTE**: Os recursos devem ser provisionados nesta ordem:

#### 1. Provisionar Recursos Compartilhados Não-Prod

```bash
cd terraform/live/shared-nonprod

# Editar terraform.tfvars com seu subscription_id
nano terraform.tfvars

# Inicializar e aplicar
terraform init
terraform plan
terraform apply
```

#### 2. Provisionar Recursos Compartilhados Prod

```bash
cd ../shared-prod

# Editar terraform.tfvars com seu subscription_id
nano terraform.tfvars

# Inicializar e aplicar
terraform init
terraform plan
terraform apply
```

#### 3. Provisionar Ambiente Dev

```bash
cd ../dev

# Editar terraform.tfvars com seu subscription_id
nano terraform.tfvars

# Inicializar e aplicar
terraform init
terraform plan
terraform apply
```

#### 4. Provisionar Ambiente Staging

```bash
cd ../staging

# Editar terraform.tfvars
nano terraform.tfvars

terraform init
terraform plan
terraform apply
```

#### 5. Provisionar Ambiente Prod

```bash
cd ../prod

# Editar terraform.tfvars
nano terraform.tfvars

terraform init
terraform plan
terraform apply
```

## 📊 Recursos Provisionados

### Shared Non-Prod
| Recurso | Nome | SKU/Tier |
|---------|------|----------|
| Resource Group | rg-miniapp-shared-nonprod | - |
| Container Registry | acrminiappnonprod | Basic |
| Cosmos DB | cosmos-miniapp-nonprod | Serverless |

### Shared Prod
| Recurso | Nome | SKU/Tier |
|---------|------|----------|
| Resource Group | rg-miniapp-shared-prod | - |
| Container Registry | acrminiappprod | Standard |
| Cosmos DB | cosmos-miniapp-prod | Serverless |

### Dev
| Recurso | Nome | SKU/Tier |
|---------|------|----------|
| Resource Group | rg-miniapp-dev | - |
| Service Plan | miniapp-dev | B1 |
| Web App API | app-miniapp-api-dev | - |
| Web App Frontend | app-miniapp-frontend-dev | - |
| Application Insights | miniapp-dev | - |
| Log Analytics | log-miniapp-dev | PerGB2018 |

### Staging
| Recurso | Nome | SKU/Tier |
|---------|------|----------|
| Resource Group | rg-miniapp-staging | - |
| Service Plan | miniapp-staging | B1 |
| Web App API | app-miniapp-api-staging | - |
| Web App Frontend | app-miniapp-frontend-staging | - |
| Application Insights | miniapp-staging | - |
| Log Analytics | log-miniapp-staging | PerGB2018 |

### Prod
| Recurso | Nome | SKU/Tier |
|---------|------|----------|
| Resource Group | rg-miniapp-prod | - |
| Service Plan | miniapp-prod | P0v3 |
| Web App API | app-miniapp-api-prod | - |
| Web App Frontend | app-miniapp-frontend-prod | - |
| Application Insights | miniapp-prod | - |
| Log Analytics | log-miniapp-prod | PerGB2018 |

## 💰 Estimativa de Custos (USD/mês)

### Non-Prod (Dev + Staging)
- ACR Basic: ~$5
- Cosmos DB Serverless: ~$0-25 (pay-per-use)
- 2x Service Plan B1: ~$26
- Application Insights: ~$0-5 (5GB free)
- **Total: ~$31-61/mês**

### Prod
- ACR Standard: ~$20
- Cosmos DB Serverless: ~$0-50 (pay-per-use)
- Service Plan P0v3: ~$73
- Application Insights: ~$5-20
- **Total: ~$98-163/mês**

## 🔐 Segurança

- **Secrets**: Connection strings são marcadas como `sensitive` nos outputs
- **TLS**: Mínimo TLS 1.2 configurado nos Web Apps
- **Admin Access**: ACR com admin habilitado (apenas para simplificação do desafio)
- **Managed Identity**: Recomendado implementar para produção real

## 📝 Variáveis Importantes

### terraform.tfvars
```hcl
subscription_id = "00000000-0000-0000-0000-000000000000"  # Seu Subscription ID
location        = "eastus"                                 # Região Azure
```

## 🔄 Outputs

Após o `terraform apply`, você terá acesso aos seguintes outputs:

```bash
# Ver outputs
terraform output

# Ver output específico
terraform output api_url
terraform output -json
```

## 🧹 Destruir Recursos

⚠️ **CUIDADO**: Isso irá deletar todos os recursos!

```bash
# Ordem inversa de criação
cd terraform/live/prod
terraform destroy

cd ../staging
terraform destroy

cd ../dev
terraform destroy

cd ../shared-prod
terraform destroy

cd ../shared-nonprod
terraform destroy
```

## 📚 Referências

- [Azure App Service](https://learn.microsoft.com/azure/app-service/)
- [Azure Cosmos DB](https://learn.microsoft.com/azure/cosmos-db/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

## 🤝 Contribuindo

Este é um projeto de desafio técnico. Para melhorias:
1. Adicionar backend remoto (Azure Storage)
2. Implementar Key Vault para secrets
3. Adicionar Managed Identity
4. Configurar Private Endpoints
5. Implementar Azure Front Door/CDN
