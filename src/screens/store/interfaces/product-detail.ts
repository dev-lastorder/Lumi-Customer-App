export interface Category {
  id: string;
  name: string;
  imageUri: string;
}

interface APIFetchedCategory {
  id: string;
  category_name: string;
  url: string;
  food_id: string;
}

export interface FetchCategoryDetailsResponse {
  fetchCategoryDetailsByStoreIdForMobile: APIFetchedCategory[];
}
