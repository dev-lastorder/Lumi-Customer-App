import { Product } from '@/utils/interfaces/product-detail';
  

// Define a simple interface for SubCategory for clarity
export interface ISubCategory {
  title: string | null; // title can be null
  foods: Product[];
}

// Define a simple interface for ParentCategory for clarity
export interface IParentCategory {
  __typename: string;
  parentCategory: string;
  subCategories: ISubCategory[];
  foods: Product[] | null; // Though it's null in your example
}
