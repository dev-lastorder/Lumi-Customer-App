import { View, Text, TouchableOpacity , ScrollView } from 'react-native';
import { CustomText } from '@/components';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { setStagedFilter } from '@/redux/slices/searchSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';


type FilterItem = {
  id: number;
  key: string;
  value: string;
  isDefault?: boolean;
};

const filters: FilterItem[] = [
    {
        id: 1 ,
        key: 'All results',
        value: 'all',
        isDefault: true
    },
    {
        id: 2,
        key: 'Restaurant',
        value: 'restaurant'
    },
    {
        id:3,
        key: 'Grocery',
        value: 'grocery'
    }
]


const Filters = () => {
    const dispatch = useDispatch();
    const { stagedFilter } = useSelector((state: RootState) => state.search)


    const handleFilterPress = (filter : string) => {
        dispatch(setStagedFilter(filter))
    }

    return (
        <View>
            <CustomText variant="heading2" fontWeight="semibold" className="mb-6">
                Filter
            </CustomText>

            <View className="pb-4 relative border-b border-b-border dark:border-b-dark-border">
                {
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row mb-2">
                            {filters.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    className={`px-4 py-2 rounded-full mx-1 
                                    ${stagedFilter.includes(item.value) ? 'bg-primary ' : 'bg-gray-100 dark:bg-primary/10'}`}
                                    onPress={() => handleFilterPress(item?.value)}
                                >
                                    <Text
                                        className={`
                                        ${stagedFilter.includes(item.value) ? 'text-black' : 'text-gray-600 dark:text-primary'}
                                    `}
                                    >
                                        {item.key}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                }
            </View>
        </View>
    );
};

export default memo(Filters);
