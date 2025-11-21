import { View , Pressable } from 'react-native';
import { CustomIcon, CustomText } from '@/components';
import { clearFilters, setIsFiltersApplied, setShowFilters } from '@/redux/slices/restaurantSlice';
import { useDispatch } from 'react-redux';
import { useThemeColor } from '@/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';

const FiltersSheetHeader = () => {
    const dispatch = useDispatch();
    const { primary } = useThemeColor();

    const { stagedFilters , stagedSort } = useSelector((state : RootState) => state.restaurant)

    return (
        <View className="flex-row items-center justify-between mb-12">
            {
                stagedSort !== 'Recommended' || stagedFilters?.length > 0
                ?
                    <Pressable>
                        <CustomText
                        variant="defaults"
                        fontWeight="medium"
                        lightColor={'#000'}
                        darkColor={primary}
                        onPress={() => {
                            dispatch(clearFilters());
                            dispatch(setIsFiltersApplied(false))
                        }}
                        >
                            Clear Filters
                        </CustomText>
                    </Pressable>
                : 
                    <View></View>
            }
            
            <Pressable 
            className="bg-gray-100 dark:bg-gray-500/30 w-10 h-10 flex items-center justify-center rounded-full" 
            onPress={() => dispatch(setShowFilters(false))}
            >
                <CustomIcon icon={{ size: 28, type: 'Entypo', name: 'cross' }} />
            </Pressable>
        </View>
    );
};

export default FiltersSheetHeader;
