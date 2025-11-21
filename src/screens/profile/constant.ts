import { RestaurantStoreCardProps } from '@/types';

export const profileRoutes = [
  {
    screenHeader: '',
    routes: [
      {
        icon: 'people',
        iconType: 'Ionicons',
        title: 'Order history',
        route: 'order-history',
        isLast:false
      },
      {
        icon: 'box-open',
        iconType: 'FontAwesome5',
        title: 'Gift cards and credits',
        route: 'gift-card-and-credits',
        isLast:false
      },
      {
        icon: 'help-with-circle',
        iconType: 'Entypo',
        title: 'Buy gift card',
        route: 'buy-gift-card',
        isLast:true
      },
    ],
  },
  {
    screenHeader: 'Quick Links',
    routes: [
      {
        icon: 'people',
        iconType: 'Ionicons',
        title: 'Customer Support',
        route: 'tickets',
        isLast:false
      },
      {
        icon: 'box-open',
        iconType: 'FontAwesome5',
        title: 'Order History',
        route: 'order-history',
        isLast:false
      },
      {
        icon: 'help-with-circle',
        iconType: 'Entypo',
        title: 'Help',
        route: 'help',
        isLast:true
      },
    ],
  },
  {
    screenHeader: 'Settings',
    routes: [
      {
        icon: 'person',
        iconType: 'Ionicons',
        title: 'Account',
        route: 'account',
        isLast:false
      },
      {
        icon: 'box-open',
        iconType: 'FontAwesome5',
        title: 'My Addresses',
        route: 'my-addresses',
        isLast:false
      },
      {
        icon: 'box-open',
        iconType: 'FontAwesome5',
        title: 'Coupons',
        route: 'coupons',
      },
    ],
  },
];

export const demoFavRestaurants: RestaurantStoreCardProps[] = [
  {
    images: ['https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg'],
    name: 'Pizza Bakers',
    subTitle: 'The most cheez loaded pizza ever!',
    deliveryTime: 30,
    minimumOrder: 12,
    rating: 4.5,
    status: 'Open',
    totalOrders: 323,
  },
  {
    images: ['https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    name: 'Pizza Bakers',
    subTitle: 'The most cheez loaded pizza ever!',
    deliveryTime: 10,
    minimumOrder: 12,
    rating: 5,
    status: 'Closed',
    totalOrders: 120,
  },
];
