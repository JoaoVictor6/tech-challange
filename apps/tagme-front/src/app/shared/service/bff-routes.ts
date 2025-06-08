const BASE_URL = 'http://localhost:3000' as const
type Id = string & {}
export const BFF_ROUTES = {
  findAllItems: `${BASE_URL}/items`,
  deleteItem: (id: Id) => `${BASE_URL}/items/${id}` as const,
  editItem: (id: Id) => `${BASE_URL}/items/${id}` as const
} as const
