# Phase 6: Admin Features Implementation Guide

## Overview

Phase 6 adds admin capabilities for managing the portfolio: drafts, analytics dashboard, bulk operations, and advanced features.

## 6.1 Draft Projects (Estimated: 30 min)

### What it does:

- Save projects as "Draft" (unpublished)
- Only admin sees drafts
- Publish/unpublish projects without deletion

### Implementation Steps:

1. **Database Update**

   ```prisma
   // In schema.prisma, add to Project model:
   published Boolean @default(true)
   updatedAt DateTime @updatedAt
   ```

2. **Backend API**

   ```javascript
   // Update POST /api/projects to accept 'published' field
   // Add PATCH /api/projects/:id to update publish status
   // Modify GET /api/projects to filter by published flag if not admin
   ```

3. **Frontend UI**
   - Add toggle "Publish" checkbox in project form
   - Show draft badge on draft projects
   - Add "Publish Project" button on project cards

---

## 6.2 Admin Dashboard (Estimated: 45 min)

### What it does:

- Protected `/admin` page (requires password or token)
- View all projects (published + drafts)
- Quick stats: total projects, published, drafts, views
- Bulk delete/publish operations

### Implementation:

1. **Admin Page Component** (`AdminDashboard.jsx`)
   - Protected route with auth check
   - Stats cards showing counts
   - Table listing all projects
   - Bulk action checkboxes

2. **Backend Endpoints**

   ```javascript
   // GET /api/admin/stats - Returns counts
   // DELETE /api/projects/bulk - Bulk delete
   // PATCH /api/projects/bulk - Bulk publish/unpublish
   ```

3. **Authentication** (Simple approach)
   - Set `ADMIN_PASSWORD` in `.env`
   - Login form on `/admin`
   - Store token in sessionStorage (lost on browser close)

---

## 6.3 Analytics Dashboard (Estimated: 40 min)

### What it does:

- Track project views
- Show most viewed projects
- Timeline of views over time
- Browser/device breakdown

### Implementation:

1. **Tracking**
   - Log view on project card click
   - POST /api/projects/:id/view
   - Record: timestamp, referer, user-agent

2. **Analytics Table**
   - Create `ProjectView` model in Prisma
   - Query views by date range
   - Display in admin dashboard

3. **Charts** (use Chart.js or lightweight alternative)
   - Bar chart: top projects
   - Line chart: views over time

---

## 6.4 Bulk Operations (Estimated: 25 min)

### What it does:

- Bulk delete multiple projects
- Bulk change category/tags
- Bulk publish/unpublish
- Export projects as CSV/JSON

### Implementation:

1. **Bulk Delete**

   ```javascript
   // DELETE /api/projects/bulk
   // Body: { ids: ["id1", "id2", ...] }
   ```

2. **Bulk Update**

   ```javascript
   // PATCH /api/projects/bulk
   // Body: { ids: [...], updates: { category: "Web", published: true } }
   ```

3. **Export**
   ```javascript
   // GET /api/projects/export?format=csv
   // Generates CSV/JSON file download
   ```

---

## Recommended Implementation Order

1. **Start with 6.1** (Draft projects) - Foundation for other features
2. **Then 6.2** (Admin dashboard) - Basic admin panel
3. **Then 6.4** (Bulk operations) - Extend dashboard functionality
4. **Finally 6.3** (Analytics) - Optional, adds tracking overhead

---

## Security Considerations

⚠️ **IMPORTANT**: These features expose admin endpoints. Protect them:

```javascript
// Add auth middleware
const requireAdmin = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Apply to admin endpoints
app.delete("/api/projects/bulk", requireAdmin, ...)
app.get("/api/admin/stats", requireAdmin, ...)
```

## Environment Variables

```env
# Add to .env
ADMIN_PASSWORD=very_secure_password_here
```

---

## Testing Checklist

- [ ] Create draft project, verify it doesn't show on frontend
- [ ] Publish draft, verify it appears
- [ ] Bulk delete projects, verify they're gone
- [ ] Check analytics tracking works
- [ ] Verify admin routes require auth token
- [ ] Test export to CSV
- [ ] Performance test with large dataset (500+ projects)

---

## Future Enhancements

- Role-based access (admin, editor, viewer)
- Project scheduling (publish at future date)
- Analytics by traffic source
- Automated project categorization with ML
- SEO metadata editor per project
- Image optimization & CDN integration
