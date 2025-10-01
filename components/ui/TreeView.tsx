'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';

export interface TreeNode {
  id: string | number;
  name: string;
  depth: number;
  parentId: string | number | null;
  children?: TreeNode[];
  uuid?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TreeViewProps {
  data: TreeNode[];
  selectedId: string | number | null;
  onSelect: (node: TreeNode) => void;
  onToggleExpand?: (nodeId: string | number) => void;
  onAddChild?: (parentNode: TreeNode) => void;
  expandedIds?: Set<string | number>;
  onExpandedChange?: (expandedIds: Set<string | number>) => void;
}

export function TreeView({
  data,
  selectedId,
  onSelect,
  onToggleExpand,
  onAddChild,
  expandedIds: controlledExpandedIds,
  onExpandedChange,
}: TreeViewProps) {
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string | number>>(new Set());
  const [focusedId, setFocusedId] = useState<string | number | null>(null);

  const expandedIds = controlledExpandedIds || internalExpandedIds;
  const setExpandedIds = onExpandedChange || setInternalExpandedIds;

  const toggleExpand = useCallback(
    (nodeId: string | number) => {
      const newExpanded = new Set(expandedIds);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      setExpandedIds(newExpanded);
    },
    [expandedIds, setExpandedIds]
  );

  const expandAll = useCallback(() => {
    const allIds = new Set<string | number>();
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id);
        if (node.children) {
          collectIds(node.children);
        }
      });
    };
    collectIds(data);
    setExpandedIds(allIds);
  }, [data, setExpandedIds]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, [setExpandedIds]);

  // Expose methods via ref if needed
  useEffect(() => {
    (window as any).__treeViewExpandAll = expandAll;
    (window as any).__treeViewCollapseAll = collapseAll;
  }, [expandAll, collapseAll]);

  const flattenNodes = (nodes: TreeNode[], level = 0): Array<TreeNode & { level: number }> => {
    const result: Array<TreeNode & { level: number }> = [];
    nodes.forEach((node) => {
      result.push({ ...node, level });
      if (node.children && expandedIds.has(node.id)) {
        result.push(...flattenNodes(node.children, level + 1));
      }
    });
    return result;
  };

  const flatNodes = flattenNodes(data);

  const handleKeyDown = (e: React.KeyboardEvent, node: TreeNode) => {
    const currentIndex = flatNodes.findIndex((n) => n.id === node.id);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < flatNodes.length - 1) {
          const nextNode = flatNodes[currentIndex + 1];
          setFocusedId(nextNode.id);
          onSelect(nextNode);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          const prevNode = flatNodes[currentIndex - 1];
          setFocusedId(prevNode.id);
          onSelect(prevNode);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (node.children && node.children.length > 0) {
          if (!expandedIds.has(node.id)) {
            if (onToggleExpand) {
              onToggleExpand(node.id as number);
            } else {
              toggleExpand(node.id);
            }
          } else if (node.children.length > 0) {
            const firstChild = node.children[0];
            setFocusedId(firstChild.id);
            onSelect(firstChild);
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (expandedIds.has(node.id) && node.children && node.children.length > 0) {
          if (onToggleExpand) {
            onToggleExpand(node.id as number);
          } else {
            toggleExpand(node.id);
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(node);
        break;
    }
  };

  return (
    <div className="relative">
      {flatNodes.map((node) => {
        const isSelected = node.id === selectedId;
        const isExpanded = expandedIds.has(node.id);
        const hasChildren = node.children && node.children.length > 0;
        const isFocused = node.id === focusedId;

        return (
          <div
            key={node.id}
            className={`relative group flex items-center py-2 sm:py-1.5 px-2 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] sm:min-h-0 ${
              isSelected ? 'bg-blue-50' : ''
            }`}
            style={{ paddingLeft: `${node.level * 16 + 8}px` }}
            onClick={() => {
              // Click on node: select AND toggle if has children
              onSelect(node);
              if (hasChildren && onToggleExpand) {
                onToggleExpand(node.id as number);
              } else if (hasChildren) {
                toggleExpand(node.id);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, node)}
            tabIndex={0}
            role="treeitem"
            aria-selected={isSelected}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-level={node.level + 1}
            title={node.name}
          >
            {/* Indent guides - simplified on mobile */}
            {node.level > 0 && (
              <div className="absolute left-0 top-0 bottom-0 hidden sm:flex">
                {Array.from({ length: node.level }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 border-l border-gray-200"
                    style={{ marginLeft: `${i * 16}px` }}
                  />
                ))}
              </div>
            )}

            {/* Expand/Collapse caret - visual indicator only, click handled by parent */}
            <div
              className="flex-shrink-0 w-6 h-6 sm:w-4 sm:h-4 flex items-center justify-center mr-2 sm:mr-1 touch-manipulation"
              aria-hidden="true"
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown size={20} className="text-gray-600 sm:w-4 sm:h-4" />
                ) : (
                  <ChevronRight size={20} className="text-gray-600 sm:w-4 sm:h-4" />
                )
              ) : (
                <span className="w-6 sm:w-4" />
              )}
            </div>

            {/* Node name - ellipsis for long text */}
            <span
              className={`flex-1 text-sm truncate ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}
            >
              {node.name}
            </span>

            {/* Add child button - show on selected node, positioned to the right */}
            {onAddChild && isSelected && (
              <button
                className="flex-shrink-0 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-green-100 hover:bg-green-200 active:bg-green-300 flex items-center justify-center transition-colors touch-manipulation shadow-sm ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(node);
                }}
                aria-label={`Add child to ${node.name}`}
              >
                <Plus size={18} className="text-green-600 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        );
      })}

      {flatNodes.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-500">
          No menu items
        </div>
      )}
    </div>
  );
}
