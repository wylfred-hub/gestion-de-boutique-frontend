import { Product } from './Product';
import { Client } from './Client'; // Assurez-vous que le chemin est correct
import { User } from './User';     // Assurez-vous que le chemin est correct

export type SaleStatus = 'encours' | 'confirmee' | 'annulee';

export type SaleItem = {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discountType: 'fixe' | 'pourcentage' | null;
  discountValue: number;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
  product?: Product; // Détails du produit si eager loaded
};

export type Sale = {
  id: string;
  organizationId: string;
  clientId: string | null;
  userId: string;
  saleNumber: string;
  status: SaleStatus; // Nouveau type de statut
  discountType: 'fixe' | 'pourcentage' | null;
  discountValue: number;
  subtotal: number;
  totalAmount: number;
  notes: string | null;
  deliveredAt: string | null; // Date de livraison si 'confirmee'
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  client?: Client;
  user?: User;
  items?: SaleItem[];
};