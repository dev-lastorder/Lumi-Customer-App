import { IRestaurant } from "@/api";

export interface IProps{
    data: IRestaurant[],
    saveSearch: () => void;
    onRestaurantPress: (id: string) => void;
}