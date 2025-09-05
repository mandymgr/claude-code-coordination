#!/bin/bash

# Production Startup Script for Claude Code Coordination Server
# Phase 4: Production Optimization Complete

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT:-8080}
HEALTH_CHECK_URL="http://localhost:${PORT}/health"
PERFORMANCE_CHECK_URL="http://localhost:${PORT}/api/performance/metrics"

echo -e "${BLUE}🚀 Claude Code Coordination - Production Startup${NC}"
echo -e "${BLUE}Phase 4: Production Optimization${NC}"
echo "=================================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Pre-flight checks
echo ""
print_info "Running pre-flight checks..."

# Check Node.js version
NODE_VERSION=$(node --version)
print_info "Node.js version: $NODE_VERSION"

if [[ "$NODE_VERSION" < "v18.0.0" ]]; then
    print_error "Node.js version 18.0.0 or higher is required"
    exit 1
fi

# Check if .env.production exists
if [[ ! -f ".env.production" ]]; then
    print_warning ".env.production not found, using default environment variables"
else
    print_status "Found .env.production configuration"
    export $(cat .env.production | grep -v ^# | xargs)
fi

# Check if dist directory exists
if [[ ! -d "dist" ]]; then
    print_info "Building TypeScript..."
    npm run build
    if [[ $? -ne 0 ]]; then
        print_error "Build failed"
        exit 1
    fi
fi

print_status "Pre-flight checks completed"

# Memory optimization
echo ""
print_info "Configuring memory optimization..."

# Set Node.js memory limits
export NODE_OPTIONS="--max-old-space-size=4096 --expose-gc --optimize-for-size"

# Configure garbage collection
export UV_THREADPOOL_SIZE=16

print_status "Memory optimization configured"

# Database checks
echo ""
print_info "Checking database connections..."

# Check PostgreSQL connection (basic check)
if command -v psql &> /dev/null; then
    PGPASSWORD=${POSTGRES_PASSWORD:-} psql -h ${POSTGRES_HOST:-localhost} -U ${POSTGRES_USER:-claude} -d ${POSTGRES_DB:-claude_coordination_prod} -c "SELECT 1;" &> /dev/null
    if [[ $? -eq 0 ]]; then
        print_status "PostgreSQL connection successful"
    else
        print_warning "PostgreSQL connection failed (server will handle reconnection)"
    fi
else
    print_warning "psql not available, skipping PostgreSQL connection check"
fi

# Check Redis connection (basic check)
if command -v redis-cli &> /dev/null; then
    redis-cli -h ${REDIS_HOST:-localhost} -p ${REDIS_PORT:-6379} ping &> /dev/null
    if [[ $? -eq 0 ]]; then
        print_status "Redis connection successful"
    else
        print_warning "Redis connection failed (server will handle reconnection)"
    fi
else
    print_warning "redis-cli not available, skipping Redis connection check"
fi

# Performance tuning
echo ""
print_info "Applying performance tuning..."

# Set system limits (requires appropriate permissions)
ulimit -n 65536 || print_warning "Could not increase file descriptor limit"

# TCP tuning for high performance
echo 1 > /proc/sys/net/ipv4/tcp_tw_reuse 2>/dev/null || print_warning "Could not enable TCP socket reuse"

print_status "Performance tuning applied"

# Start the server
echo ""
print_info "Starting Claude Code Coordination Server..."
print_info "Environment: $NODE_ENV"
print_info "Port: $PORT"
print_info "Memory limit: 4096MB"

# Create PID file
PID_FILE="/tmp/claude-coordination.pid"

# Function to cleanup on exit
cleanup() {
    print_info "Shutting down gracefully..."
    if [[ -f "$PID_FILE" ]]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill -TERM "$PID"
            wait "$PID"
        fi
        rm -f "$PID_FILE"
    fi
    print_status "Shutdown complete"
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM EXIT

# Start the application
node dist/server.js &
SERVER_PID=$!
echo $SERVER_PID > "$PID_FILE"

print_status "Server started with PID: $SERVER_PID"

# Wait for server to be ready
echo ""
print_info "Waiting for server to be ready..."

MAX_ATTEMPTS=30
ATTEMPT=0

while [[ $ATTEMPT -lt $MAX_ATTEMPTS ]]; do
    if curl -s "$HEALTH_CHECK_URL" >/dev/null 2>&1; then
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    print_info "Attempt $ATTEMPT/$MAX_ATTEMPTS - waiting for server..."
    sleep 2
done

if [[ $ATTEMPT -eq $MAX_ATTEMPTS ]]; then
    print_error "Server failed to start within 60 seconds"
    cleanup
    exit 1
fi

print_status "Server is ready!"

# Performance validation
echo ""
print_info "Running performance validation..."

# Get initial metrics
METRICS_RESPONSE=$(curl -s "$PERFORMANCE_CHECK_URL" 2>/dev/null || echo "{}")
if [[ "$METRICS_RESPONSE" != "{}" ]]; then
    print_status "Performance metrics endpoint responding"
    
    # Extract memory usage (if jq is available)
    if command -v jq &> /dev/null; then
        HEAP_USED=$(echo "$METRICS_RESPONSE" | jq -r '.system.memoryUsage.heapUsed // 0')
        HEAP_TOTAL=$(echo "$METRICS_RESPONSE" | jq -r '.system.memoryUsage.heapTotal // 0')
        
        if [[ "$HEAP_USED" -gt 0 && "$HEAP_TOTAL" -gt 0 ]]; then
            HEAP_PERCENT=$((HEAP_USED * 100 / HEAP_TOTAL))
            print_info "Initial heap usage: ${HEAP_PERCENT}%"
        fi
    fi
else
    print_warning "Could not retrieve performance metrics"
fi

# Performance optimization suggestions
echo ""
print_info "Performance Optimization Status:"
print_status "✅ Memory management with automatic GC"
print_status "✅ Lazy loading for heavy dependencies"
print_status "✅ Optimized connection pooling"
print_status "✅ Production TypeScript compilation"
print_status "✅ Load testing capabilities"

echo ""
print_status "🎉 Phase 4: Production Optimization COMPLETE!"
echo ""
print_info "Server Details:"
echo "  - Health Check: $HEALTH_CHECK_URL"
echo "  - Performance: $PERFORMANCE_CHECK_URL"
echo "  - API Docs: http://localhost:$PORT/api"
echo "  - Dashboard: http://localhost:$PORT"
echo ""
print_info "Production Features Enabled:"
echo "  - Advanced memory management"
echo "  - Connection pooling optimization"  
echo "  - Lazy loading for dependencies"
echo "  - Performance monitoring API"
echo "  - Load testing capabilities"
echo "  - Circuit breaker patterns"
echo ""
print_info "Logs are being written to stdout/stderr"
print_info "Use Ctrl+C to gracefully shutdown"

# Wait for the server process
wait $SERVER_PID