# Script PowerShell para iniciar o ambiente local
# Uso: .\start.ps1 [build|rebuild|stop|clean|logs]

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

$ComposeFile = "docker-compose.yml"

switch ($Command) {
    "build" {
        Write-Host "🔨 Building and starting services..." -ForegroundColor Cyan
        docker-compose -f $ComposeFile up -d --build
        Write-Host "✅ Services started!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📍 Access:" -ForegroundColor Yellow
        Write-Host "   Frontend: http://localhost:3001"
        Write-Host "   API:      http://localhost:3000"
        Write-Host "   MongoDB:  localhost:27017"
    }
    
    "rebuild" {
        Write-Host "🔨 Rebuilding services without cache..." -ForegroundColor Cyan
        docker-compose -f $ComposeFile build --no-cache
        docker-compose -f $ComposeFile up -d
        Write-Host "✅ Services rebuilt and started!" -ForegroundColor Green
    }
    
    "stop" {
        Write-Host "🛑 Stopping services..." -ForegroundColor Cyan
        docker-compose -f $ComposeFile stop
        Write-Host "✅ Services stopped!" -ForegroundColor Green
    }
    
    "clean" {
        Write-Host "🧹 Cleaning up (removing containers and volumes)..." -ForegroundColor Cyan
        docker-compose -f $ComposeFile down -v
        Write-Host "✅ Cleanup complete!" -ForegroundColor Green
    }
    
    "logs" {
        Write-Host "📋 Showing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
        docker-compose -f $ComposeFile logs -f
    }
    
    default {
        Write-Host "🚀 Mini App - Local Environment" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage: .\start.ps1 [command]"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  build    - Build and start all services"
        Write-Host "  rebuild  - Rebuild without cache and start"
        Write-Host "  stop     - Stop all services"
        Write-Host "  clean    - Stop and remove all containers and volumes"
        Write-Host "  logs     - Show logs from all services"
        Write-Host ""
        Write-Host "Example: .\start.ps1 build"
    }
}
