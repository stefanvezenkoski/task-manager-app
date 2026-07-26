#!/bin/bash

# Pre-commit Validation Script

echo "=== Starting Pre-Commit Validation ==="

# 1. Backend check
echo "👉 Checking backend Python files..."
python3 -m py_compile backend/app/*.py
if [ $? -ne 0 ]; then
  echo "❌ Backend syntax check failed!"
  exit 1
fi
echo "✅ Backend syntax check passed."

# 2. Frontend check
echo "👉 Checking frontend TypeScript build..."
# Navigate to frontend folder from root
if [ -d "frontend" ]; then
  cd frontend
elif [ -d "../frontend" ]; then
  cd ../frontend
fi

npm run build
if [ $? -ne 0 ]; then
  echo "❌ Frontend build/typecheck failed!"
  exit 1
fi
echo "✅ Frontend build/typecheck passed."

echo "=== All Pre-Commit Checks Passed successfully! ==="
exit 0
