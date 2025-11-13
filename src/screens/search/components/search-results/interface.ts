import { IRestaurant } from "@/api/hooks/interfaces/filteredRestaurants"
import { Product } from "@/utils/interfaces/product-detail";

export interface IProps {
    foodsData: Product[];
    error: boolean;
    loading: boolean;
    saveSearch: () => void;
    restaurants: IRestaurant[]
    loadMore: () => void;
    currentPage: number | undefined;
    totalPages: number | undefined;
}