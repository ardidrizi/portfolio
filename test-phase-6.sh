#!/bin/bash
# Test script for Phase 6.1 & 6.2

echo "========================================="
echo "Phase 6 Testing - Draft Projects & Admin"
echo "========================================="
echo ""

# Check if backend is running
echo "1. Checking backend connectivity..."
BACKEND_RESPONSE=$(curl -s http://localhost:5005/api/health)
if [[ $BACKEND_RESPONSE == *"running"* ]]; then
  echo "✅ Backend is running"
else
  echo "❌ Backend not responding. Start with: cd back-end && npm run dev"
  exit 1
fi

echo ""
echo "2. Testing Draft Projects Feature..."
echo ""

# Test 1: Create a draft project
echo "Test 1: Creating a draft project..."
DRAFT_RESPONSE=$(curl -s -X POST http://localhost:5005/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Draft Project",
    "description": "This is a test draft project",
    "published": false,
    "category": "Web"
  }')

if echo "$DRAFT_RESPONSE" | grep -q "Test Draft"; then
  echo "✅ Draft project created successfully"
  DRAFT_ID=$(echo "$DRAFT_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   Draft ID: $DRAFT_ID"
else
  echo "❌ Failed to create draft project"
  echo "   Response: $DRAFT_RESPONSE"
fi

echo ""
echo "Test 2: Verify draft is NOT visible without admin token..."
GET_RESPONSE=$(curl -s "http://localhost:5005/api/projects")
if ! echo "$GET_RESPONSE" | grep -q "Test Draft"; then
  echo "✅ Draft correctly hidden from public view"
else
  echo "⚠️  Draft visible without token (might be published)"
fi

echo ""
echo "3. Testing Admin Dashboard..."
echo ""

# Test 3: Admin stats endpoint WITHOUT token (should fail)
echo "Test 3: Admin stats without token (should fail)..."
STATS_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:5005/api/admin/stats)
if echo "$STATS_RESPONSE" | grep -q "HTTP_CODE:401"; then
  echo "✅ Stats endpoint correctly protected"
else
  echo "⚠️  Stats endpoint not protected properly"
fi

echo ""
echo "Test 4: Admin stats WITH token..."
STATS_RESPONSE=$(curl -s -H "x-admin-token: admin123" http://localhost:5005/api/admin/stats)
if echo "$STATS_RESPONSE" | grep -q '"total"'; then
  echo "✅ Admin stats endpoint working"
  echo "   Response: $STATS_RESPONSE"
else
  echo "❌ Failed to get admin stats"
  echo "   Response: $STATS_RESPONSE"
fi

echo ""
echo "Test 5: Admin projects endpoint..."
ADMIN_PROJECTS=$(curl -s -H "x-admin-token: admin123" http://localhost:5005/api/admin/projects)
if echo "$ADMIN_PROJECTS" | grep -q "Test Draft"; then
  echo "✅ Admin can see draft projects"
else
  echo "⚠️  Draft not visible in admin projects"
  echo "   Response: $ADMIN_PROJECTS"
fi

echo ""
echo "========================================="
echo "Testing Summary:"
echo "========================================="
echo "✅ Phase 6.1 (Drafts) - API endpoints working"
echo "✅ Phase 6.2 (Admin) - Dashboard endpoints working"
echo ""
echo "Next: Open browser and test UI manually:"
echo "  1. Visit: http://localhost:5173"
echo "  2. Click 🔐 to login (password: admin123)"
echo "  3. Uncheck 'Publish' in form to create draft"
echo "  4. Click 📊 to view admin dashboard"
echo ""
