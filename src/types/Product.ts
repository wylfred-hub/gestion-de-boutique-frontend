import { Category } from './Category'; // Assurez-vous que le chemin est correct

export type Product = {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  reference: string | null;
  description: string | null;
  purchasePrice: number;
  sellingPrice: number;
  unit: string;
  barcode: string | null;
  image: string | null;
  stockQuantity: number; // Désormais calculé dynamiquement par le backend (via accesseur)
  stockAlert: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  category?: Category; // Relation possible si eager loaded
};