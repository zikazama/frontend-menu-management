# Frontend Menu Management

A responsive Next.js 14 application for managing hierarchical menu structures with multi-tree support, Redux state management, and Tailwind CSS.

## Features

### Core Features
✅ **Tree Management** - Create, view, and switch between multiple menu trees
✅ **Get Menus** - Load and display all menu items from backend
✅ **Get Specific Menu** - View detailed information with breadcrumb navigation
✅ **Show Hierarchically** - Tree view with expand/collapse and keyboard navigation
✅ **Add Item Hierarchically** - Create child items with automatic depth calculation
✅ **Update Item** - Edit menu names with real-time validation
✅ **Delete Item** - Remove items with cascade delete confirmation
✅ **Save Menu** - All changes persist to backend database

### Additional Features
- ✅ Multi-tree support with tree selection dropdown
- ✅ Tree creation with custom names
- ✅ Click-to-expand/collapse tree nodes
- ✅ Dynamic plus button on selected nodes
- ✅ Parent name display (not just ID)
- ✅ Full responsive design (mobile/tablet/desktop)
- ✅ Redux Toolkit for state management
- ✅ Loading states and error handling
- ✅ Touch-friendly interactions (44px tap targets)
- ✅ Keyboard navigation (↑↓←→ Enter)
- ✅ Accessible UI components (WCAG compliant)
- ✅ Breadcrumb navigation showing menu path
- ✅ Confirmation dialogs for destructive actions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit with Async Thunks
- **Styling**: Tailwind CSS v3.4.17
- **Icons**: Lucide React
- **Language**: TypeScript
- **API Client**: Fetch API with custom error handling
- **Backend**: NestJS REST API

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000` (see backend README)

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**

   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
frontend-menu-management/
├── app/
│   ├── menus/              # Menus management page
│   │   └── page.tsx        # Main menu page with CRUD
│   ├── layout.tsx          # Root layout with Redux Provider
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # Redux Provider setup
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Layout components
│   │   ├── AppShell.tsx    # Main app layout with sidebar
│   │   └── Sidebar.tsx     # Navigation sidebar
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx      # Button component
│       ├── Input.tsx       # Input field
│       ├── Select.tsx      # Dropdown select
│       ├── Card.tsx        # Card container
│       ├── TreeView.tsx    # Hierarchical tree component
│       ├── Loading.tsx     # Loading indicators
│       ├── Alert.tsx       # Error/success alerts
│       └── Modal.tsx       # Confirmation dialogs
├── lib/
│   ├── api/                # API client & services
│   │   ├── client.ts       # Base API client with error handling
│   │   ├── menu.api.ts     # Menu API endpoints
│   │   └── tree.api.ts     # Tree API endpoints
│   └── redux/              # Redux store & slices
│       ├── store.ts        # Store configuration
│       ├── hooks.ts        # Typed Redux hooks
│       └── features/
│           └── menuSlice.ts    # Menu & tree state management
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Features Breakdown

### Multi-Tree Management

**Tree Operations:**
- Create new trees with custom names
- View all available trees in dropdown
- Switch between trees dynamically
- Each tree shows menu count (e.g., "System Management (19 items)")
- Trees are fetched from `/trees` API endpoint

**Tree Selection:**
- Dropdown shows: `{treeName} ({count} items)`
- Automatically selects first tree on load
- Switching trees fetches tree-specific menus
- Empty state shows "Create First Tree" button

### Menu Management

**CRUD Operations:**
- **Create**: Click "+" button on selected node or use "Add Root Menu"
- **Read**: Click any node to view details (UUID, depth, parent, name)
- **Update**: Edit name field and click "Save"
- **Delete**: Click trash icon, confirm in dialog

**Hierarchy Features:**
- Root items: depth 0, no parent
- Child items: parent.depth + 1
- Plus button appears on selected node
- Parent displayed as name (not ID)
- Breadcrumb shows full path

### Responsive Design

**Mobile (≤640px):**
- Off-canvas sidebar drawer
- Mobile navbar with hamburger menu
- Single-column stacked layout
- Touch-friendly tap targets (44px)
- Adaptive tree view height (60vh)
- Circular plus buttons (32px)

**Tablet (641–1024px):**
- Persistent collapsible sidebar
- Two-column grid layout
- Responsive toolbar with wrapping

**Desktop (≥1024px):**
- Fixed sidebar (240px)
- Three-column layout (sidebar + tree + details)
- Enhanced tree view height (70vh)
- Optimal spacing and padding

### TreeView Component

**Interaction:**
- Click node to select AND toggle expand/collapse
- Plus button appears on right side of selected node
- Keyboard navigation:
  - ↑/↓: Navigate between nodes
  - →: Expand node or move to first child
  - ←: Collapse node
  - Enter/Space: Select node

**Visual:**
- Indent guides for depth levels
- Chevron icons for expand/collapse state
- Blue highlight for selected node
- Hover effects on desktop
- Touch-optimized for mobile

## API Integration

### Tree API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/trees` | Create new tree |
| GET | `/trees` | Get all trees with menu count |
| GET | `/trees/:id` | Get tree by ID with all menus |
| GET | `/trees/treeId/:treeId` | Get tree by treeId |
| PATCH | `/trees/:id` | Update tree name |
| DELETE | `/trees/:id` | Delete tree (cascade) |

### Menu API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/menus` | Create single menu item |
| POST | `/menus/tree` | Create bulk tree structure |
| GET | `/menus` | Get all menus (flat) |
| GET | `/menus/trees` | Get all trees grouped |
| GET | `/menus/tree/:treeId` | Get menus by treeId (hierarchical) |
| GET | `/menus/tree` | Get all menus (hierarchical) |
| GET | `/menus/:id` | Get menu by ID |
| GET | `/menus/uuid/:uuid` | Get menu by UUID |
| PATCH | `/menus/:id` | Update menu |
| DELETE | `/menus/:id` | Delete menu (cascade) |

### Data Flow

1. **Load Trees**: Component mounts → `fetchAllTrees()` → Populate dropdown
2. **Select Tree**: User selects tree → `setTreeId()` → `fetchMenuTree(treeId)`
3. **Create Tree**: Click "New Tree" → Dialog → `createTree()` → Auto-select new tree
4. **Select Node**: Click node → `selectNode()` → Load details + breadcrumb
5. **Add Child**: Click "+" → `startAddingChild()` → Form with depth+1
6. **Update**: Edit name → `updateEditingNode()` → Mark dirty → `updateMenu()` → Refresh
7. **Delete**: Click trash → Confirm → `deleteMenu()` → Refresh tree

## Redux State Structure

```typescript
interface MenuState {
  // Tree data
  nodes: MenuNode[];                // Current tree's hierarchical menu nodes
  availableTrees: TreeDto[];        // All available trees with metadata
  selectedTreeId: string | null;    // Currently selected tree UUID

  // Selection & expansion
  selectedNodeId: number | null;    // Currently selected menu node
  expandedNodeIds: number[];        // IDs of expanded nodes

  // Editing
  editingNode: MenuNode | null;     // Node being edited/created
  isDirty: boolean;                 // Unsaved changes flag
  isAddingChild: boolean;           // Adding new child mode
  parentForNewChild: number | null; // Parent ID for new child

  // UI state
  breadcrumb: string[];             // Path to selected node
  loading: boolean;                 // Loading state
  error: string | null;             // Error message
}

interface MenuNode {
  id: number;
  uuid: string;
  name: string;
  treeId?: string;
  depth: number;
  parentId: number | null;
  children?: MenuNode[];
  createdAt: string;
  updatedAt: string;
}

interface TreeDto {
  id: number;
  treeId: string;
  treeName: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    menus: number;
  };
}
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Key User Flows

### Creating a New Tree
1. Click "New Tree" button in toolbar
2. Dialog appears with input field
3. Enter tree name (e.g., "Footer Navigation")
4. Press Enter or click "Create"
5. New tree is created and auto-selected
6. Empty state shows "Add Root Menu" button

### Adding Menu Items
1. Select a tree from dropdown
2. **For root item**: Click "Add Root Menu" button
3. **For child item**: Click a node to select it, then click "+" button
4. Form appears with auto-calculated depth
5. Enter menu name
6. Click "Create"
7. Tree refreshes with new item

### Editing Menu Items
1. Click a menu node to select it
2. Details panel shows:
   - UUID (read-only)
   - Depth (read-only)
   - Parent name (read-only)
   - Name (editable)
3. Edit the name field
4. "Save" button becomes enabled
5. Click "Save"
6. Tree refreshes with updated name

### Deleting Menu Items
1. Select a menu node
2. Click trash icon in detail panel
3. Confirmation dialog appears with warning
4. Click "Delete" to confirm
5. Node and all children are deleted (cascade)
6. Tree refreshes

### Navigating the Tree
- **Mouse**: Click nodes to select and toggle expand/collapse
- **Keyboard**: Use arrow keys, Enter, and Space
- **Touch**: Tap targets optimized at 44px minimum
- **Breadcrumb**: Shows full path (e.g., "System Management / Systems / System Code")

## Accessibility

- ✅ Focus ring indicators (green, 2px)
- ✅ Full keyboard navigation support
- ✅ ARIA labels and roles (treeitem, aria-expanded, aria-selected)
- ✅ Min 44px tap targets on mobile
- ✅ High contrast text/backgrounds
- ✅ Screen reader compatible
- ✅ Skip links for main content
- ✅ Semantic HTML structure

## Browser Support

- Chrome/Edge 90+ (latest recommended)
- Firefox 88+ (latest recommended)
- Safari 14+ (latest recommended)
- Mobile: iOS Safari 14+, Chrome Android 90+

## Troubleshooting

### API Connection Issues

**Problem**: Can't connect to backend

**Solution**:
1. Verify backend is running: `curl http://localhost:3000/trees`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Restart Next.js dev server: `npm run dev`

### Tree Not Loading

**Problem**: Dropdown is empty or shows no trees

**Solution**:
1. Check backend has seed data: `npm run prisma:seed` (in backend)
2. Open browser DevTools → Network tab → Check `/trees` response
3. Check Redux DevTools → State → `menu.availableTrees`

### Plus Button Not Appearing

**Problem**: Can't add child items

**Solution**:
1. Make sure node is selected (blue highlight)
2. Plus button appears on right side of selected node
3. Check `onAddChild` prop is passed to TreeView

### TypeScript Errors

**Problem**: Type errors after pulling changes

**Solution**:
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

### Expand/Collapse Not Working

**Problem**: Clicking node doesn't expand children

**Solution**:
1. Check `onToggleExpand` prop is wired to Redux action
2. Verify `expandedNodeIds` is synced from Redux state
3. Check browser console for errors

## Development Best Practices

### Adding New Features

1. **API First**: Add endpoint to `lib/api/`
2. **Redux Second**: Create thunk in `menuSlice.ts`
3. **Component Third**: Build UI in `components/ui/`
4. **Integration Last**: Wire up in `app/menus/page.tsx`

### State Management Pattern

```typescript
// 1. Define async thunk
export const fetchData = createAsyncThunk(
  'menu/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      return await Api.getData(params);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch');
    }
  }
);

// 2. Handle in extraReducers
builder
  .addCase(fetchData.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchData.fulfilled, (state, action) => {
    state.data = action.payload;
    state.loading = false;
  })
  .addCase(fetchData.rejected, (state, action) => {
    state.error = action.payload as string;
    state.loading = false;
  });

// 3. Use in component
const dispatch = useAppDispatch();
const data = useAppSelector(selectData);

useEffect(() => {
  dispatch(fetchData());
}, [dispatch]);
```

### Component Structure

```typescript
// 1. Imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectData, fetchData } from '@/lib/redux/features/slice';

// 2. Component
export default function Page() {
  // Redux state
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);

  // Local state
  const [isOpen, setIsOpen] = useState(false);

  // Effects
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Handlers
  const handleClick = () => {
    dispatch(someAction());
  };

  // Render
  return <div>...</div>;
}
```

## Testing

### Manual Testing Checklist

**Tree Management:**
- [ ] Create new tree with custom name
- [ ] Switch between trees in dropdown
- [ ] Verify menu count displays correctly
- [ ] Delete tree (backend feature, not yet in UI)

**Menu Operations:**
- [ ] Add root menu item to tree
- [ ] Add child menu item (click + button)
- [ ] Edit menu name
- [ ] Delete menu item with confirmation
- [ ] Verify cascade delete removes children

**Navigation:**
- [ ] Click nodes to expand/collapse
- [ ] Use keyboard navigation (↑↓←→)
- [ ] Verify breadcrumb updates
- [ ] Check parent name (not ID) displays

**Responsive:**
- [ ] Test on mobile (≤640px)
- [ ] Test on tablet (641-1024px)
- [ ] Test on desktop (≥1024px)
- [ ] Verify touch targets on mobile

**Edge Cases:**
- [ ] No trees available
- [ ] Empty tree (no menus)
- [ ] Deep nesting (10+ levels)
- [ ] Long menu names (ellipsis)
- [ ] Network errors

### Quick Test

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend-menu-management
npm run dev

# Browser
# 1. Open http://localhost:3001/menus
# 2. Select tree from dropdown
# 3. Click node to expand
# 4. Click + to add child
# 5. Edit name and save
# 6. Delete item
```

## Future Enhancements

- [ ] Drag & drop for reordering menus
- [ ] Search/filter within tree
- [ ] Bulk operations (multi-select delete)
- [ ] Undo/redo functionality
- [ ] Export/import tree structure (JSON)
- [ ] Menu duplication/cloning
- [ ] Tree duplication
- [ ] Move menu items between trees
- [ ] Advanced sorting (alphabetical, manual)
- [ ] Menu icons/images support
- [ ] URL/route association
- [ ] Role-based permissions
- [ ] Audit log (who changed what)

## Performance Optimization

**Current Optimizations:**
- Redux memoized selectors
- Component-level useCallback for handlers
- Tree flattening for virtualization-ready structure
- Controlled expand/collapse state
- Lazy loading for large trees (future)

**Recommendations:**
- For 1000+ nodes: Implement virtual scrolling (react-window)
- For slow networks: Add optimistic updates
- For real-time: Consider WebSocket updates

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

ISC

## Author

Frontend Menu Management Team

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review backend API documentation
3. Check Redux DevTools for state issues
4. Open issue on GitHub (if available)
# frontend-menu-management
