import { Product } from "@/utils/interfaces/product-detail";
import { Dispatch, SetStateAction } from "react";

export interface IdataResponce {
  getFilteredRestaurants: {
    __typename: any;
    restaurants: IRestaurant[];
    foods: Product[];
    currentPage: number;
    docsCount: number;
    totalPages: number;
  }
}
export interface Idata {
  restaurants: IRestaurant[];
  foods: Product[];
  currentPage: number;
  docsCount: number;
  totalPages: number;
}
export interface IRestaurant {
  _id: string;
  name: string;
  image: string;
  address: string;
  deliveryTime: string;
  reviewCount: number;
  reviewAverage: number;
  shopType: string;
  isAvailable: boolean;
}

export interface IFoods {
  __typename: 'Food';
  restaurantId: string;
  restaurantName: string;
  food: Product;
}



export interface IQueryProps {
  keyword: string;
  page: number,
  latitude: string | null;
  longitude: string | null;
  shopType : string | null;
  sortBy : string;
  status : string | null;
}

export interface IProps {
  data: IRestaurant[];
  saveSearch: () => void;
  loading?: boolean;
  canLoadMore?: boolean;
  onLoadMore?: () => void;
  isInitialLoading?: boolean;
  foods: Product[];
  setSeeAllFoods: Dispatch<SetStateAction<boolean>>;
  seeAllFoods: boolean;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  onRestaurantPress: (id: string) => void;
}

export interface IPropsSearchResults {
  keyword: string;
  saveSearch: () => void;
  locationPicker: any;
  setSeeAllFoods: Dispatch<SetStateAction<boolean>>;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  seeAllFoods: boolean;
}
