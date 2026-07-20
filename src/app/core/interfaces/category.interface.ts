export interface CategoryPayload {
  name: string;
  parentId: string | null;
}

export interface CategoryUpdatePayload extends CategoryPayload {
  categoryId: string;
}
