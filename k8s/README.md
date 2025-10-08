# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Kube Credential microservices.

## Files

- `issuance-deployment.yaml` - Deployment and Service for Issuance API
- `verification-deployment.yaml` - Deployment and Service for Verification API
- `ingress.yaml` - Ingress configuration for routing
- `hpa.yaml` - Horizontal Pod Autoscaler configurations

## Quick Start

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- NGINX Ingress Controller installed
- Docker image built and available

### Deployment Steps

1. **Build and push Docker image**
   ```bash
   docker build -t kube-credential:latest .
   docker tag kube-credential:latest your-registry/kube-credential:latest
   docker push your-registry/kube-credential:latest
   ```

2. **Update image references**
   Update the `image` field in deployment files to point to your registry:
   ```yaml
   image: your-registry/kube-credential:latest
   ```

3. **Apply all manifests**
   ```bash
   kubectl apply -f k8s/
   ```

4. **Verify deployment**
   ```bash
   kubectl get deployments
   kubectl get pods
   kubectl get services
   kubectl get ingress
   kubectl get hpa
   ```

5. **Check logs**
   ```bash
   kubectl logs -l app=kube-credential --tail=50 -f
   ```

## Architecture

### Two Microservices

1. **Issuance Service**
   - 3 replicas (default)
   - Handles credential issuance
   - Path: `/api/issuance/*`

2. **Verification Service**
   - 2 replicas (default)
   - Handles credential verification
   - Path: `/api/verification/*`

### Scaling

Both services have HPA configured:
- Scales based on CPU (70%) and Memory (80%) utilization
- Issuance: 2-10 replicas
- Verification: 2-8 replicas

Manual scaling:
```bash
kubectl scale deployment kube-credential-issuance --replicas=5
kubectl scale deployment kube-credential-verification --replicas=3
```

## Configuration

### Environment Variables

Both services use:
- `NODE_ENV=production`
- `PORT=5000`

Add custom variables in deployment YAML:
```yaml
env:
- name: CUSTOM_VAR
  value: "custom-value"
```

### Resource Limits

Current configuration:
- Requests: 128Mi RAM, 100m CPU
- Limits: 256Mi RAM, 200m CPU

Adjust in deployment files as needed.

### Persistent Storage

Currently using `emptyDir` volumes (ephemeral).

For persistent database, use PersistentVolumeClaim:
```yaml
volumes:
- name: data
  persistentVolumeClaim:
    claimName: kube-credential-pvc
```

## Ingress Configuration

Update `ingress.yaml` with your domain:
```yaml
rules:
- host: your-domain.com
```

For HTTPS, ensure cert-manager is installed and configured.

## Monitoring

### Health Checks

Both services expose:
- Liveness probe: `/api/health`
- Readiness probe: `/api/health`

### Metrics

View HPA metrics:
```bash
kubectl get hpa -w
kubectl describe hpa kube-credential-issuance-hpa
```

View pod metrics:
```bash
kubectl top pods -l app=kube-credential
kubectl top nodes
```

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Service not accessible

```bash
kubectl get endpoints
kubectl describe service kube-credential-issuance
```

### Ingress issues

```bash
kubectl describe ingress kube-credential-ingress
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### Database connection errors

Check if pods share database properly. For production, use external database:
1. Deploy PostgreSQL/MySQL
2. Update connection string in deployment
3. Add secret for credentials

## Production Considerations

1. **Database**: Replace SQLite with PostgreSQL/MySQL
2. **Secrets**: Use Kubernetes Secrets for sensitive data
3. **Monitoring**: Add Prometheus/Grafana
4. **Logging**: Integrate with ELK/Loki stack
5. **Backup**: Implement database backup strategy
6. **Security**: Add NetworkPolicies and RBAC
7. **TLS**: Configure cert-manager for HTTPS

## Cleanup

Remove all resources:
```bash
kubectl delete -f k8s/
```
