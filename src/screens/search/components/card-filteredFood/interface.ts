import { Product } from '@/utils/interfaces/product-detail';
import { Dispatch, SetStateAction } from 'react';

export interface IProps {
  foodsData: Product[];
  saveSearch: () => void;
  setSeeAllFoods: Dispatch<SetStateAction<boolean>>;
  seeAllFoods: boolean;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
}
