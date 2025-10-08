# 🚀 Deploy to Render.com - Step by Step

## ✅ Your Code is on GitHub!

Repository: https://github.com/prashantmahawar75/Kube-Credential-Submission.git

---

## 📋 Deployment Steps (10 minutes)

### Step 1: Go to Render.com

1. Open your browser and go to: **[https://render.com](https://render.com)**
2. Click **"Get Started for Free"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your GitHub account

### Step 2: Create New Web Service

1. Once logged in, click **"New +"** button (top right)
2. Select **"Web Service"**
3. You'll see a list of your GitHub repositories

### Step 3: Connect Your Repository

1. Find **"Kube-Credential-Submission"** in the list
2. Click **"Connect"** button next to it
3. If you don't see it, click **"Configure account"** and grant access to the repository

### Step 4: Configure the Service

Fill in these settings:

**Basic Settings:**
- **Name**: `kube-credential` (or any name you prefer)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**: 
  ```
  npm start
  ```

**Instance Type:**
- Select **"Free"** (this is important!)

**Environment Variables:**
- Click **"Advanced"**
- Add environment variable:
  - **Key**: `NODE_ENV`
  - **Value**: `production`

### Step 5: Deploy!

1. Click **"Create Web Service"** button at the bottom
2. Render will start building your application
3. You'll see the build logs in real-time

**Build Process (5-10 minutes):**
- Installing dependencies...
- Building frontend...
- Building backend...
- Starting server...

### Step 6: Get Your URL

1. Once deployment is complete, you'll see **"Live"** status (green)
2. Your URL will be at the top: `https://kube-credential.onrender.com`
3. Click on it to open your app
4. **Copy this URL** - you'll need it for submission!

---

## ✅ Verify Deployment

### Test Your Deployed App

1. **Open your app URL** in browser
2. You should see the Issuance page
3. Test issuing a credential:
   ```json
   {
     "name": "Test User",
     "role": "Developer",
     "department": "Engineering"
   }
   ```
4. Click "Issue Credential" - should work!
5. Try issuing the same credential again - should show "already issued"
6. Go to Verification page and verify the credential

### Test API Endpoints

Open a new terminal and test:

```bash
# Replace YOUR_URL with your actual Render URL

# Health check
curl https://YOUR_URL.onrender.com/api/health

# Issue credential
curl -X POST https://YOUR_URL.onrender.com/api/issuance/issue \
  -H "Content-Type: application/json" \
  -d '{"credential": {"name": "Test", "role": "Dev"}}'

# Verify credential
curl -X POST https://YOUR_URL.onrender.com/api/verification/verify \
  -H "Content-Type: application/json" \
  -d '{"credential": {"name": "Test", "role": "Dev"}}'
```

---

## 🎯 Next Steps

Now that your app is deployed:

### 1. Update README (2 minutes)

Edit `README.md` and update the Contact Information section:

```markdown
## 📞 Contact Information

**Candidate Details:**
- **Name**: Prashant Mahawar
- **Email**: prashantmahawar75@gmail.com
- **Phone**: [Your Phone Number]

**Deployment URL:**
- **Live Application**: https://kube-credential.onrender.com

**Submission Date**: October 8, 2025

**Deployment Platform**: Render.com (Free Tier)
```

Then commit and push:
```bash
git add README.md
git commit -m "Update contact information and deployment URL"
git push origin main
```

### 2. Take Screenshots (5 minutes)

Go to your deployed app and take these screenshots:

1. **New credential issuance** → `screenshots/1-issuance-new.png`
2. **Duplicate detection** → `screenshots/2-issuance-duplicate.png`
3. **Valid verification** → `screenshots/3-verification-valid.png`
4. **Invalid verification** → `screenshots/4-verification-invalid.png`
5. **Test results** (run `npm test`) → `screenshots/5-test-results.png`
6. **Deployed app** → `screenshots/6-deployed-app.png`

### 3. Create Submission Package (2 minutes)

**Windows:**
```powershell
.\prepare-submission.ps1
```

**Mac/Linux:**
```bash
chmod +x prepare-submission.sh
./prepare-submission.sh
```

### 4. Upload to Google Drive (2 minutes)

1. Go to [Google Drive](https://drive.google.com)
2. Create folder: `Kube-Credential-Submission-Prashant`
3. Upload the zip file
4. Share → "Anyone with the link"
5. Copy the link

### 5. Send Submission Email (2 minutes)

**To**: `hrfs@zupple.technology`  
**Subject**: `Kube Credential Assignment Submission - Prashant Mahawar`

**Email Body**:
```
Dear Hiring Team,

Please find my submission for the Kube Credential Full Stack Engineer assignment.

📦 Google Drive Link (Project Files):
[Your Google Drive Link]

🌐 Deployed Application URL:
https://kube-credential.onrender.com

👤 Contact Information:
- Name: Prashant Mahawar
- Email: prashantmahawar75@gmail.com
- Phone: [Your Phone Number]
- GitHub: https://github.com/prashantmahawar75/Kube-Credential-Submission

📊 Project Summary:

Backend:
- Node.js 20 + TypeScript + Express
- Two microservices: Issuance & Verification
- SQLite persistence with better-sqlite3
- Worker ID tracking (format: worker-xxxx)
- Duplicate detection via SHA-256 hashing
- Race condition handling

Frontend:
- React 18 + TypeScript
- Two pages: Issuance & Verification
- Tailwind CSS + Shadcn UI
- TanStack Query for API calls
- Comprehensive error handling

Testing & DevOps:
- 11/11 unit tests passing (Vitest)
- Docker containerization
- Kubernetes manifests (deployments, services, HPA, ingress)
- Deployed on Render.com (free tier)

✨ Key Features:
✅ Two independently scalable microservices
✅ Worker ID tracking with format "credential issued by worker-n"
✅ Duplicate credential detection
✅ JSON credential validation with Zod
✅ Proper error handling and UI feedback
✅ Comprehensive documentation

📁 Submission Package Contents:
- Complete source code (client/, server/, shared/)
- 6 demonstration screenshots
- README.md with architecture and design decisions
- Kubernetes deployment manifests (k8s/)
- Docker configuration
- Unit tests with 100% pass rate
- Deployment guides

The application is fully functional and deployed. You can test all features immediately at the URL above.

Thank you for your consideration. I look forward to discussing this project further.

Best regards,
Prashant Mahawar
prashantmahawar75@gmail.com
[Your Phone Number]
```

---

## 🔧 Troubleshooting

### Build Failed?

**Check the logs** in Render dashboard:
- Look for error messages
- Common issues:
  - Missing dependencies → Check package.json
  - Build command failed → Verify build script
  - Port issues → Render uses PORT environment variable

**Solutions:**
1. Make sure `package.json` has all dependencies
2. Verify build command: `npm install && npm run build`
3. Verify start command: `npm start`
4. Check that PORT is set to 5000 in your code

### App Not Loading?

1. Check Render dashboard - is it "Live"?
2. Check logs for errors
3. Try redeploying: Click "Manual Deploy" → "Deploy latest commit"

### Database Issues?

Render's free tier has ephemeral storage, so the database will reset on restart. This is fine for the assignment demonstration.

---

## 📊 What You've Accomplished

✅ **Code pushed to GitHub**  
✅ **Deployed to Render.com**  
✅ **Live URL obtained**  
✅ **All features working**  

**Remaining (~15 minutes):**
- Update README with your info
- Take 6 screenshots
- Create submission package
- Upload to Google Drive
- Send email

---

## 🎉 You're Almost Done!

Your app is live and working! Just complete the remaining steps and submit.

**Your Deployment URL**: https://kube-credential.onrender.com (or similar)

**Good luck! 🚀**
