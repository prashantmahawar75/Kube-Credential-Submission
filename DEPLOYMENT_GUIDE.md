# Deployment Guide - Kube Credential

## Quick Deployment Options

### Option 1: Deploy to Render.com (Easiest - Free Tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: kube-credential
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment

Your app will be available at: `https://kube-credential.onrender.com`

### Option 2: Deploy to AWS EC2 Free Tier

#### Prerequisites
- AWS Account (free tier)
- AWS CLI installed

#### Steps

1. **Launch EC2 Instance**
```bash
# Launch t2.micro instance (free tier eligible)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-groups kube-credential-sg
```

2. **Configure Security Group**
```bash
# Allow HTTP traffic
aws ec2 authorize-security-group-ingress \
  --group-name kube-credential-sg \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow SSH
aws ec2 authorize-security-group-ingress \
  --group-name kube-credential-sg \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

3. **SSH into Instance and Deploy**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Clone your repository
git clone <your-repo-url>
cd kube-credential

# Install dependencies and build
npm install
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start the application
pm2 start npm --name "kube-credential" -- start
pm2 save
pm2 startup
```

4. **Configure Nginx (Optional)**
```bash
sudo yum install -y nginx

# Create Nginx config
sudo nano /etc/nginx/conf.d/kube-credential.conf
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Option 3: Deploy to AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize and Deploy**
```bash
# Initialize EB application
eb init -p docker kube-credential --region us-east-1

# Create environment and deploy
eb create kube-credential-env

# Open in browser
eb open
```

### Option 4: Deploy to Render.com (Free Tier)

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: kube-credential
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click "Create Web Service"

Your app will be available at: `https://kube-credential.onrender.com`

### Option 5: Deploy to Railway.app (Free Tier)

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js and deploy
6. Get your public URL from the deployment

## Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t kube-credential:latest .

# Test locally
docker run -p 5000:5000 kube-credential:latest

# Access at http://localhost:5000
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag kube-credential:latest your-username/kube-credential:latest

# Push to Docker Hub
docker push your-username/kube-credential:latest
```

### Deploy to AWS ECS (Fargate)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name kube-credential
```

2. **Push Image to ECR**
```bash
# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag kube-credential:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/kube-credential:latest

# Push image
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/kube-credential:latest
```

3. **Create ECS Cluster and Service** (via AWS Console or CLI)

## Kubernetes Deployment

### Local Kubernetes (Minikube)

```bash
# Start Minikube
minikube start

# Build image in Minikube
eval $(minikube docker-env)
docker build -t kube-credential:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Get service URL
minikube service kube-credential-issuance --url
```

### AWS EKS Deployment

1. **Create EKS Cluster**
```bash
eksctl create cluster \
  --name kube-credential-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.micro \
  --nodes 2
```

2. **Deploy Application**
```bash
# Update kubeconfig
aws eks update-kubeconfig --name kube-credential-cluster --region us-east-1

# Deploy
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
```

## Environment Variables

For production deployment, set these environment variables:

```bash
NODE_ENV=production
PORT=5000
```

## Health Check

After deployment, verify the application is running:

```bash
curl https://your-app-url/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "workerId": "worker-xxxx",
  "timestamp": "2025-10-08T12:00:00.000Z"
}
```

## Monitoring

### Check Logs

**PM2:**
```bash
pm2 logs kube-credential
```

**Docker:**
```bash
docker logs <container-id>
```

**Kubernetes:**
```bash
kubectl logs -l app=kube-credential --tail=100
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# or on Windows
netstat -ano | findstr :5000

# Kill the process
kill -9 <PID>
```

### Database Issues
```bash
# Reset database
rm credentials.db
# Restart application
```

### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Scaling

### Horizontal Scaling (Kubernetes)

```bash
# Scale issuance service
kubectl scale deployment kube-credential-issuance --replicas=5

# Scale verification service
kubectl scale deployment kube-credential-verification --replicas=3

# Enable autoscaling
kubectl apply -f k8s/hpa.yaml
```

### Vertical Scaling (AWS)

- Upgrade EC2 instance type (t2.micro → t2.small → t2.medium)
- Increase ECS task CPU/memory limits

## Cost Optimization

- **AWS Free Tier**: t2.micro EC2 instance (750 hours/month free for 12 months)
- **Render/Railway**: Free tier with automatic sleep after inactivity

## Security Checklist

- [ ] Enable HTTPS (use Let's Encrypt or cloud provider SSL)
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up authentication if needed
- [ ] Use environment variables for sensitive data
- [ ] Enable firewall rules
- [ ] Regular security updates

## Next Steps

1. Choose your deployment platform
2. Follow the specific deployment steps
3. Test the deployed application
4. Take screenshots/recordings
5. Document the deployment URL
6. Prepare submission package
