import { Product } from "@/utils/interfaces/product-detail";

export interface IProps {
    foodsData: Product[],
    saveSearch: () => void;
    onFoodPress: (item: Product) => void;
}