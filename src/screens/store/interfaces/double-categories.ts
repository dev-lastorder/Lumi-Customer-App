// src/interfaces/index.ts

export interface ICategory {
  id: string;
  name: string;
}

export interface ISubCategory {
  id: string;
  name: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string; // Product now MUST belong to a category
  subCategoryId?: string; // Product MAY belong to a sub-category
  isPopular?: boolean;
}

// NEW: Single Backend Response Interface
export interface IBackendResponse {
  categories: ICategory[];
  subCategories: ISubCategory[];
  products: IProduct[];
}

export interface GetRestaurantCategoriesAndSubCategoriesWithItemsPayload {
  getRestaurantCategoriesAndSubCategoriesWithItems: {
    data: {
      categories: { id: string; title: string }[];
      subCategories: { id: string; title: string }[];
      products: {
        id: string;
        image: string;
        price: number;
        title: string;
        categoryId: string;
        subCategoryId: string;
        description: string;
        currency: string;
        isActive: boolean;
        isOutOfStock: boolean;
      }[];
    };
  };
}
