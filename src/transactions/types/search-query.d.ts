export type SearchQuery = {
  q?: string
  c?: string
  y?: number
  m?: number
  min?: number
  max?: number
  limit?: number
  offset?: number
  sort?: 'ASC' | 'DESC'
}
