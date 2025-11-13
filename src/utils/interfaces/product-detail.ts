export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  isActive: boolean;
  isOutOfStock: boolean;
  restaurantId: string;
  restaurantName: string;
  variations?: ProductVariation[];
}
export interface ProductVariation {
  id: string;
  title: string;
  price: number;
  addons: ProductAddon[];
}

export interface ProductAddon {
  id: string;
  title: string;
  price: number;
}
export interface Category {
  id: string;
  name: string;
  imageUri: string;
}
