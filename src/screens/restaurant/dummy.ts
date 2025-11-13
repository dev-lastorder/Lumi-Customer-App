// src/data/dummyRestaurantData.ts
import { ImageSourcePropType } from 'react-native';

// --- Image Placeholders ---
export const RESTAURANT_BANNER_IMAGE: string = `https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80`;
export const RESTAURANT_LOGO_IMAGE: string = `https://cdn-icons-png.flaticon.com/256/3448/3448609.png`;

export const PLACEHOLDER_SALAD_IMAGE: ImageSourcePropType = {
  uri: `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=60`,
};
export const PLACEHOLDER_PIZZA_IMAGE: ImageSourcePropType = {
  uri: `https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=60`,
};
export const PLACEHOLDER_DESSERT_IMAGE: ImageSourcePropType = {
  uri: `https://images.unsplash.com/photo-1551024506-0bccd828f307?auto=format&fit=crop&w=200&q=60`,
};
export const PLACEHOLDER_DRINK_IMAGE: ImageSourcePropType = {
  uri: `https://images.unsplash.com/photo-1575390140983-995ca5f77531?auto=format&fit=crop&w=200&q=60`,
};

// --- Menu Data Types ---
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: ImageSourcePropType;
}

export interface MenuCategory {
  id: string;
  data: MenuItem[];
  title: string;
}

// --- Menu Data ---
export const menuData: MenuCategory[] = [
  {
    id: 'dfsdfklsidiidfsdl89',
    title: 'SALADS',
    data: [
      { id: 1, name: 'Green Salad', description: 'Fresh greens with vinaigrette.', price: '400 ALL', image: PLACEHOLDER_SALAD_IMAGE },
      {
        id: 2,
        name: 'Village Salad',
        description: 'Tomatoes, cucumbers, olives, feta.',
        price: '500 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1505253716362-af78f58728fc?auto=format&fit=crop&w=200&q=60' },
      },
      {
        id: 3,
        name: 'Caesar Salad',
        description: 'Iceberg, chicken fillet, croutons.',
        price: '600 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1550304935-12a6393f3540?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfksdfslsidiidfsdl89',
    title: 'PIZZAS',
    data: [
      { id: 101, name: 'Margherita Pizza', description: 'Classic cheese and tomato.', price: '700 ALL', image: PLACEHOLDER_PIZZA_IMAGE },
      {
        id: 102,
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni and mozzarella.',
        price: '850 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfklsidiidfsdls785349893ehbdv89',
    title: 'DESSERTS',
    data: [
      { id: 201, name: 'Chocolate Lava Cake', description: 'Warm cake with gooey center.', price: '450 ALL', image: PLACEHOLDER_DESSERT_IMAGE },
      {
        id: 202,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee.',
        price: '500 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1586040140378-b5634cb4c8fc?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfkls3453idiidfsdl89',
    title: 'DRINKS',
    data: [
      { id: 301, name: 'Fresh Orange Juice', description: '100% freshly squeezed.', price: '250 ALL', image: PLACEHOLDER_DRINK_IMAGE },
      {
        id: 302,
        name: 'Coca-Cola',
        description: 'Classic Coca-Cola.',
        price: '150 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfkfdsfdwlsidiidfsdl89',

    title: 'BURGERS',
    data: [
      {
        id: 401,
        name: 'Beef Burger',
        description: 'Juicy beef patty with cheese.',
        price: '800 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60' },
      },
      {
        id: 402,
        name: 'Veggie Burger',
        description: 'Grilled veggie patty with sauce.',
        price: '700 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1601924582975-4aa2f3f80c5a?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdf3wrfdgrtgfklsidiidfsdl89',

    title: 'PASTAS',
    data: [
      {
        id: 501,
        name: 'Spaghetti Bolognese',
        description: 'Rich meat sauce and herbs.',
        price: '900 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1603133872878-684f208fb82b?auto=format&fit=crop&w=200&q=60' },
      },
      {
        id: 502,
        name: 'Penne Alfredo',
        description: 'Creamy white sauce pasta.',
        price: '850 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfk234rfddsadsafhghlsidiidfsdl89',

    title: 'SEAFOOD',
    data: [
      {
        id: 601,
        name: 'Grilled Salmon',
        description: 'Seasoned salmon filet.',
        price: '1200 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1581404917879-43c2f2f4e6f6?auto=format&fit=crop&w=200&q=60' },
      },
      {
        id: 602,
        name: 'Fried Calamari',
        description: 'Golden crispy squid rings.',
        price: '950 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1598515218355-43a548c4d3d3?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfklsilkjghgnfdsdiidfsdl89',

    title: 'SOUPS',
    data: [
      {
        id: 701,
        name: 'Tomato Soup',
        description: 'Creamy tomato with basil.',
        price: '400 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1605478571944-4ad753ce9c8f?auto=format&fit=crop&w=200&q=60' },
      },
      {
        id: 702,
        name: 'Chicken Soup',
        description: 'Hearty chicken broth.',
        price: '450 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1613145990967-c4c5b58b34a0?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfklsiddfsaj765rdfiidfsdl89',

    title: 'APPETIZERS',
    data: [
      {
        id: 801,
        name: 'Spring Rolls',
        description: 'Vegetable-filled rolls.',
        price: '300 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=200&q=60' },
      },
      {
        id: 802,
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter.',
        price: '250 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1610131591316-df99a68ed48c?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
  {
    id: 'dfsdfkdfsaefwderfrgflsidiidfsdl89',

    title: 'SANDWICHES',
    data: [
      {
        id: 901,
        name: 'Club Sandwich',
        description: 'Triple-layer with chicken & egg.',
        price: '600 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=200&q=60' },
      },
      {
        id: 902,
        name: 'Tuna Sandwich',
        description: 'Tuna salad on toasted bread.',
        price: '550 ALL',
        image: { uri: 'https://images.unsplash.com/photo-1579113800067-622c26eec9bb?auto=format&fit=crop&w=200&q=60' },
      },
    ],
  },
];
