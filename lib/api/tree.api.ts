import { apiClient } from './client';
import type { ApiError } from './client';

// Tree API types
export interface TreeDto {
  id: number;
  treeId: string;
  treeName: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    menus: number;
  };
  menus?: any[];
}

export interface CreateTreeDto {
  treeId?: string;
  treeName: string;
}

export interface UpdateTreeDto {
  treeName?: string;
}

export class TreeApi {
  /**
   * Create a new tree
   */
  static async create(data: CreateTreeDto): Promise<TreeDto> {
    return apiClient.post<TreeDto>('/trees', data);
  }

  /**
   * Get all trees with menu count
   */
  static async getAll(): Promise<TreeDto[]> {
    return apiClient.get<TreeDto[]>('/trees');
  }

  /**
   * Get tree by ID with all menus
   */
  static async getById(id: number): Promise<TreeDto> {
    return apiClient.get<TreeDto>(`/trees/${id}`);
  }

  /**
   * Get tree by treeId with all menus
   */
  static async getByTreeId(treeId: string): Promise<TreeDto> {
    return apiClient.get<TreeDto>(`/trees/treeId/${treeId}`);
  }

  /**
   * Update tree name
   */
  static async update(id: number, data: UpdateTreeDto): Promise<TreeDto> {
    return apiClient.patch<TreeDto>(`/trees/${id}`, data);
  }

  /**
   * Delete tree and all its menus (cascade)
   */
  static async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/trees/${id}`);
  }
}

export { ApiError };
