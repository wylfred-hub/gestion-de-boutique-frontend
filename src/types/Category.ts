export type Category = {
  id: string
  name: string

  // Back-end renvoie organization_id, on le map sur organizationId
  organizationId?: string

  createdAt?: string
  updatedAt?: string
}

