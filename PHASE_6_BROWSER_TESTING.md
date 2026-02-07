# Phase 6 Browser Testing Guide

## Prerequisites

Before starting, make sure:

1. Backend is running: `cd back-end && npm run dev` (port 5005)
2. Frontend is running: `cd front-end && npm run dev` (port 5173)
3. `.env` in back-end contains: `ADMIN_PASSWORD=admin123`

---

## Phase 6.1 Testing: Draft Projects

### Test 1: Create a Published Project

1. Navigate to http://localhost:5173
2. Scroll to "Other projects" section
3. Click **"+ Add Project"** button
4. Fill form:
   - Title: "My First Project"
   - Description: "A published project"
   - Category: "Web"
   - **Publish checkbox: ✅ CHECKED**
5. Click "Add project"
6. **Expected Result**:
   - ✅ Project appears immediately in project list
   - ✅ No "DRAFT" badge

### Test 2: Create a Draft Project

1. Click **"+ Add Project"** button again
2. Fill form:
   - Title: "My First Draft"
   - Description: "This is a draft project"
   - Category: "Web"
   - **Publish checkbox: ⬜ UNCHECKED**
3. Click "Add project"
4. **Expected Result**:
   - ✅ Project does NOT appear in list
   - ✅ Console shows no errors

### Test 3: Login as Admin

1. Look at top-right corner of navbar
2. Click **🔐 (lock icon)** button
3. Browser prompt appears: "Admin password:"
4. Type: `admin123`
5. **Expected Result**:
   - ✅ Lock icon (🔐) changes to checkmark (✓)
   - ✅ Green checkmark appears in nav
   - ✅ Dashboard button (📊) now visible

### Test 4: View Draft as Admin

1. Still logged in as admin
2. Scroll to "Other projects" section
3. **Expected Result**:
   - ✅ "My First Draft" now appears
   - ✅ Shows red "DRAFT" badge next to title
   - ✅ Both "Publish" and "Delete" buttons visible

### Test 5: Publish a Draft

1. Still admin, "My First Draft" visible
2. Click **green "Publish" button** on draft card
3. Wait ~1 second for button to update
4. **Expected Result**:
   - ✅ Button changes to red "Unpublish"
   - ✅ "DRAFT" badge disappears
   - ✅ Project title no longer has badge

### Test 6: Unpublish a Project

1. Still admin
2. Click **red "Unpublish" button** on the project
3. Wait ~1 second
4. **Expected Result**:
   - ✅ Button changes to green "Publish"
   - ✅ "DRAFT" badge reappears
   - ✅ Red badge shows on title

### Test 7: Logout

1. Still in admin mode
2. Click **✓ (checkmark)** button in navbar
3. **Expected Result**:
   - ✅ Checkmark changes back to lock (🔐)
   - ✅ Dashboard button (📊) disappears
   - ✅ All draft projects immediately hidden from view
   - ✅ Publish/Unpublish buttons disappear

### Test 8: GitHub Integration with Drafts

1. Click **"Sync from GitHub"** button
2. Select 1-2 repos to add
3. Confirm
4. **Expected Result**:
   - ✅ New projects appear immediately (should be published by default)
   - ✅ No "DRAFT" badge on GitHub projects
   - ✅ They are visible to everyone

---

## Phase 6.2 Testing: Admin Dashboard

### Test 9: Open Admin Dashboard

1. Login again: Click 🔐, enter `admin123`
2. Look for **📊 (chart icon)** in navbar
3. Click **📊 button**
4. **Expected Result**:
   - ✅ Modal overlay appears
   - ✅ "Admin Dashboard" title shows
   - ✅ Dashboard content visible

### Test 10: Check Stats Cards

1. Dashboard open
2. Look at top 4 cards:
   - **Total Projects**: Should show total count
   - **Published**: Should show green number
   - **Drafts**: Should show red number
   - **Total Views**: Should show "0" (we haven't tracked views yet)
3. **Expected Result**:
   - ✅ All 4 cards visible with correct numbers
   - ✅ Colors match (green=published, red=drafts)

### Test 11: Check Projects Table

1. Dashboard still open
2. Scroll down in modal to "All Projects" table
3. Look for columns: Title, Status, Category, Views, Created
4. **Expected Result**:
   - ✅ All projects listed (including drafts)
   - ✅ Status shows "Published" or "Draft" with color badges
   - ✅ Can see project titles, categories, created dates

### Test 12: Verify Correct Data

1. Count projects in table manually
2. Compare to "Total Projects" stat card
3. Count red "Draft" badges in table
4. Compare to "Drafts" stat card
5. **Expected Result**:
   - ✅ Numbers match exactly

### Test 13: Close Dashboard

1. Click **✕ (close button)** in top-right of modal
2. **Expected Result**:
   - ✅ Dashboard modal disappears
   - ✅ Page scrolls back to where you were

### Test 14: Toggle Dashboard On/Off

1. Click **📊** to open
2. Click **📊** again to close (without clicking ✕)
3. **Expected Result**:
   - ✅ Dashboard opens on first click
   - ✅ Dashboard closes on second click
   - ✅ Toggle works smoothly

### Test 15: Logout While Dashboard Open

1. Open dashboard (📊)
2. Click **✓** logout button
3. **Expected Result**:
   - ✅ Dashboard closes automatically
   - ✅ 📊 button disappears from navbar
   - ✅ You're back to non-admin view

---

## Error Checking

### Browser Console (F12)

After each test, check for:

- ❌ No red errors
- ❌ No fetch failures (404, 500)
- ⚠️ Warnings are OK

### Network Tab (F12 → Network)

Check requests:

- `POST /api/projects` → Should be 201 Created
- `PATCH /api/projects/{id}` → Should be 200 OK
- `GET /api/admin/stats` → Should be 200 OK
- `GET /api/admin/projects` → Should be 200 OK

---

## Test Results Checklist

| Test                               | Expected              | Actual | Pass/Fail |
| ---------------------------------- | --------------------- | ------ | --------- |
| 1. Create published project        | Appears immediately   |        |           |
| 2. Create draft project            | Hidden from non-admin |        |           |
| 3. Admin login                     | 🔐 → ✓                |        |           |
| 4. View draft as admin             | Shows with badge      |        |           |
| 5. Publish draft                   | Badge disappears      |        |           |
| 6. Unpublish project               | Badge reappears       |        |           |
| 7. Admin logout                    | 📊 disappears         |        |           |
| 8. GitHub sync (default published) | Appears immediately   |        |           |
| 9. Open dashboard                  | Modal appears         |        |           |
| 10. Stats cards show               | All 4 cards visible   |        |           |
| 11. Projects table                 | All projects listed   |        |           |
| 12. Stats accuracy                 | Numbers match         |        |           |
| 13. Close dashboard                | Modal closes          |        |           |
| 14. Toggle dashboard               | On/off works          |        |           |
| 15. Logout w/ dashboard open       | Dashboard closes      |        |           |

---

## Common Issues & Solutions

### Issue: Draft project shows even logged out

**Solution**: Check network tab - may not have updated. Refresh page.

### Issue: Admin stats show wrong numbers

**Solution**: May need to refresh dashboard or clear browser cache.

### Issue: 401 Unauthorized errors

**Solution**: Check that `ADMIN_PASSWORD` is set in `.env` and matches password entered.

### Issue: Draft badge doesn't appear

**Solution**: Check that `published: false` is in the API response. Refresh page.

### Issue: Publish button doesn't work

**Solution**:

1. Check console for errors
2. Verify admin token is set (should see ✓ in nav)
3. Check network tab for PATCH request errors

---

## Success Criteria

✅ All 15 tests pass → Phase 6.1 & 6.2 are working!

If any test fails, note:

- Test number
- What should happen
- What actually happened
- Error messages (if any)
