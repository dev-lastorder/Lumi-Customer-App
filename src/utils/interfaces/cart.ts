// src/interfaces/cart.ts

import { Product } from "./product-detail";

// A unique identifier for a specific combination of product, variation, and selected addons
// e.g., "productId_variationId_addon1Id_addon2Id" (addons sorted for consistency)
export type CartItemUniqueId = string;

export interface CartItem {
  product : Product
  uniqueId: CartItemUniqueId; // e.g., "prod1_varA_addonX_addonY" - serves as the key in the items record
  productId: string;
  variationId: string;
  selectedAddonIds: string[]; // Sorted array of selected addon IDs for consistency

  // Display information (denormalized for easy rendering)
  productTitle: string; // Title from the base product
  variationTitle: string; // Title from the selected variation
  imageUrl: string; // Image from the base product
  currency: string;

  // Pricing information for one unit of this specific configuration
  basePrice: number; // Price of the selected variation *without* addons
  addonPrices: { id: string; title: string; price: number }[]; // Details of selected addons (for display/recalculation)
  unitPrice: number; // Total price for one unit of this specific configuration (variation + sum of selected addons)

  quantity: number; // Quantity of this specific unique combination
}
