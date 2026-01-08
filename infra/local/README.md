# Ambiente Local - Docker Compose

Este diretório contém a configuração do Docker Compose para rodar a aplicação completa localmente.

## 📋 Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- 4GB RAM disponível
- Portas disponíveis: 27017, 3000, 3001

## 🚀 Como Usar

### 1. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar se necessário (valores padrão já funcionam)
nano .env
```

### 2. Iniciar os Serviços

```bash
# Build e start de todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

### 3. Acessar a Aplicação

- **Frontend**: http://localhost:3001
- **API**: http://localhost:3000
- **MongoDB**: localhost:27017

### 4. Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 5. Parar os Serviços

```bash
# Parar (mantém volumes)
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover containers e volumes
docker-compose down -v
```

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3001    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      API        │
│   (Fastify)     │
│   Port: 3000    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│   Port: 27017   │
└─────────────────┘
```

## 📦 Serviços

### MongoDB
- **Imagem**: mongo:7
- **Porta**: 27017
- **Usuário**: admin (configurável via .env)
- **Senha**: admin123 (configurável via .env)
- **Database**: miniapp
- **Volumes**: Dados persistidos em volumes Docker

### API (Fastify)
- **Build**: Multi-stage Dockerfile
- **Porta**: 3000
- **Health Check**: /health
- **Dependências**: MongoDB

### Frontend (Next.js)
- **Build**: Multi-stage Dockerfile com standalone output
- **Porta**: 3001 (mapeada da 3000 interna)
- **Health Check**: /
- **Dependências**: API

## 🔧 Comandos Úteis

### Rebuild de um serviço específico
```bash
docker-compose up -d --build api
docker-compose up -d --build frontend
```

### Acessar shell de um container
```bash
docker-compose exec api sh
docker-compose exec frontend sh
docker-compose exec mongodb mongosh
```

### Ver status dos serviços
```bash
docker-compose ps
```

### Ver uso de recursos
```bash
docker stats
```

### Limpar tudo (cuidado!)
```bash
docker-compose down -v --rmi all
```

## 🐛 Troubleshooting

### Porta já em uso
```bash
# Verificar o que está usando a porta
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Mudar a porta no docker-compose.yml
ports:
  - "3002:3000"  # Usar 3002 ao invés de 3001
```

### MongoDB não inicia
```bash
# Remover volumes e recriar
docker-compose down -v
docker-compose up -d mongodb
docker-compose logs -f mongodb
```

### Build falha
```bash
# Limpar cache do Docker
docker builder prune -a

# Rebuild sem cache
docker-compose build --no-cache
```

### Container reiniciando constantemente
```bash
# Ver logs detalhados
docker-compose logs --tail=100 api

# Verificar health check
docker inspect miniapp-api | grep -A 10 Health
```

## 📊 Volumes

Os dados do MongoDB são persistidos em volumes Docker:

```bash
# Listar volumes
docker volume ls | grep miniapp

# Inspecionar volume
docker volume inspect miniapp-mongodb-data

# Backup do volume
docker run --rm -v miniapp-mongodb-data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data

# Restore do volume
docker run --rm -v miniapp-mongodb-data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb-backup.tar.gz -C /
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: Este ambiente é apenas para desenvolvimento local!

- Credenciais padrão são inseguras
- Não usar em produção
- Não commitar o arquivo `.env` com credenciais reais

## 🚀 Próximos Passos

Após rodar localmente:
1. Desenvolver a aplicação
2. Testar funcionalidades
3. Build das imagens para Azure Container Registry
4. Deploy no Azure usando Terraform

## 📚 Referências

- [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
