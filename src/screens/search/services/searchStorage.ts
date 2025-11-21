// services/searchStorage.ts
import { getItemFromLocalStorage, setItemToLocalStorage, removeItemFromLocalStorage } from '@/utils';

const SEARCH_STORAGE_KEY = 'searches';
const MAX_SEARCHES = 10;

/**
 * Stores a search term (ensures uniqueness, limit of 10).
 */
export const storeSearch = async (searchTerm: string): Promise<string[]> => {
  let searchesArray: string[] = (await getItemFromLocalStorage<string[]>(SEARCH_STORAGE_KEY)) || [];

  if (!searchesArray.includes(searchTerm)) {
    if (searchesArray.length === MAX_SEARCHES) {
      searchesArray.pop(); // remove the oldest
    }
    searchesArray.unshift(searchTerm); // add new to start
    await setItemToLocalStorage(SEARCH_STORAGE_KEY, searchesArray);
  }

  return searchesArray;
};

/**
 * Retrieves recent search terms.
 */
export const getRecentSearches = async (): Promise<string[]> => {
  const searches = await getItemFromLocalStorage<string[]>(SEARCH_STORAGE_KEY);
  return searches || [];
};

/**
 * Clears recent search terms.
 */
export const clearRecentSearches = async (): Promise<void> => {
  await removeItemFromLocalStorage(SEARCH_STORAGE_KEY);
};
