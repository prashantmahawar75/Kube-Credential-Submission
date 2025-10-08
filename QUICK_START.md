# Quick Start Guide - Kube Credential

## For Immediate Testing (Local)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Application
Open your browser to: `http://localhost:5000`

### 5. Test the APIs

**Issue a Credential:**
1. Go to the Issuance page (default page)
2. Enter JSON credential:
```json
{
  "name": "John Doe",
  "role": "Developer",
  "department": "Engineering"
}
```
3. Click "Issue Credential"
4. Note the worker ID in the response

**Test Duplicate Detection:**
1. Submit the same credential again
2. Observe `alreadyIssued: true` in response

**Verify a Credential:**
1. Go to the Verification page
2. Enter the same credential JSON
3. Click "Verify Credential"
4. See `isValid: true` with original worker ID and timestamp

## For Quick Cloud Deployment

### Render.com (Recommended - Free Tier)

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (push your code to GitHub first)
4. Configure:
   - **Name**: kube-credential
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. Get your public URL: `https://kube-credential.onrender.com`

### Railway.app (Alternative - Free Tier)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys
6. Get your public URL from the deployment

## For Docker Testing

### Build and Run Locally

```bash
# Build Docker image
docker build -t kube-credential:latest .

# Run container
docker run -p 5000:5000 kube-credential:latest

# Access at http://localhost:5000
```

### Push to Docker Hub (Optional)

```bash
# Login
docker login

# Tag
docker tag kube-credential:latest your-username/kube-credential:latest

# Push
docker push your-username/kube-credential:latest
```

## For Kubernetes Testing (Local)

### Using Minikube

```bash
# Start Minikube
minikube start

# Build image in Minikube
eval $(minikube docker-env)
docker build -t kube-credential:latest .

# Deploy
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services

# Get URL
minikube service kube-credential-issuance --url
```

## Submission Preparation (5 Minutes)

### 1. Update Contact Information

Edit `README.md` and replace:
- `[YOUR NAME HERE]` with your name
- `[YOUR EMAIL HERE]` with your email
- `[YOUR CONTACT NUMBER HERE]` with your phone number
- `[YOUR DEPLOYMENT URL HERE]` with your deployed app URL

### 2. Take Screenshots

Take screenshots of:
1. Successful credential issuance
2. Duplicate detection
3. Valid credential verification
4. Invalid credential verification
5. Test results (`npm test`)

Save them in the `screenshots/` folder.

### 3. Create Submission Package

**Windows:**
```powershell
.\prepare-submission.ps1
```

**Mac/Linux:**
```bash
chmod +x prepare-submission.sh
./prepare-submission.sh
```

Or manually create a zip file with:
- All source code
- Screenshots
- README.md
- Kubernetes manifests

### 4. Upload to Google Drive

1. Upload the zip file to Google Drive
2. Right-click → Share → Change to "Anyone with the link"
3. Copy the link

### 5. Send Submission Email

Send to: `hrfs@zupple.technology`

**Subject**: Kube Credential Assignment Submission - [Your Name]

**Body**:
```
Dear Hiring Team,

Please find my submission for the Kube Credential assignment.

Google Drive Link: [Your Link]
Deployed Application: [Your URL]

Contact Information:
- Name: [Your Name]
- Email: [Your Email]
- Phone: [Your Phone]

Thank you for your consideration.

Best regards,
[Your Name]
```

## Troubleshooting

### Tests Failing
```bash
# Delete database and retry
rm credentials.db
npm test
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Issues

**Render/Railway not starting:**
- Check logs in the platform dashboard
- Ensure `PORT` environment variable is set to 5000
- Verify build command completed successfully
- Check that all dependencies are installed

## Quick Test Commands

```bash
# Run all tests
npm test

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript
npm run check
```

## API Test Examples (using curl)

```bash
# Health check
curl http://localhost:5000/api/health

# Issue credential
curl -X POST http://localhost:5000/api/issuance/issue \
  -H "Content-Type: application/json" \
  -d '{"credential": {"name": "Test User", "role": "Admin"}}'

# Verify credential
curl -X POST http://localhost:5000/api/verification/verify \
  -H "Content-Type: application/json" \
  -d '{"credential": {"name": "Test User", "role": "Admin"}}'
```

## Time Estimate

- **Local testing**: 5 minutes
- **Deployment**: 10-15 minutes
- **Screenshots**: 10 minutes
- **Submission prep**: 5 minutes
- **Total**: ~30-35 minutes

## Support

- See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions
- See `SUBMISSION_CHECKLIST.md` for complete submission checklist
- See `README.md` for architecture and API documentation

---

**You're almost done! Just deploy, take screenshots, and submit. Good luck! 🚀**
