# Kube Credential - Submission Preparation Script
# This script helps prepare your project for submission

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kube Credential - Submission Preparation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Run tests
Write-Host "[1/6] Running tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed! Please fix errors before submission." -ForegroundColor Red
    exit 1
}
Write-Host "✅ All tests passed!" -ForegroundColor Green
Write-Host ""

# Step 2: Check for required files
Write-Host "[2/6] Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "README.md",
    "package.json",
    "Dockerfile",
    "k8s/issuance-deployment.yaml",
    "k8s/verification-deployment.yaml",
    "k8s/ingress.yaml",
    "k8s/hpa.yaml",
    "server/index.ts",
    "server/routes.ts",
    "client/src/App.tsx"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Missing required files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    exit 1
}
Write-Host "✅ All required files present!" -ForegroundColor Green
Write-Host ""

# Step 3: Check README for contact information
Write-Host "[3/6] Checking README for contact information..." -ForegroundColor Yellow
$readmeContent = Get-Content "README.md" -Raw
if ($readmeContent -match "\[YOUR NAME HERE\]" -or 
    $readmeContent -match "\[YOUR EMAIL HERE\]" -or 
    $readmeContent -match "\[YOUR CONTACT NUMBER HERE\]") {
    Write-Host "⚠️  WARNING: Please update your contact information in README.md" -ForegroundColor Yellow
    Write-Host "   Replace [YOUR NAME HERE], [YOUR EMAIL HERE], and [YOUR CONTACT NUMBER HERE]" -ForegroundColor Yellow
} else {
    Write-Host "✅ Contact information appears to be filled!" -ForegroundColor Green
}
Write-Host ""

# Step 4: Check for screenshots
Write-Host "[4/6] Checking for screenshots..." -ForegroundColor Yellow
if (-not (Test-Path "screenshots")) {
    New-Item -ItemType Directory -Path "screenshots" | Out-Null
}

$screenshotFiles = Get-ChildItem "screenshots" -Filter "*.png" -ErrorAction SilentlyContinue
if ($screenshotFiles.Count -eq 0) {
    Write-Host "⚠️  WARNING: No screenshots found in screenshots/ directory" -ForegroundColor Yellow
    Write-Host "   Please add demonstration screenshots before submission" -ForegroundColor Yellow
} else {
    Write-Host "✅ Found $($screenshotFiles.Count) screenshot(s)" -ForegroundColor Green
}
Write-Host ""

# Step 5: Build the project
Write-Host "[5/6] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors before submission." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 6: Create submission package
Write-Host "[6/6] Creating submission package..." -ForegroundColor Yellow

# Clean up unnecessary files
if (Test-Path "credentials.db") {
    Remove-Item "credentials.db" -Force
}
if (Test-Path "test-credentials.db") {
    Remove-Item "test-credentials.db" -Force
}

# Create zip file
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "kube-credential-submission-$timestamp.zip"

# Files and folders to include
$itemsToZip = @(
    "client",
    "server",
    "shared",
    "k8s",
    "screenshots",
    "package.json",
    "package-lock.json",
    "Dockerfile",
    "README.md",
    "DEPLOYMENT_GUIDE.md",
    "SUBMISSION_CHECKLIST.md",
    "design_guidelines.md",
    "tsconfig.json",
    "vite.config.ts",
    "vitest.config.ts",
    "tailwind.config.ts",
    "postcss.config.js",
    "components.json",
    "drizzle.config.ts"
)

# Create temporary directory for clean packaging
$tempDir = "kube-credential-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files to temp directory
foreach ($item in $itemsToZip) {
    if (Test-Path $item) {
        Copy-Item $item -Destination $tempDir -Recurse -Force
    }
}

# Create zip
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName -Force

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

Write-Host "✅ Submission package created: $zipName" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Submission Preparation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update README.md with your contact information" -ForegroundColor White
Write-Host "2. Add screenshots to the screenshots/ directory" -ForegroundColor White
Write-Host "3. Deploy your application to a cloud platform" -ForegroundColor White
Write-Host "4. Update README.md with deployment URL" -ForegroundColor White
Write-Host "5. Upload $zipName to Google Drive" -ForegroundColor White
Write-Host "6. Set Google Drive link to public access" -ForegroundColor White
Write-Host "7. Send submission email to hrfs@zupple.technology" -ForegroundColor White
Write-Host ""
Write-Host "Submission package: $zipName" -ForegroundColor Green
Write-Host "Size: $([math]::Round((Get-Item $zipName).Length / 1MB, 2)) MB" -ForegroundColor Green
Write-Host ""
Write-Host "Good luck! 🚀" -ForegroundColor Cyan
