# Claude Code Coordination - Production Deployment Guide

## 🚀 Quick Start

```bash
# Full production deployment
./scripts/deploy.sh full -e prod -v v1.0.0

# Check deployment status
./scripts/deploy.sh status

# Initialize cluster services
./scripts/init-cluster.sh
```

## 📋 Prerequisites

### Required Tools
- Docker Desktop or compatible container runtime
- kubectl (configured for your cluster)
- Helm 3.x
- Access to Kubernetes cluster with admin privileges

### Cluster Requirements
- Kubernetes 1.24+
- Minimum 8 CPU cores, 16GB RAM across nodes
- 200GB+ persistent storage available
- LoadBalancer or Ingress Controller (nginx recommended)
- cert-manager for automatic TLS certificates

### Domain Setup
Configure DNS records for:
- `api.krins.dev` → LoadBalancer IP
- `app.krins.dev` → LoadBalancer IP  
- `ws.krins.dev` → LoadBalancer IP
- `grafana.krins.dev` → LoadBalancer IP
- `prometheus.krins.dev` → LoadBalancer IP
- `jaeger.krins.dev` → LoadBalancer IP

## 🔧 Configuration

### 1. Environment Variables
```bash
# Copy production template
cp .env.production .env

# Fill in actual values (see comments in file)
vim .env
```

### 2. Kubernetes Secrets
```bash
# Create secrets from environment file
kubectl create secret generic claude-coordination-secrets \
  --from-env-file=.env \
  --namespace=claude-coordination

# Or use individual secret creation
kubectl create secret generic claude-coordination-secrets \
  --from-literal=POSTGRES_PASSWORD=your_password \
  --from-literal=ANTHROPIC_API_KEY=your_key \
  --from-literal=JWT_SECRET=your_jwt_secret \
  --namespace=claude-coordination
```

### 3. Storage Classes
Ensure your cluster has these storage classes:
- `fast-ssd` - For databases (high IOPS)
- `standard` - For general use

```bash
# Check available storage classes
kubectl get storageclass

# Example fast-ssd storage class (AWS EBS)
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF
```

## 🚀 Deployment Options

### Option 1: Full Automated Deployment (Recommended)
```bash
# Complete deployment with health checks
./scripts/deploy.sh full -e prod -v v1.0.0

# Initialize cluster services (Redis cluster, DB replication)
./scripts/init-cluster.sh
```

### Option 2: Manual Step-by-Step
```bash
# 1. Build and push Docker image
./scripts/deploy.sh build -v v1.0.0

# 2. Deploy infrastructure
./scripts/deploy.sh deploy -e prod -v v1.0.0

# 3. Initialize services
./scripts/init-cluster.sh

# 4. Verify deployment
./scripts/deploy.sh status
```

### Option 3: Using Helm Directly
```bash
# Create namespaces
kubectl apply -f k8s/namespace.yaml

# Deploy with Helm
helm install claude-coordination helm/claude-coordination \
  --namespace claude-coordination \
  --set image.tag=v1.0.0 \
  --set global.environment=prod \
  --values helm/claude-coordination/values-prod.yaml \
  --wait
```

### Option 4: Raw Kubernetes Manifests
```bash
# Apply all manifests in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/application.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/monitoring.yaml
kubectl apply -f k8s/network-policies.yaml
kubectl apply -f k8s/rbac.yaml

# Initialize cluster
./scripts/init-cluster.sh
```

## 📊 Monitoring Setup

### Grafana Dashboards
Access Grafana at `https://grafana.krins.dev`

Default login: admin / (see GRAFANA_PASSWORD in .env)

### Prometheus Metrics
Access Prometheus at `https://prometheus.krins.dev`

### Jaeger Tracing
Access Jaeger at `https://jaeger.krins.dev`

### Key Metrics to Monitor
- API response times (95th percentile < 2s)
- Error rates (< 1%)
- Database connections and query performance
- Redis cluster health
- Pod CPU/Memory usage
- Disk space and I/O

## 🔒 Security Configuration

### Network Policies
Network policies are automatically applied to restrict traffic between components.

### RBAC
Service accounts with minimal required permissions are created automatically.

### TLS Certificates
Automatic TLS certificates are provisioned using cert-manager and Let's Encrypt.

### Secret Management
- All secrets stored in Kubernetes secrets
- No secrets in container images
- Regular secret rotation recommended

## 📈 Scaling

### Horizontal Pod Autoscaler
```bash
# Check HPA status
kubectl get hpa -n claude-coordination

# Manually scale if needed
kubectl scale deployment claude-coordination-server \
  --replicas=5 -n claude-coordination
```

### Cluster Autoscaling
Configure cluster autoscaler for automatic node scaling:
```yaml
# Add to cluster autoscaler deployment
--scale-down-delay-after-add=10m
--scale-down-unneeded-time=10m
--max-nodes-total=20
```

### Database Scaling
- PostgreSQL read replicas automatically handle read traffic
- For write scaling, consider connection pooling (PgBouncer)
- Redis cluster automatically shards data

## 🔄 Updates and Maintenance

### Rolling Updates
```bash
# Deploy new version
./scripts/deploy.sh upgrade -v v1.1.0

# Monitor rollout
kubectl rollout status deployment/claude-coordination-server -n claude-coordination

# Rollback if needed
./scripts/deploy.sh rollback
```

### Database Migrations
```bash
# Run migrations (if needed)
kubectl exec -n claude-coordination postgres-primary-0 -- \
  psql -U postgres -d claude_coordination -f /migrations/001-new-feature.sql
```

### Certificate Renewal
Certificates renew automatically via cert-manager. Check status:
```bash
kubectl get certificates -n claude-coordination
kubectl describe certificate claude-coordination-tls -n claude-coordination
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Pods Stuck in Pending
```bash
# Check node resources
kubectl top nodes

# Check storage
kubectl get pv
kubectl get pvc -n claude-coordination

# Check events
kubectl get events -n claude-coordination --sort-by='.lastTimestamp'
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
kubectl exec -n claude-coordination postgres-primary-0 -- pg_isready

# Check logs
kubectl logs -n claude-coordination postgres-primary-0

# Test connection
kubectl exec -n claude-coordination postgres-primary-0 -- \
  psql -U postgres -d claude_coordination -c "SELECT 1;"
```

#### 3. Redis Cluster Issues
```bash
# Check cluster status
kubectl exec -n claude-coordination redis-node-1-0 -- \
  redis-cli cluster info

# Check individual nodes
kubectl exec -n claude-coordination redis-node-1-0 -- redis-cli ping
```

#### 4. Application Not Responding
```bash
# Check application logs
kubectl logs -n claude-coordination -l app=claude-coordination-server

# Check health endpoint
kubectl port-forward -n claude-coordination service/claude-coordination-service 8080:8080
curl http://localhost:8080/health
```

#### 5. TLS Certificate Issues
```bash
# Check certificate status
kubectl describe certificate claude-coordination-tls -n claude-coordination

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Force certificate renewal
kubectl delete certificate claude-coordination-tls -n claude-coordination
```

### Log Collection
```bash
# Collect all logs
mkdir -p debug-logs
kubectl logs -n claude-coordination -l app=claude-coordination-server > debug-logs/app.log
kubectl logs -n claude-coordination -l app=postgres-primary > debug-logs/postgres.log
kubectl logs -n claude-coordination -l app=redis > debug-logs/redis.log
kubectl get events -n claude-coordination > debug-logs/events.log
```

## 📊 Performance Tuning

### Resource Optimization
```yaml
# Recommended resource requests/limits
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi
```

### Database Performance
```sql
-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check connection usage
SELECT count(*) as connections, state 
FROM pg_stat_activity 
GROUP BY state;
```

### Redis Performance
```bash
# Monitor Redis performance
kubectl exec -n claude-coordination redis-node-1-0 -- \
  redis-cli info stats

# Check memory usage
kubectl exec -n claude-coordination redis-node-1-0 -- \
  redis-cli info memory
```

## 🔐 Backup and Recovery

### Automated Backups
Backups run automatically according to the schedule in `.env`:
```bash
# Check backup status
kubectl get cronjob -n claude-coordination

# Manual backup
kubectl create job --from=cronjob/postgres-backup manual-backup-$(date +%s) -n claude-coordination
```

### Recovery Procedures
```bash
# Restore from backup
kubectl exec -n claude-coordination postgres-primary-0 -- \
  psql -U postgres -d claude_coordination < /backups/backup-2024-01-01.sql

# Verify data integrity
kubectl exec -n claude-coordination postgres-primary-0 -- \
  psql -U postgres -d claude_coordination -c "SELECT count(*) FROM users;"
```

## 🌍 Multi-Region Deployment

For global deployments, consider:
- Regional Kubernetes clusters
- Cross-region database replication
- CDN for static assets
- Geographic load balancing

## 📞 Support

For deployment issues:
1. Check troubleshooting section above
2. Review logs and events
3. Contact support with debug information
4. Create GitHub issue with deployment details

---

**Production deployment requires careful planning and testing. Always test in a staging environment first!**