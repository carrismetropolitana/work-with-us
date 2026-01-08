#!/bin/bash

# Script para iniciar o ambiente local
# Uso: ./start.sh [build|rebuild|stop|clean|logs]

set -e

COMPOSE_FILE="docker-compose.yml"

case "$1" in
  build)
    echo "🔨 Building and starting services..."
    docker-compose -f $COMPOSE_FILE up -d --build
    echo "✅ Services started!"
    echo ""
    echo "📍 Access:"
    echo "   Frontend: http://localhost:3001"
    echo "   API:      http://localhost:3000"
    echo "   MongoDB:  localhost:27017"
    ;;
    
  rebuild)
    echo "🔨 Rebuilding services without cache..."
    docker-compose -f $COMPOSE_FILE build --no-cache
    docker-compose -f $COMPOSE_FILE up -d
    echo "✅ Services rebuilt and started!"
    ;;
    
  stop)
    echo "🛑 Stopping services..."
    docker-compose -f $COMPOSE_FILE stop
    echo "✅ Services stopped!"
    ;;
    
  clean)
    echo "🧹 Cleaning up (removing containers and volumes)..."
    docker-compose -f $COMPOSE_FILE down -v
    echo "✅ Cleanup complete!"
    ;;
    
  logs)
    echo "📋 Showing logs (Ctrl+C to exit)..."
    docker-compose -f $COMPOSE_FILE logs -f
    ;;
    
  *)
    echo "🚀 Mini App - Local Environment"
    echo ""
    echo "Usage: ./start.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build    - Build and start all services"
    echo "  rebuild  - Rebuild without cache and start"
    echo "  stop     - Stop all services"
    echo "  clean    - Stop and remove all containers and volumes"
    echo "  logs     - Show logs from all services"
    echo ""
    echo "Example: ./start.sh build"
    exit 1
    ;;
esac
