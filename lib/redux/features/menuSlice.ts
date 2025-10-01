import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { MenuApi, MenuDto, CreateMenuDto, UpdateMenuDto } from '@/lib/api/menu.api';
import { TreeApi, TreeDto } from '@/lib/api/tree.api';

export interface MenuNode {
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

interface MenuState {
  nodes: MenuNode[];
  selectedNodeId: number | null;
  expandedNodeIds: number[];
  selectedTreeId: string | null;
  availableTrees: TreeDto[];
  isDirty: boolean;
  editingNode: MenuNode | null;
  breadcrumb: string[];
  loading: boolean;
  error: string | null;
  isAddingChild: boolean;
  parentForNewChild: number | null;
}

const initialState: MenuState = {
  nodes: [],
  selectedNodeId: null,
  expandedNodeIds: [],
  selectedTreeId: null,
  availableTrees: [],
  isDirty: false,
  editingNode: null,
  breadcrumb: [],
  loading: false,
  error: null,
  isAddingChild: false,
  parentForNewChild: null,
};

// Helper function to convert backend DTO to frontend MenuNode
function convertDtoToNode(dto: MenuDto): MenuNode {
  return {
    id: dto.id,
    uuid: dto.uuid,
    name: dto.name,
    treeId: dto.treeId,
    depth: dto.depth,
    parentId: dto.parentId,
    children: dto.children ? dto.children.map(convertDtoToNode) : undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

// Helper function to build parent path string
function buildParentPath(nodes: MenuNode[], nodeId: number): string {
  const path: string[] = [];
  let currentId: number | null = nodeId;

  const findNode = (nodes: MenuNode[], id: number): MenuNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  while (currentId !== null) {
    const node = findNode(nodes, currentId);
    if (!node) break;
    path.unshift(node.name);
    currentId = node.parentId;
  }

  return path.join(' / ');
}

// Async Thunks
export const fetchAllTrees = createAsyncThunk(
  'menu/fetchAllTrees',
  async (_, { rejectWithValue }) => {
    try {
      const trees = await TreeApi.getAll();
      return trees;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trees');
    }
  }
);

export const createTree = createAsyncThunk(
  'menu/createTree',
  async (treeData: { treeName: string; treeId?: string }, { rejectWithValue }) => {
    try {
      const tree = await TreeApi.create(treeData);
      return tree;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create tree');
    }
  }
);

export const fetchMenuTree = createAsyncThunk(
  'menu/fetchTree',
  async (treeId: string | null | undefined, { rejectWithValue }) => {
    try {
      let data: MenuDto[];

      if (treeId) {
        // Fetch specific tree by treeId
        data = await MenuApi.getTreeById(treeId);
      } else {
        // Fetch all trees
        data = await MenuApi.getTree();
      }

      return data.map(convertDtoToNode);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menu tree');
    }
  }
);

export const createMenu = createAsyncThunk(
  'menu/create',
  async (menuData: CreateMenuDto, { rejectWithValue }) => {
    try {
      const data = await MenuApi.create(menuData);
      return convertDtoToNode(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create menu');
    }
  }
);

export const updateMenu = createAsyncThunk(
  'menu/update',
  async ({ id, data }: { id: number; data: UpdateMenuDto }, { rejectWithValue }) => {
    try {
      const updated = await MenuApi.update(id, data);
      return convertDtoToNode(updated);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update menu');
    }
  }
);

export const deleteMenu = createAsyncThunk(
  'menu/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await MenuApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete menu');
    }
  }
);

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    selectNode: (state, action: PayloadAction<number>) => {
      state.selectedNodeId = action.payload;
      const findNode = (nodes: MenuNode[], id: number): MenuNode | null => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(state.nodes, action.payload);
      if (node) {
        state.editingNode = { ...node };
        // Build breadcrumb
        state.breadcrumb = buildParentPath(state.nodes, action.payload).split(' / ');
      }
      state.isDirty = false;
      state.isAddingChild = false;
    },
    toggleExpand: (state, action: PayloadAction<number>) => {
      const index = state.expandedNodeIds.indexOf(action.payload);
      if (index > -1) {
        state.expandedNodeIds.splice(index, 1);
      } else {
        state.expandedNodeIds.push(action.payload);
      }
    },
    expandAll: (state) => {
      const allIds: number[] = [];
      const collectIds = (nodes: MenuNode[]) => {
        nodes.forEach((node) => {
          allIds.push(node.id);
          if (node.children) {
            collectIds(node.children);
          }
        });
      };
      collectIds(state.nodes);
      state.expandedNodeIds = allIds;
    },
    collapseAll: (state) => {
      state.expandedNodeIds = [];
    },
    updateEditingNode: (state, action: PayloadAction<Partial<MenuNode>>) => {
      if (state.editingNode) {
        state.editingNode = { ...state.editingNode, ...action.payload };
        state.isDirty = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setTreeId: (state, action: PayloadAction<string | null>) => {
      state.selectedTreeId = action.payload;
    },
    startAddingChild: (state, action: PayloadAction<number>) => {
      state.isAddingChild = true;
      state.parentForNewChild = action.payload;
      state.isDirty = false;
      // Create empty editing node for new item AS CHILD (next depth level)
      const parentNode = (function findNode(nodes: MenuNode[], id: number): MenuNode | null {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
          }
        }
        return null;
      })(state.nodes, action.payload);

      state.editingNode = {
        id: 0, // Temporary ID
        uuid: '',
        name: '',
        depth: parentNode ? parentNode.depth + 1 : 0, // NEXT depth level (child of parent)
        parentId: action.payload,
        createdAt: '',
        updatedAt: '',
      };
    },
    startAddingRoot: (state) => {
      state.isAddingChild = true;
      state.parentForNewChild = null;
      state.isDirty = false;
      // Create empty editing node for ROOT item (depth 0, no parent)
      state.editingNode = {
        id: 0,
        uuid: '',
        name: '',
        depth: 0,
        parentId: null,
        createdAt: '',
        updatedAt: '',
      };
    },
    cancelAddingChild: (state) => {
      state.isAddingChild = false;
      state.parentForNewChild = null;
      state.editingNode = null;
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch all trees
    builder
      .addCase(fetchAllTrees.fulfilled, (state, action) => {
        state.availableTrees = action.payload;
        // Auto-select first tree if none selected
        if (!state.selectedTreeId && action.payload.length > 0) {
          state.selectedTreeId = action.payload[0].treeId;
        }
      });

    // Create tree
    builder
      .addCase(createTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTree.fulfilled, (state, action) => {
        state.loading = false;
        // Add new tree to available trees
        state.availableTrees.push(action.payload);
        // Auto-select the newly created tree
        state.selectedTreeId = action.payload.treeId;
      })
      .addCase(createTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch tree
    builder
      .addCase(fetchMenuTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuTree.fulfilled, (state, action) => {
        state.loading = false;
        state.nodes = action.payload;
        // Auto-expand first level
        if (action.payload.length > 0) {
          state.expandedNodeIds = action.payload.map((node) => node.id);
        }
      })
      .addCase(fetchMenuTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create menu
    builder
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.isAddingChild = false;
        state.parentForNewChild = null;
        state.editingNode = null;
        // Refresh needed - will be handled by refetch
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update menu
    builder
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.isDirty = false;
        // Update the node in state
        const updateNodeInTree = (nodes: MenuNode[], updated: MenuNode): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === updated.id) {
              nodes[i] = { ...nodes[i], ...updated };
              return true;
            }
            if (nodes[i].children) {
              if (updateNodeInTree(nodes[i].children!, updated)) {
                return true;
              }
            }
          }
          return false;
        };
        updateNodeInTree(state.nodes, action.payload);
        if (state.editingNode && state.editingNode.id === action.payload.id) {
          state.editingNode = action.payload;
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete menu
    builder
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh needed - will be handled by refetch
        if (state.selectedNodeId === action.payload) {
          state.selectedNodeId = null;
          state.editingNode = null;
        }
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectNode,
  toggleExpand,
  expandAll,
  collapseAll,
  updateEditingNode,
  clearError,
  setTreeId,
  startAddingChild,
  startAddingRoot,
  cancelAddingChild,
} = menuSlice.actions;

export const selectMenuNodes = (state: RootState) => state.menu.nodes;
export const selectSelectedNodeId = (state: RootState) => state.menu.selectedNodeId;
export const selectExpandedNodeIds = (state: RootState) => state.menu.expandedNodeIds;
export const selectSelectedTreeId = (state: RootState) => state.menu.selectedTreeId;
export const selectAvailableTrees = (state: RootState) => state.menu.availableTrees;
export const selectIsDirty = (state: RootState) => state.menu.isDirty;
export const selectEditingNode = (state: RootState) => state.menu.editingNode;
export const selectBreadcrumb = (state: RootState) => state.menu.breadcrumb;
export const selectLoading = (state: RootState) => state.menu.loading;
export const selectError = (state: RootState) => state.menu.error;
export const selectIsAddingChild = (state: RootState) => state.menu.isAddingChild;
export const selectParentForNewChild = (state: RootState) => state.menu.parentForNewChild;

export default menuSlice.reducer;
