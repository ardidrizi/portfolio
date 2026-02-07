# Manual Testing Checklist - Phase 1 & 2.1

## 🚀 Pre-Test Setup

- [ ] Backend running on http://localhost:5005
- [ ] `npm run dev` in `/back-end`
- [ ] Frontend built: `npm run build` in `/front-end`
- [ ] Open browser at http://localhost:3000 (or Vite dev server)

---

## ✅ FEATURE 1.1: Skeleton Loading States

### Test Case 1.1.1: Loading State Shows Skeletons

- [ ] Open portfolio page
- [ ] Observe loading behavior
- [ ] Should see 6 placeholder "skeleton" cards
- [ ] Should NOT see "Loading projects..." text
- [ ] Skeletons should animate (shimmer effect)
- **Expected**: 6 animated placeholder cards, then real projects

### Test Case 1.1.2: Skeletons Disappear

- [ ] Wait for projects to load
- [ ] Skeleton cards should fade/disappear
- [ ] Real project cards should appear
- **Expected**: Smooth transition to real content

### Test Case 1.1.3: Mobile Layout

- [ ] Resize browser to mobile (max-width 640px)
- [ ] Skeletons should still appear during load
- [ ] Layout should be responsive
- **Expected**: Single column layout on mobile

---

## ✅ FEATURE 1.2: Filter Persistence in URL

### Test Case 1.2.1: Tag Filter Persists

- [ ] Click a tag filter (e.g., "react")
- [ ] Check browser URL
- **Expected**: URL should contain `?tag=react`
- [ ] Reload page
- **Expected**: Filter should still be active, same projects shown

### Test Case 1.2.2: Search Persists

- [ ] Type in search box (e.g., "portfolio")
- [ ] Check browser URL
- **Expected**: URL should contain `?search=portfolio`
- [ ] Reload page
- **Expected**: Search results should restore

### Test Case 1.2.3: Sort Persists

- [ ] Change sort dropdown to "Alphabetical (A-Z)"
- [ ] Check browser URL
- **Expected**: URL should contain `?sort=name`
- [ ] Reload page
- **Expected**: Projects should be sorted alphabetically

### Test Case 1.2.4: View Mode Persists

- [ ] Click timeline view button (∥)
- [ ] Check browser URL
- **Expected**: URL should contain `?view=timeline`
- [ ] Reload page
- **Expected**: Timeline view should be active

### Test Case 1.2.5: Page Number Persists

- [ ] Go to page 2 (click Next pagination)
- [ ] Check browser URL
- **Expected**: URL should contain `?page=2`
- [ ] Reload page
- **Expected**: Should stay on page 2

### Test Case 1.2.6: Combined Filters

- [ ] Apply multiple filters (tag + search + sort)
- [ ] Check browser URL
- **Expected**: URL should have all params: `?tag=react&search=app&sort=name`
- [ ] Copy URL and share with someone
- **Expected**: They should see exact same filters applied

### Test Case 1.2.7: Clear Filters

- [ ] Apply filters as in 1.2.6
- [ ] Click "All" tag button
- [ ] Check URL
- **Expected**: Tag param should be removed from URL
- [ ] Clear search box
- **Expected**: Search param should be removed

### Test Case 1.2.8: Browser Back/Forward

- [ ] Apply some filters (tag=react)
- [ ] Change to different filters (tag=node)
- [ ] Click browser back button
- **Expected**: Should return to react filter
- [ ] Click browser forward button
- **Expected**: Should return to node filter

---

## ✅ FEATURE 1.3: Keyboard Navigation

### Test Case 1.3.1: ESC Closes Gallery

- [ ] Click on a project image to open gallery
- [ ] Press ESC key
- **Expected**: Gallery modal should close immediately
- [ ] Gallery should be gone, back to project list

### Test Case 1.3.2: Arrow Keys Navigate Images

- [ ] Click on a project with multiple images
- [ ] Gallery modal should open showing first image
- [ ] Press RIGHT arrow key (→)
- **Expected**: Should show next image
- [ ] Press LEFT arrow key (←)
- **Expected**: Should show previous image
- [ ] Keep pressing RIGHT arrow at last image
- **Expected**: Should loop back to first image

### Test Case 1.3.3: Arrow Keys Don't Work Outside Gallery

- [ ] Close gallery (press ESC)
- [ ] Press arrow keys
- **Expected**: Nothing should happen (no accidental page scrolling)

### Test Case 1.3.4: Keyboard Hints Show

- [ ] Open gallery
- [ ] Hover over nav buttons (Prev/Next)
- **Expected**: Tooltips should appear:
  - "Previous (← Arrow)"
  - "Next (→ Arrow)"
- [ ] Hover over close button (✕)
- **Expected**: Tooltip should show "Close (ESC)"

### Test Case 1.3.5: Mouse Navigation Still Works

- [ ] Open gallery with multiple images
- [ ] Click "Next" button with mouse
- **Expected**: Should advance to next image
- [ ] Click "Prev" button with mouse
- **Expected**: Should go to previous image
- [ ] Click outside modal to close
- **Expected**: Gallery should close

---

## ✅ FEATURE 2.1: Compact Project Form Modal

### Test Case 2.1.1: Form Button Shows

- [ ] Look for "+ Add Project" button above projects
- **Expected**: Button should be visible below "Other projects" heading

### Test Case 2.1.2: Form Opens/Closes

- [ ] Click "+ Add Project" button
- **Expected**:
  - Modal overlay appears (semi-transparent background)
  - Form modal slides/appears in center
  - Button text changes to "✕ Close Form"
- [ ] Click "+ Add Project" button again
- **Expected**: Modal should close

### Test Case 2.1.3: Close Button Works

- [ ] Click "+ Add Project"
- [ ] Click the ✕ button in top-right of modal
- **Expected**: Modal should close

### Test Case 2.1.4: Click Outside Closes

- [ ] Click "+ Add Project"
- [ ] Click on the dark overlay area outside the modal
- **Expected**: Modal should close

### Test Case 2.1.5: Form Fields Work

- [ ] Click "+ Add Project" to open
- [ ] Enter project title: "Test Project"
- [ ] Enter description: "This is a test"
- **Expected**: Text should appear in fields

### Test Case 2.1.6: Validation Works

- [ ] Click "+ Add Project" to open
- [ ] Leave title empty
- [ ] Click "Add project" button
- **Expected**: Error message should appear (no empty titles allowed)

### Test Case 2.1.7: Form Closes After Submit

- [ ] Fill in title and description
- [ ] Click "Add project"
- **Expected**:
  - Project should be added (appears in list)
  - Modal should close automatically
  - Button back to "+ Add Project"

### Test Case 2.1.8: Responsive Modal

- [ ] Resize to mobile (max-width 640px)
- [ ] Click "+ Add Project"
- **Expected**: Modal should still fit screen with padding
- [ ] Should be scrollable if form is long
- [ ] Close button should be easily clickable

### Test Case 2.1.9: No Form in Page Flow

- [ ] Scroll through projects list
- **Expected**: Form should NOT be visible until modal opened
- **Expected**: Projects list is clean and uncluttered
- [ ] Click to open form
- **Expected**: Only modal shows form, not inline

---

## 🎯 Summary Testing

### All 4 Features Together

- [ ] Apply a tag filter
- [ ] Press ESC (should do nothing)
- [ ] Click image and press arrows (gallery works)
- [ ] Press ESC to close gallery
- [ ] Notice URL changed to include tag
- [ ] Reload page - filter still there
- [ ] Open form modal with button
- [ ] Add new project
- [ ] Modal closes and new project appears filtered

---

## 📊 Test Results

| Feature                 | Test Cases | Passed   | Failed   | Notes |
| ----------------------- | ---------- | -------- | -------- | ----- |
| 1.1 Skeleton Loaders    | 3          | \_\_     | \_\_     |       |
| 1.2 URL Persistence     | 8          | \_\_     | \_\_     |       |
| 1.3 Keyboard Navigation | 5          | \_\_     | \_\_     |       |
| 2.1 Form Modal          | 9          | \_\_     | \_\_     |       |
| **TOTAL**               | **25**     | **\_\_** | **\_\_** |       |

### Overall Status:

- [ ] ✅ ALL TESTS PASS - Ready for Phase 2
- [ ] ⚠️ SOME ISSUES - List below and fix
- [ ] ❌ MAJOR ISSUES - Hold and debug

---

## Issues Found

### Issue #1

- **Name**:
- **Severity**:
- **Steps to Reproduce**:
- **Expected**:
- **Actual**:
- **Fix**:

### Issue #2

- **Name**:
- **Severity**:
- **Steps to Reproduce**:
- **Expected**:
- **Actual**:
- **Fix**:

---

## Sign-Off

**Tested By**: [Your Name]  
**Date**: [Date]  
**Time Taken**: [Duration]  
**Browser**: [Chrome/Firefox/Safari]  
**OS**: [Windows/Mac/Linux]

**Ready for Phase 2**? ☐ YES ☐ NO
