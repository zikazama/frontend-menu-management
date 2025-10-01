import { apiClient } from './client';
import type { ApiError } from './client';

// Backend API types
export interface MenuDto {
  id: number;
  uuid: string;
  name: string;
  treeId?: string;
  depth: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  parent?: MenuDto | null;
  children?: MenuDto[];
}

export interface CreateMenuDto {
  name: string;
  treeId?: string;
  depth?: number;
  parentId?: number | null;
}

export interface CreateTreeMenuDto {
  treeId?: string;
  name: string;
  children?: CreateTreeMenuDto[];
}

export interface UpdateMenuDto {
  name?: string;
  depth?: number;
  parentId?: number | null;
}

export interface TreeGroup {
  treeId: string;
  menus: MenuDto[];
}

export class MenuApi {
  /**
   * Create single menu item
   */
  static async create(data: CreateMenuDto): Promise<MenuDto> {
    return apiClient.post<MenuDto>('/menus', data);
  }

  /**
   * Create tree menu (bulk create with children)
   */
  static async createTree(data: CreateTreeMenuDto): Promise<MenuDto> {
    return apiClient.post<MenuDto>('/menus/tree', data);
  }

  /**
   * Get all menus (flat list)
   */
  static async getAll(): Promise<MenuDto[]> {
    return apiClient.get<MenuDto[]>('/menus');
  }

  /**
   * Get all trees (grouped by treeId)
   */
  static async getAllTrees(): Promise<TreeGroup[]> {
    return apiClient.get<TreeGroup[]>('/menus/trees');
  }

  /**
   * Get menu tree by treeId (hierarchical structure)
   */
  static async getTreeById(treeId: string): Promise<MenuDto[]> {
    return apiClient.get<MenuDto[]>(`/menus/tree/${treeId}`);
  }

  /**
   * Get all menu tree (hierarchical structure)
   */
  static async getTree(): Promise<MenuDto[]> {
    return apiClient.get<MenuDto[]>('/menus/tree');
  }

  /**
   * Get menu by ID
   */
  static async getById(id: number): Promise<MenuDto> {
    return apiClient.get<MenuDto>(`/menus/${id}`);
  }

  /**
   * Get menu by UUID
   */
  static async getByUuid(uuid: string): Promise<MenuDto> {
    return apiClient.get<MenuDto>(`/menus/uuid/${uuid}`);
  }

  /**
   * Update existing menu
   */
  static async update(id: number, data: UpdateMenuDto): Promise<MenuDto> {
    return apiClient.patch<MenuDto>(`/menus/${id}`, data);
  }

  /**
   * Delete menu (cascades to children)
   */
  static async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/menus/${id}`);
  }
}

export { ApiError };
