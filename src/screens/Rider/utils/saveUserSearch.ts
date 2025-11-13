import AsyncStorage from '@react-native-async-storage/async-storage';
export interface LocationItem {
    title: string;
    lat: string;
    lng: string;
    place_id?: string;
}

const FROM_KEY = '@recent_from';
const TO_KEY = '@recent_to';

export const saveRecentSearch = async (key: string, item: LocationItem) => {
    try {
        const existing = await AsyncStorage.getItem(key);
        let list = existing ? JSON.parse(existing) : [];

        list = list.filter((i: any) => i.title !== item.title);

        list.unshift(item);

        if (list.length > 5) list = list.slice(0, 5);

        await AsyncStorage.setItem(key, JSON.stringify(list));
    } catch (error) {
        console.log('Error saving recent search:', error);
    }
};

export const getRecentSearches = async (key: string) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log('Error fetching recent searches:', error);
        return [];
    }
};
