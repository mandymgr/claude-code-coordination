# Infrastructure

This directory contains all infrastructure-related files for the Claude Code Coordination Platform.

## Directory Structure

```
infra/
├── docker/                 # Docker containerization
│   ├── Dockerfile          # Production Docker image
│   ├── docker-entrypoint.sh # Container startup script
│   ├── docker-compose.yml  # Development compose
│   └── docker-compose.prod.yml # Production compose
├── kubernetes/             # Kubernetes deployment
│   └── k8s/               # K8s manifests
│       ├── deployment.yaml # Main deployment
│       ├── service.yaml   # Service configuration
│       └── hpa.yaml       # Horizontal Pod Autoscaler
└── monitoring/            # Observability stack
    └── (to be added)      # Prometheus, Grafana, AlertManager
```

## Docker

### Development
```bash
cd infra/docker
docker-compose up -d
```

### Production
```bash
cd infra/docker
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes

### Deploy to cluster
```bash
kubectl apply -f infra/kubernetes/k8s/
```

### Scale deployment
```bash
kubectl scale deployment claude-coordination --replicas=5
```

## Monitoring

Monitoring stack includes:
- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards  
- **AlertManager** - Alert routing and management
- **Jaeger** - Distributed tracing

## Security

All infrastructure follows security best practices:
- Non-root containers
- Security context constraints
- Resource limits and quotas
- Network policies
- Secret management via Kubernetes secrets