'use client';

import React, { useEffect, useState } from 'react';
import { Menu, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectNode,
  toggleExpand,
  expandAll,
  collapseAll,
  selectMenuNodes,
  selectSelectedNodeId,
  selectExpandedNodeIds,
  selectSelectedTreeId,
  selectAvailableTrees,
  selectEditingNode,
  selectIsDirty,
  selectLoading,
  selectError,
  selectBreadcrumb,
  selectIsAddingChild,
  updateEditingNode,
  setTreeId,
  fetchMenuTree,
  fetchAllTrees,
  createTree,
  updateMenu,
  createMenu,
  deleteMenu,
  clearError,
  startAddingChild,
  startAddingRoot,
  cancelAddingChild,
} from '@/lib/redux/features/menuSlice';
import { TreeView, TreeNode } from '@/components/ui/TreeView';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Loading, LoadingOverlay } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/Modal';

export default function MenusPage() {
  const dispatch = useAppDispatch();
  const menuNodes = useAppSelector(selectMenuNodes);
  const selectedNodeId = useAppSelector(selectSelectedNodeId);
  const expandedNodeIds = useAppSelector(selectExpandedNodeIds);
  const selectedTreeId = useAppSelector(selectSelectedTreeId);
  const availableTrees = useAppSelector(selectAvailableTrees);
  const editingNode = useAppSelector(selectEditingNode);
  const isDirty = useAppSelector(selectIsDirty);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const breadcrumb = useAppSelector(selectBreadcrumb);
  const isAddingChild = useAppSelector(selectIsAddingChild);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateTreeDialogOpen, setIsCreateTreeDialogOpen] = useState(false);
  const [newTreeName, setNewTreeName] = useState('');

  // Fetch available trees on mount
  useEffect(() => {
    dispatch(fetchAllTrees());
  }, [dispatch]);

  // Fetch menu data when treeId changes
  useEffect(() => {
    if (selectedTreeId) {
      dispatch(fetchMenuTree(selectedTreeId));
    }
  }, [dispatch, selectedTreeId]);

  const handleExpandAll = () => {
    dispatch(expandAll());
  };

  const handleCollapseAll = () => {
    dispatch(collapseAll());
  };

  const handleSelect = (node: TreeNode) => {
    dispatch(selectNode(node.id as number));
  };

  const handleToggleExpand = (nodeId: string | number) => {
    dispatch(toggleExpand(nodeId as number));
  };

  const handleNameChange = (value: string) => {
    dispatch(updateEditingNode({ name: value }));
  };

  const handleSave = async () => {
    if (!editingNode || editingNode.name.trim() === '') return;

    if (isAddingChild) {
      // Create new menu item (child or root)
      await dispatch(
        createMenu({
          name: editingNode.name,
          treeId: selectedTreeId || undefined,
          depth: editingNode.depth,
          parentId: editingNode.parentId, // null for root items
        })
      );
      dispatch(fetchMenuTree(selectedTreeId));
    } else if (selectedNodeId) {
      // Update existing menu item
      await dispatch(
        updateMenu({
          id: selectedNodeId,
          data: {
            name: editingNode.name,
          },
        })
      );
      dispatch(fetchMenuTree(selectedTreeId));
    }
  };

  const handleAddChild = (parentNode: TreeNode) => {
    // Add child to clicked node (next depth level)
    dispatch(startAddingChild(parentNode.id as number));
  };

  const handleCreateTree = () => {
    setIsCreateTreeDialogOpen(true);
  };

  const handleConfirmCreateTree = async () => {
    if (newTreeName.trim()) {
      await dispatch(createTree({ treeName: newTreeName }));
      setIsCreateTreeDialogOpen(false);
      setNewTreeName('');
      // Fetch the menu tree for the newly created tree
      dispatch(fetchAllTrees());
    }
  };

  const handleCancelCreateTree = () => {
    setIsCreateTreeDialogOpen(false);
    setNewTreeName('');
  };

  const handleAddRoot = () => {
    // Add root item (depth 0, no parent)
    dispatch(startAddingRoot());
  };

  const handleCancelAdd = () => {
    dispatch(cancelAddingChild());
  };

  const handleDelete = async () => {
    if (selectedNodeId) {
      await dispatch(deleteMenu(selectedNodeId));
      setIsDeleteDialogOpen(false);
      dispatch(fetchMenuTree(selectedTreeId));
    }
  };

  const handleTreeIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTreeId(e.target.value));
  };

  const treeOptions = availableTrees.map((tree) => ({
    value: tree.treeId,
    label: `${tree.treeName} (${tree._count?.menus || 0} items)`,
  }));

  // Show initial loading
  if (loading && menuNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" text="Loading menus..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Error Alert */}
      {error && (
        <div className="p-4 sm:p-6">
          <Alert
            variant="error"
            title="Error"
            message={error}
            onClose={() => dispatch(clearError())}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 safe-area-inset">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <span>/</span>
            <ChevronRight size={12} />
            <span>Menus</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Menu className="text-green-600" size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Menus</h1>
          </div>

          {/* Toolbar - responsive wrap */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 flex-shrink-0">Tree</span>
              <Select
                options={treeOptions}
                value={selectedTreeId || ''}
                onChange={handleTreeIdChange}
                className="flex-1 sm:w-60"
                aria-label="Select menu tree"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateTree}
                className="flex items-center gap-2 min-h-[44px] sm:min-h-0"
              >
                <Plus size={16} />
                <span>New Tree</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExpandAll}
                className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
              >
                Expand All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCollapseAll}
                className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
              >
                Collapse All
              </Button>
            </div>
          </div>
        </header>

        {/* Content Grid - responsive */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6">
          <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
            {/* Tree View Panel - adaptive height */}
            <LoadingOverlay isLoading={loading}>
              <Card className="overflow-hidden flex flex-col max-h-[60vh] lg:max-h-[70vh]">
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                  {menuNodes.length > 0 ? (
                    <TreeView
                      data={menuNodes}
                      selectedId={selectedNodeId}
                      onSelect={handleSelect}
                      onToggleExpand={handleToggleExpand}
                      onAddChild={handleAddChild}
                      expandedIds={new Set(expandedNodeIds)}
                      onExpandedChange={(ids) => {
                        // Handle expanded change if needed
                      }}
                    />
                  ) : (
                    <div className="py-12 text-center">
                      <Menu className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-sm text-gray-500 mb-4">
                        {selectedTreeId ? 'No menu items in this tree' : 'No trees available'}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={selectedTreeId ? handleAddRoot : handleCreateTree}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Plus size={16} />
                        <span>{selectedTreeId ? 'Add Root Menu' : 'Create First Tree'}</span>
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </LoadingOverlay>

            {/* Detail Form Panel - responsive */}
            <Card className="overflow-hidden flex flex-col p-4 sm:p-6">
              {editingNode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      {isAddingChild ? 'Add New Menu Item' : 'Menu Details'}
                    </h2>
                    {!isAddingChild && selectedNodeId && (
                      <button
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete menu"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Info message for adding */}
                  {isAddingChild && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-blue-800">
                        {editingNode?.parentId ? (
                          <>
                            <strong>Adding child item</strong> - This will create a new menu item <strong>under</strong> the selected parent at depth level <strong>{editingNode.depth}</strong>.
                          </>
                        ) : (
                          <>
                            <strong>Adding root item</strong> - This will create a new top-level menu item at depth <strong>0</strong>.
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Breadcrumb */}
                  {breadcrumb.length > 0 && !isAddingChild && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 flex-wrap">
                      {breadcrumb.map((crumb, index) => (
                        <React.Fragment key={index}>
                          <span>{crumb}</span>
                          {index < breadcrumb.length - 1 && <ChevronRight size={12} />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Read-only fields with horizontal scroll */}
                  {!isAddingChild && (
                    <div className="space-y-3">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UUID
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 overflow-x-auto">
                          <span className="whitespace-nowrap font-mono text-xs">
                            {editingNode.uuid || 'N/A'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Unique identifier</p>
                      </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Depth
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                        {editingNode.depth}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Level in the menu hierarchy</p>
                    </div>

                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Parent
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                          {editingNode.parentId ? (
                            (() => {
                              const findParent = (nodes: typeof menuNodes, parentId: number): string | null => {
                                for (const node of nodes) {
                                  if (node.id === parentId) return node.name;
                                  if (node.children) {
                                    const found = findParent(node.children, parentId);
                                    if (found) return found;
                                  }
                                }
                                return null;
                              };
                              return findParent(menuNodes, editingNode.parentId) || 'Unknown';
                            })()
                          ) : (
                            'None (Root)'
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Parent menu item</p>
                      </div>
                    </div>
                  )}

                  {/* Editable field */}
                  <Input
                    label="Name"
                    value={editingNode.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter menu name"
                    error={
                      editingNode.name.trim() === '' ? 'Name is required' : undefined
                    }
                  />

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {isAddingChild && (
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={handleCancelAdd}
                        className="min-h-[44px]"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      fullWidth
                      disabled={!isDirty || editingNode.name.trim() === ''}
                      onClick={handleSave}
                      className="min-h-[44px]"
                    >
                      {isAddingChild ? 'Create' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-12">
                  <div className="text-center text-gray-500">
                    <Menu className="mx-auto mb-2 text-gray-400" size={40} />
                    <p className="text-sm">Select a menu item to view details</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${editingNode?.name}"? This action will also delete all child items and cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
      />

      {/* Create Tree Dialog */}
      <ConfirmDialog
        isOpen={isCreateTreeDialogOpen}
        onClose={handleCancelCreateTree}
        onConfirm={handleConfirmCreateTree}
        title="Create New Tree"
        message={
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Enter a name for the new menu tree:</p>
            <Input
              value={newTreeName}
              onChange={(e) => setNewTreeName(e.target.value)}
              placeholder="e.g., Main Navigation, Footer Menu"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTreeName.trim()) {
                  handleConfirmCreateTree();
                }
              }}
            />
          </div>
        }
        confirmText="Create"
        cancelText="Cancel"
        variant="info"
        isLoading={loading}
      />
    </div>
  );
}
