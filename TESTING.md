# Testing Guide - Frontend Menu Management

## Prerequisites

1. **Backend API must be running**
   ```bash
   # In backend directory
   npm run start:dev
   ```
   Backend should be accessible at `http://localhost:3000`

2. **Backend database should be seeded**
   ```bash
   # In backend directory
   npm run prisma:seed
   ```

3. **Frontend environment configured**
   - Ensure `.env.local` exists with `NEXT_PUBLIC_API_URL=http://localhost:3000`

## Running the Application

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Manual Testing Checklist

### 1. ✅ Get Menus (View All)

**Test Steps:**
1. Navigate to `/menus` page
2. Verify loading indicator appears
3. Wait for menu tree to load

**Expected Results:**
- ✅ Loading spinner shows initially
- ✅ Menu tree displays hierarchically
- ✅ Default items expanded (first level)
- ✅ System Management structure visible

**Sample Data to Verify:**
```
System Management
├── Systems
├── System Code
│   ├── Code Registration
│   └── Code Registration - 2
├── Properties
├── Menus
│   └── Menu Registration
├── API List
│   ├── API Registration
│   └── API Edit
└── Users & Groups
    ├── Users
    │   └── User Account Registration
    └── Groups
        └── User Group Registration
```

---

### 2. ✅ Get Specific Menu (View Details)

**Test Steps:**
1. Click on any menu item in tree (e.g., "System Code")
2. Observe right panel

**Expected Results:**
- ✅ Detail form appears
- ✅ UUID displayed (read-only)
- ✅ Depth displayed (e.g., depth: 2)
- ✅ Parent ID displayed
- ✅ Name field populated (editable)
- ✅ Breadcrumb shows path (e.g., "System Management / System Code")
- ✅ Delete button (trash icon) visible

**Breadcrumb Test:**
- Root items: No breadcrumb
- Level 1: Shows parent name
- Level 2+: Shows full path with " / " separator

---

### 3. ✅ Show Hierarchically (Tree View)

**Test Steps:**
1. Click "Expand All" button
2. Click "Collapse All" button
3. Click individual caret icons (▶ ►)
4. Test keyboard navigation:
   - Select a node
   - Press ↓ (down arrow) - moves to next node
   - Press ↑ (up arrow) - moves to previous node
   - Press → (right arrow) - expands node
   - Press ← (left arrow) - collapses node
   - Press Enter - selects node

**Expected Results:**
- ✅ "Expand All" opens all nodes
- ✅ "Collapse All" closes all nodes
- ✅ Individual expand/collapse works
- ✅ Keyboard navigation functional
- ✅ Indent guides visible (desktop)
- ✅ Selected node highlighted (blue background)
- ✅ Plus button (+) appears on hover for nodes

**Responsive Testing:**
- Mobile (<640px): Indent guides hidden, larger tap targets
- Tablet (641-1024px): Standard view
- Desktop (>1024px): Full indent guides visible

---

### 4. ✅ Add Item Hierarchically

**Test Steps:**
1. Hover over a parent node (e.g., "System Code")
2. Click the Plus (+) button that appears
3. Observe form changes
4. Enter name: "Test New Item"
5. Click "Create" button
6. Verify refresh

**Expected Results:**
- ✅ Plus button visible on hover
- ✅ Form switches to "Add New Menu Item" mode
- ✅ Breadcrumb hidden in add mode
- ✅ Only Name field editable
- ✅ Depth auto-calculated (parent depth + 1)
- ✅ Parent ID auto-set
- ✅ "Cancel" and "Create" buttons visible
- ✅ After creation:
  - Tree refreshes
  - New item appears under parent
  - Success (no error)

**Test Different Depths:**
- Add to root item (depth 0 → 1)
- Add to level 2 item (depth 2 → 3)
- Add to deep nested item

**Error Cases:**
- Try creating with empty name → Button disabled
- Cancel button returns to view mode

---

### 5. ✅ Update Item

**Test Steps:**
1. Select any menu item
2. Change the Name field
3. Observe "Save" button
4. Click "Save"
5. Verify tree updates

**Expected Results:**
- ✅ Name field editable
- ✅ "Save" button disabled initially (not dirty)
- ✅ After typing: "Save" enabled (dirty state)
- ✅ After save:
  - Loading overlay appears
  - Tree refreshes
  - Updated name visible in tree
  - Form resets to clean state

**Validation:**
- Empty name: Save button disabled
- Whitespace only: Save button disabled
- Valid name: Save enabled

**Test Cases:**
- Update root item name
- Update child item name
- Update deeply nested item
- Update with special characters (spaces, punctuation)

---

### 6. ✅ Delete Item

**Test Steps:**
1. Select a menu item
2. Click trash icon (🗑️) in detail panel
3. Observe confirmation dialog
4. Click "Cancel" → Dialog closes
5. Repeat steps 1-2
6. Click "Delete" → Item deleted

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Message shows: "Delete [item name]? This will delete all children..."
- ✅ Cancel button works
- ✅ Delete button red (danger variant)
- ✅ After delete:
  - Tree refreshes
  - Item removed from tree
  - Children also removed (cascade)
  - Form clears

**Cascade Delete Test:**
1. Select item with children (e.g., "System Code")
2. Delete it
3. Verify all children deleted:
   - "Code Registration"
   - "Code Registration - 2"

**Edge Cases:**
- Delete root item (deletes entire branch)
- Delete leaf item (no children)
- Loading state during delete

---

### 7. ✅ Save Menu (Persist Changes)

**Test Process:**
1. Make changes (create/update/delete)
2. Refresh page (F5 or Ctrl+R)
3. Verify changes persisted

**Expected Results:**
- ✅ Created items still exist after refresh
- ✅ Updated names persist
- ✅ Deleted items remain deleted
- ✅ Tree structure maintained

**Data Persistence Tests:**
- Create item → Refresh → Item exists
- Update item → Refresh → Name updated
- Delete item → Refresh → Item gone
- Multiple operations → Refresh → All persisted

---

## Error Handling Tests

### Network Errors

1. **Backend Offline:**
   - Stop backend server
   - Reload page
   - Expected: Error alert shows "Network error or server unavailable"

2. **Invalid Endpoint:**
   - Change API URL to invalid
   - Expected: Error alert appears

3. **Timeout:**
   - Slow network simulation
   - Expected: Loading state, then error if timeout

### API Errors

1. **400 Bad Request:**
   - Try to create with invalid data (handled by frontend validation)

2. **404 Not Found:**
   - Manually trigger API call for non-existent ID
   - Expected: Error alert

3. **500 Server Error:**
   - Backend database issue
   - Expected: Error message displayed

### Validation Errors

1. **Empty Name:**
   - Try to save with empty name
   - Expected: Save button disabled

2. **Whitespace Name:**
   - Enter only spaces
   - Expected: Save button disabled (validation)

---

## Performance Tests

1. **Large Tree:**
   - Test with 50+ items
   - Verify smooth scrolling
   - Verify expand/collapse responsive

2. **Rapid Operations:**
   - Quick expand/collapse
   - Multiple selections
   - Verify no UI lag

3. **Mobile Performance:**
   - Test on actual mobile device
   - Verify smooth animations
   - Verify no scroll issues

---

## Responsive Tests

### Mobile (<640px)

1. Hamburger menu opens sidebar
2. Single-column layout
3. Toolbar buttons wrap to 2 rows
4. Tree tap targets ≥44px
5. Form full width

### Tablet (641-1024px)

1. Sidebar visible, can collapse
2. Two-column layout
3. Toolbar on one row

### Desktop (≥1024px)

1. Sidebar fixed 240px
2. Optimal grid layout
3. All features accessible

---

## Accessibility Tests

1. **Keyboard Navigation:**
   - Tab through all controls
   - Focus ring visible
   - All actions accessible

2. **Screen Reader:**
   - ARIA labels present
   - Role attributes correct
   - Tree navigation announced

3. **Color Contrast:**
   - Text readable
   - Focus indicators visible
   - Error states clear

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Android

---

## Known Limitations

1. **No Drag & Drop:** Items cannot be reordered by dragging
2. **No Bulk Operations:** Must delete/update one at a time
3. **No Search/Filter:** Large trees require manual navigation
4. **No Undo:** Deletions are permanent
5. **No Export/Import:** Cannot backup/restore menu structure

---

## Troubleshooting

### Issue: Tree doesn't load
- Check backend running: `curl http://localhost:3000/menus/tree`
- Check browser console for errors
- Verify `.env.local` configured

### Issue: Updates don't persist
- Check backend database connection
- Check API responses in Network tab
- Verify data actually changed in backend

### Issue: UI not responsive
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check for JavaScript errors

---

## Success Criteria

All features must:
- ✅ Load data from backend
- ✅ Display hierarchically
- ✅ Allow CRUD operations
- ✅ Persist changes to backend
- ✅ Show loading states
- ✅ Handle errors gracefully
- ✅ Work on mobile/tablet/desktop
- ✅ Meet accessibility standards

## Test Completion

Mark tests complete when:
- [ ] All manual tests passed
- [ ] Error scenarios handled
- [ ] Responsive design verified
- [ ] Accessibility checks passed
- [ ] Cross-browser tested
- [ ] Performance acceptable
