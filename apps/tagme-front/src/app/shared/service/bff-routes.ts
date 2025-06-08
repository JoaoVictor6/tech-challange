const BASE_URL = 'http://localhost:3000' as const;
type Id = string & {};

export const BFF_ROUTES = {
  findAllItems: `${BASE_URL}/items` as const,
  findItemById: (id: Id) => `${BASE_URL}/items/${id}` as const,
  createItem: `${BASE_URL}/items` as const,
  updateItem: (id: Id) => `${BASE_URL}/items/${id}` as const,
  deleteItem: (id: Id) => `${BASE_URL}/items/${id}` as const,
} as const;
