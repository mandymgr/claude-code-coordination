#!/bin/sh
set -e

# Docker entrypoint script for KRINS-Universe-Builder
# Handles initialization, health checks, and graceful startup

echo "🚀 Starting KRINS-Universe-Builder Enterprise Platform..."

# Function to wait for database connection
wait_for_db() {
    echo "⏳ Waiting for database connection..."
    
    # Use pg_isready if POSTGRES_HOST is set
    if [ -n "$POSTGRES_HOST" ]; then
        until pg_isready -h "$POSTGRES_HOST" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-postgres}"; do
            echo "Database is unavailable - sleeping..."
            sleep 2
        done
        echo "✅ Database is ready!"
    fi
}

# Function to wait for Redis connection
wait_for_redis() {
    echo "⏳ Waiting for Redis connection..."
    
    if [ -n "$REDIS_HOST" ]; then
        until redis-cli -h "$REDIS_HOST" -p "${REDIS_PORT:-6379}" ping > /dev/null 2>&1; do
            echo "Redis is unavailable - sleeping..."
            sleep 2
        done
        echo "✅ Redis is ready!"
    fi
}

# Function to run database migrations
run_migrations() {
    echo "🔄 Running database migrations..."
    
    if [ -f "./packages/server/dist/database/migrate.js" ]; then
        node ./packages/server/dist/database/migrate.js
        echo "✅ Database migrations completed!"
    else
        echo "⚠️  No migrations script found, skipping..."
    fi
}

# Function to validate environment variables
validate_environment() {
    echo "🔍 Validating environment configuration..."
    
    # Required environment variables
    required_vars="NODE_ENV PORT"
    
    for var in $required_vars; do
        if [ -z "$(eval echo \$$var)" ]; then
            echo "❌ Error: Required environment variable $var is not set"
            exit 1
        fi
    done
    
    # Validate NODE_ENV
    if [ "$NODE_ENV" != "production" ] && [ "$NODE_ENV" != "development" ] && [ "$NODE_ENV" != "test" ]; then
        echo "⚠️  Warning: NODE_ENV should be 'production', 'development', or 'test'. Currently: $NODE_ENV"
    fi
    
    echo "✅ Environment validation completed!"
}

# Function to setup logging
setup_logging() {
    echo "📝 Setting up logging..."
    
    # Ensure log directory exists
    mkdir -p /app/logs
    
    # Set log level based on environment
    if [ "$NODE_ENV" = "production" ]; then
        export LOG_LEVEL="${LOG_LEVEL:-info}"
    else
        export LOG_LEVEL="${LOG_LEVEL:-debug}"
    fi
    
    echo "✅ Logging configured (level: $LOG_LEVEL)"
}

# Function to perform health check
health_check() {
    echo "🏥 Performing application health check..."
    
    # Start the application in background for health check
    pnpm --filter @claude-coordination/backend start &
    APP_PID=$!
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Application health check passed!"
        kill $APP_PID
        wait $APP_PID 2>/dev/null || true
    else
        echo "❌ Application health check failed!"
        kill $APP_PID 2>/dev/null || true
        wait $APP_PID 2>/dev/null || true
        exit 1
    fi
}

# Function to handle graceful shutdown
graceful_shutdown() {
    echo "🛑 Received shutdown signal, gracefully stopping..."
    
    if [ -n "$APP_PID" ]; then
        kill -TERM "$APP_PID"
        wait "$APP_PID"
    fi
    
    echo "✅ Application stopped gracefully"
    exit 0
}

# Set up signal handlers for graceful shutdown
trap graceful_shutdown TERM INT

# Main execution flow
main() {
    echo "🎯 Environment: $NODE_ENV"
    echo "🌐 Port: $PORT"
    
    # Validate environment
    validate_environment
    
    # Setup logging
    setup_logging
    
    # Wait for external dependencies in production
    if [ "$NODE_ENV" = "production" ]; then
        wait_for_db
        wait_for_redis
        run_migrations
    fi
    
    # Print startup banner
    echo "
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║       🌌 KRINS-Universe-Builder v3.0.0           ║
    ║       Ultimate AI Development Universe            ║
    ║                                                   ║
    ║       🚀 Production Ready                         ║
    ║       🔒 Security Hardened                        ║
    ║       ⚡ Performance Optimized                     ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
    "
    
    echo "🎉 Starting application server..."
    
    # Start the main application
    exec pnpm --filter @claude-coordination/backend start
}

# Execute main function
main "$@"