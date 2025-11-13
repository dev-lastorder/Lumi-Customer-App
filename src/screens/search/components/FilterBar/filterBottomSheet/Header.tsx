import { View , Pressable } from 'react-native';
import { CustomIcon, CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { useDispatch } from 'react-redux';
import { RootState } from '@/redux';
import { useSelector } from 'react-redux';
import { clearFilters, setShowFilters } from '@/redux/slices/searchSlice';



const Header = () => {
    const dispatch = useDispatch();
    const { stagedSort , stagedFilter , stagedOpenOnly , filterViewMode } = useSelector((state : RootState) => state.search)

    const { primary } = useThemeColor();


    const showClearFilterBtn = filterViewMode === 'all' 
        ? 
            (stagedSort !== 'Recommended' || stagedFilter !== 'all' || stagedOpenOnly) 
        : 
        filterViewMode === 'filter'
        ?
            (stagedFilter !== 'all')
        :
        filterViewMode === 'sort'
        ?
            (stagedSort !== 'Recommended')
        : 
        filterViewMode === 'openOnly'
        ?
            (stagedOpenOnly)
        :
        false;
        

    return (
        <View className="flex-row items-center justify-between mb-12">
            {
                showClearFilterBtn
                ?
                    <Pressable>
                        <CustomText
                        variant="defaults"
                        fontWeight="medium"
                        lightColor={'#000'}
                        darkColor={primary}
                        onPress={() => {
                            dispatch(clearFilters())
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

export default Header;
