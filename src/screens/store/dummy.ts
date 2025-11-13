export interface ProductSection {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  quantityInCart: number;
  currency: string;
  description: string; // Make sure this field exists
}
