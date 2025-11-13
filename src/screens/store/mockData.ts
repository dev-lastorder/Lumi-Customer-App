import { IBackendResponse } from './interfaces/double-categories';

export const mockApiResponse: IBackendResponse = {
  categories: [
    { id: 'cat-1', name: 'BUQETA' },
    { id: 'cat-2', name: 'CANTA ME LULE' },
    { id: 'cat-3', name: 'KOMPOZIME M' },
    { id: 'cat-4', name: 'VAZO ME LULE' },
    { id: 'cat-5', name: 'LULE NË KUTI' }, // Added for more scrolling demo
    { id: 'cat-6', name: 'ARSHTIME' }, // Added for more scrolling demo
  ],
  subCategories: [
    { id: 'sub-1', name: 'All items' }, // Important: 'sub-1' signifies "no specific sub-category filter"
    { id: 'sub-2', name: 'BUQETA ME LULE TË NDRYSHME' },
    { id: 'sub-3', name: 'BUQETA PËR DHURATË' },
    { id: 'sub-4', name: 'BUQETA ME ZAMBAK' },
    { id: 'sub-5', name: 'BUQETA TË VEÇANTA' }, // Added for more scrolling demo
  ],
  products: [
    // Products for 'BUQETA' (cat-1)
    {
      id: 'prod-1',
      name: 'Sweet Bouquet',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
      subCategoryId: 'sub-2',
    },
    {
      id: 'prod-2',
      name: 'Red Roses Bouquet',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
      subCategoryId: 'sub-2',
    },
    {
      id: 'prod-3',
      name: 'Classic Roses',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
      subCategoryId: 'sub-3',
    },
    {
      id: 'prod-4',
      name: 'Popular Mixed',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
      subCategoryId: 'sub-2',
      isPopular: true,
    },
    {
      id: 'prod-5',
      name: 'Large Red Roses',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
    }, // No specific sub-category
    {
      id: 'prod-6',
      name: 'Wedding Bouquet',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
      subCategoryId: 'sub-3',
    },
    {
      id: 'prod-7',
      name: 'Spring Delight',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
      subCategoryId: 'sub-4',
    },
    {
      id: 'prod-8',
      name: 'Elegant Orchids',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-1',
    }, // No specific sub-category

    // Products for 'CANTA ME LULE' (cat-2)
    {
      id: 'prod-9',
      name: 'Flower Bag Red',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-2',
    },
    {
      id: 'prod-10',
      name: 'Flower Bag Blue',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-2',
    },

    // Products for 'KOMPOZIME M' (cat-3)
    {
      id: 'prod-11',
      name: 'Modern Arrangement',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-3',
    },
    {
      id: 'prod-12',
      name: 'Table Centerpiece',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-3',
    },

    // Products for 'VAZO ME LULE' (cat-4)
    {
      id: 'prod-13',
      name: 'Classic Vase',
      price: 5000,
      imageUrl: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
      categoryId: 'cat-4',
    },
  ],
};
