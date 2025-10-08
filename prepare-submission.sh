#!/bin/bash

# Kube Credential - Submission Preparation Script
# This script helps prepare your project for submission

echo "========================================"
echo "Kube Credential - Submission Preparation"
echo "========================================"
echo ""

# Step 1: Run tests
echo "[1/6] Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Please fix errors before submission."
    exit 1
fi
echo "✅ All tests passed!"
echo ""

# Step 2: Check for required files
echo "[2/6] Checking required files..."
required_files=(
    "README.md"
    "package.json"
    "Dockerfile"
    "k8s/issuance-deployment.yaml"
    "k8s/verification-deployment.yaml"
    "k8s/ingress.yaml"
    "k8s/hpa.yaml"
    "server/index.ts"
    "server/routes.ts"
    "client/src/App.tsx"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi
echo "✅ All required files present!"
echo ""

# Step 3: Check README for contact information
echo "[3/6] Checking README for contact information..."
if grep -q "\[YOUR NAME HERE\]" README.md || \
   grep -q "\[YOUR EMAIL HERE\]" README.md || \
   grep -q "\[YOUR CONTACT NUMBER HERE\]" README.md; then
    echo "⚠️  WARNING: Please update your contact information in README.md"
    echo "   Replace [YOUR NAME HERE], [YOUR EMAIL HERE], and [YOUR CONTACT NUMBER HERE]"
else
    echo "✅ Contact information appears to be filled!"
fi
echo ""

# Step 4: Check for screenshots
echo "[4/6] Checking for screenshots..."
if [ ! -d "screenshots" ]; then
    mkdir -p screenshots
fi

screenshot_count=$(find screenshots -name "*.png" 2>/dev/null | wc -l)
if [ $screenshot_count -eq 0 ]; then
    echo "⚠️  WARNING: No screenshots found in screenshots/ directory"
    echo "   Please add demonstration screenshots before submission"
else
    echo "✅ Found $screenshot_count screenshot(s)"
fi
echo ""

# Step 5: Build the project
echo "[5/6] Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before submission."
    exit 1
fi
echo "✅ Build successful!"
echo ""

# Step 6: Create submission package
echo "[6/6] Creating submission package..."

# Clean up unnecessary files
rm -f credentials.db test-credentials.db

# Create zip file
timestamp=$(date +"%Y%m%d-%H%M%S")
zip_name="kube-credential-submission-$timestamp.zip"

# Create zip with selected files
zip -r "$zip_name" \
    client \
    server \
    shared \
    k8s \
    screenshots \
    package.json \
    package-lock.json \
    Dockerfile \
    README.md \
    DEPLOYMENT_GUIDE.md \
    SUBMISSION_CHECKLIST.md \
    design_guidelines.md \
    tsconfig.json \
    vite.config.ts \
    vitest.config.ts \
    tailwind.config.ts \
    postcss.config.js \
    components.json \
    drizzle.config.ts \
    -x "*/node_modules/*" "*/dist/*" "*/.git/*" "*/credentials.db" \
    > /dev/null 2>&1

echo "✅ Submission package created: $zip_name"
echo ""

# Summary
echo "========================================"
echo "Submission Preparation Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Update README.md with your contact information"
echo "2. Add screenshots to the screenshots/ directory"
echo "3. Deploy your application to a cloud platform"
echo "4. Update README.md with deployment URL"
echo "5. Upload $zip_name to Google Drive"
echo "6. Set Google Drive link to public access"
echo "7. Send submission email to hrfs@zupple.technology"
echo ""
echo "Submission package: $zip_name"
zip_size=$(du -h "$zip_name" | cut -f1)
echo "Size: $zip_size"
echo ""
echo "Good luck! 🚀"
