import React, { useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, FlatList, Pressable, Image, Text, Dimensions, ViewToken } from 'react-native';
import { CustomText } from '../CustomText';
import { MAP_DARK_STYLE, Restaurant } from '@/utils';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks';
import { useAppSelector } from '@/redux';


interface Props {
    restaurants: Restaurant[];
}


const RestaurantStoreMapView: React.FC<Props> = ({ restaurants }) => {
    const mapRef = useRef<MapView>(null);
    const flatListRef = useRef<FlatList>(null);

    const [selectedId, setSelectedId] = useState<string | null>(restaurants[0]?._id || null);

    const { primary: primaryColor, text: textColor } = useThemeColor();
    const currencySymbol = useAppSelector(state => state.configuration.configuration.currencySymbol)

    const onMarkerPress = (index: number) => {
        const restaurant = restaurants[index];
        if (!restaurant.location?.coordinates) return;

        setSelectedId(restaurant._id);
        mapRef.current?.animateToRegion({
            latitude: Number(restaurant.location.coordinates[1]),
            longitude: Number(restaurant.location.coordinates[0]),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {

        if (viewableItems.length > 0) {
            const visible = viewableItems[0].item as Restaurant;
            setSelectedId(visible._id);

            mapRef.current?.animateToRegion({
                latitude: Number(visible.location?.coordinates[1]) || 0,
                longitude: Number(visible.location?.coordinates[0]) || 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }).current;

    const theme = useThemeColor();

    return (
        <View className="flex-1 bg-background dark:bg-dark-background" style={{ overflow: 'hidden' }}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: Number(restaurants[0]?.location?.coordinates[1]) || 0,
                    longitude: Number(restaurants[0]?.location?.coordinates[0]) || 0,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                customMapStyle={theme?.background == '#060606' ? MAP_DARK_STYLE : undefined}
            >
                {restaurants.map((r, index) => {
                    const lat = Number(r.location?.coordinates[1]);
                    const lng = Number(r.location?.coordinates[0]);

                    if (!lat || !lng) return null;

                    return (
                        <Marker
                            key={`${r?._id}-${selectedId === r?._id ? 'selected' : 'unselected'}`}
                            coordinate={{ latitude: lat, longitude: lng }}
                            onPress={() => onMarkerPress(index)}
                            zIndex={selectedId === r._id ? 1 : 0}
                        >
                            <Image
                                source={{ uri: r.image }}
                                className="w-9 h-9 rounded-full border-2 border-white z-50"
                            />
                        </Marker>
                    );
                })}
            </MapView>

            <FlatList
                ref={flatListRef}
                data={restaurants}
                horizontal
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Pressable
                        className={`bg-white dark:bg-dark-bgLight rounded-xl p-4 flex-row items-center gap-4 ml-5 
                            w-[300px] ${selectedId === item._id ? 'border border-gray-100 dark:border-primary' : ''
                            }`}
                        onPress={() => {
                            setSelectedId(item._id);
                            mapRef.current?.animateToRegion({
                                latitude: Number(item.location?.coordinates[1]) || 0,
                                longitude: Number(item.location?.coordinates[0]) || 0,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            });
                            flatListRef.current?.scrollToIndex({ index, animated: true });
                        }}
                    >
                        <Image
                            source={{ uri: item.image }}
                            className="w-20 h-20 rounded-lg border border-border dark:border-dark-border/30"
                        />
                        <View>
                            <CustomText
                                variant='heading3'
                                fontSize='sm'
                                fontWeight='semibold'
                            >
                                {item?.name}
                            </CustomText>
                            <View className='mt-2 flex-row items-center gap-4'>
                                <View className='flex-row items-center gap-1'>
                                    <AntDesign name="clockcircleo" size={14} color={primaryColor} />
                                    <Text className='text-xs text-primary dark:text-dark-primary'>{item?.deliveryTime} min</Text>
                                </View>
                                <View className='flex-row items-center gap-1'>
                                    <MaterialIcons name='store' size={18} color={textColor} />
                                    <Text className='text-xs text-text/80 dark:text-dark-text'>{currencySymbol}{item?.minimumOrder}</Text>
                                </View>
                                <View className='flex-row items-center gap-1'>
                                    <AntDesign name="staro" size={14} color={textColor} />
                                    <Text className='text-xs text-text/80 dark:text-dark-text'>{item?.reviewAverage?.toFixed(1)}</Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
                contentContainerStyle={{ paddingVertical: 10 }}
                style={{ position: 'absolute', bottom: 10 }}
                snapToInterval={300 + 20} // width of card + margin
                snapToAlignment="start"
                decelerationRate="fast"
            />
        </View>
    );
};

export default RestaurantStoreMapView;
