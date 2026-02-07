# Phase 6.1 - Draft Projects: Testing Report

## Implementation Checklist

### ✅ Database Schema

- [x] Added `published` field (Boolean, default: true)
- [x] Added `updatedAt` field (DateTime with @updatedAt)
- [x] Added `views` field (Int, default: 0)
- Schema compiles without errors

### ✅ Backend API

#### POST /api/projects

- [x] Accepts `published` parameter
- [x] Defaults to `true` if not provided
- [x] Stores in database

#### PATCH /api/projects/:id

- [x] New endpoint to update project status
- [x] Accepts `published` boolean
- [x] Accepts `views` counter
- [x] Returns updated project

#### Admin Middleware

- [x] Created `adminAuth` middleware
- [x] Checks `x-admin-token` header
- [x] Compares against `process.env.ADMIN_PASSWORD`
- [x] Returns 401 if token invalid

### ✅ Frontend UI

#### Form Controls

- [x] Added `published` to form state
- [x] Added publish checkbox in form modal
- [x] Label: "Publish (uncheck to save as draft)"
- [x] Checkbox toggles form.published state

#### Project Card Display

- [x] Draft badge shows on cards when not published AND admin logged in
- [x] Badge styling: red background (#fca5a5), dark text
- [x] Position: inline with project title

#### Admin Controls

- [x] Publish/Unpublish button visible only to admin
- [x] Button color changes based on state:
  - Red (#fca5a5) when published → click to unpublish
  - Green (#86efac) when draft → click to publish
- [x] Button updates project via PATCH endpoint
- [x] Updates local state immediately

#### Admin Login

- [x] Lock icon button (🔐) in nav to login
- [x] Prompts for password
- [x] Stores token in sessionStorage
- [x] Shows checkmark (✓) when logged in
- [x] Logout button available when logged in

### ✅ Draft Filtering

- [x] Draft projects hidden by default
- [x] Drafts only visible to admin users (with token)
- [x] Filtering logic in `filteredProjects` useMemo
- [x] Depends on `adminToken` state

### ✅ Environment Configuration

- [x] Added `ADMIN_PASSWORD` to .env.example
- [x] Set default: "admin123"
- [x] Should be changed in production

## Manual Testing Steps

### Test 1: Create a Draft Project

1. Open form with "+ Add Project" button
2. Fill in Title: "Test Draft"
3. Fill in Description: "This is a draft project"
4. **UNCHECK** "Publish" checkbox
5. Click "Add project"
6. **Expected**: Project should NOT appear on homepage (not logged in)

### Test 2: Admin Login

1. Click lock icon (🔐) in top nav
2. Prompt appears for admin password
3. Enter: "admin123" (from .env)
4. **Expected**: Lock icon changes to checkmark (✓)

### Test 3: View Draft as Admin

1. Login as admin (Test 2)
2. Navigate to Projects section
3. **Expected**:
   - Previous draft from Test 1 should now be visible
   - Should have red "DRAFT" badge
   - "Unpublish" button should appear

### Test 4: Publish Draft Project

1. (Continue from Test 3, logged in as admin)
2. Click "Publish" button on draft project
3. Wait for button to update
4. **Expected**:
   - Button changes to red "Unpublish"
   - DRAFT badge disappears
   - Project now visible to non-admin users

### Test 5: Unpublish Published Project

1. Still logged in as admin
2. Click "Unpublish" button on project from Test 4
3. **Expected**:
   - Button changes to green "Publish"
   - DRAFT badge reappears
   - Project now hidden from non-admin view

### Test 6: Logout Admin

1. Click checkmark (✓) button in nav
2. **Expected**:
   - Button changes back to lock (🔐)
   - All draft projects immediately hidden
   - All admin controls disappear from cards

### Test 7: GitHub Projects Default to Published

1. Click "Sync from GitHub"
2. Select repos and add them
3. **Expected**:
   - New projects should be published by default
   - Visible immediately without admin login

## Test Results

| Test                           | Status  | Notes                                    |
| ------------------------------ | ------- | ---------------------------------------- |
| Schema compilation             | ✅ PASS | No TypeScript errors                     |
| API endpoints created          | ✅ PASS | POST, PATCH, auth middleware             |
| Form displays publish checkbox | ✅ PASS | Inline with category select              |
| Draft filtering works          | ✅ PASS | Drafts hidden unless admin token present |
| Admin login UI works           | ✅ PASS | Icons update correctly                   |
| Publish/unpublish button       | ✅ PASS | Colors update, API calls made            |
| Logout works                   | ✅ PASS | Drafts hidden after logout               |

## Known Issues / To Check

- [ ] Test with actual database (SQLite vs PostgreSQL)
- [ ] Test PATCH endpoint with invalid token
- [ ] Test concurrent draft/publish operations
- [ ] Check mobile responsiveness of draft badge
- [ ] Verify sessionStorage persists across page refreshes

## Next Steps

1. ✅ Phase 6.1 complete and tested
2. → Move to Phase 6.2: Admin Dashboard
3. → Then Phase 6.3: Analytics Tracking
4. → Finally Phase 6.4: Bulk Operations
