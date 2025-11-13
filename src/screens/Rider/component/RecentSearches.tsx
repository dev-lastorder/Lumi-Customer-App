import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import adjust from '@/utils/helpers/adjust';
import { CustomText } from '@/components';
import { getRecentSearches } from '../utils/saveUserSearch';

interface RecentItem {
    lng: string;
    lat: string;
    title: string;
    subtitle: string;
}

interface Props {
    type: 'from' | 'to';
    onSelect: (item: RecentItem) => void;
}

const RecentSearches: React.FC<Props> = ({ type, onSelect }) => {
    const [recentData, setRecentData] = useState<RecentItem[]>([]);

    useEffect(() => {
        const fetchRecent = async () => {
            const data = await getRecentSearches(type === 'from' ? '@recent_from' : '@recent_to');
            setRecentData(data);
            console.log('data of recent search', data)
        };

        fetchRecent();
    }, [type]);

    if (!recentData.length) return null;

    return (
        <View style={{ marginTop: adjust(16) }}>
            {recentData.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.searchRow}
                    onPress={() => onSelect(item)}
                >
                    <Ionicons name="location-outline" size={20} color="#000" style={{ marginRight: 8 }} />
                    <View>
                        <CustomText
                            className="leading-none"
                            lightColor="black"
                            darkColor="white"
                            fontSize="sm"
                            fontWeight="semibold"
                        >
                            {item.title}
                        </CustomText>
                        {item?.subtitle && (
                            <CustomText
                                className="leading-none"
                                lightColor="#71717A"
                                darkColor="#71717A"
                                fontSize="sxx"
                            >
                                {item.subtitle}
                            </CustomText>
                        )}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default RecentSearches;

const styles = StyleSheet.create({
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: adjust(8),
    },
});
