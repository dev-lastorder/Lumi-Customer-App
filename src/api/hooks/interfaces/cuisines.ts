export interface ICuisinesResponse {
  nearByRestaurantsCuisines: ICuisinesData[];
}

export interface ICuisinesData {
  _id: string;
  name: string;
  shopType: string;
}
export interface ICuisinesQueryProps {
  latitude: string | null;
  longitude: string | null;
}