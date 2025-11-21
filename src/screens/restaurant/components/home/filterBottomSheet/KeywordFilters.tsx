import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { CustomText } from '@/components';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { setStagedFilters } from '@/redux/slices/restaurantSlice';
import { useQuery } from '@apollo/client';
import { GET_ALL_CUISINES } from '@/api/graphql/query/getAllCuisines';
import { memo, useState } from 'react';
import { useThemeColor } from '@/hooks';

interface Cuisine {
  name: string;
}

const KeywordFilters = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state: RootState) => state.theme);
  const { primary: primaryColor } = useThemeColor();

  const { stagedFilters } = useSelector((state: RootState) => state.restaurant);
  const [cuisines, setCuisines] = useState<Cuisine[] | []>([]);

  const { loading } = useQuery(GET_ALL_CUISINES, {
    variables: {
      input: {
        shopType: 'Restaurant',
        paginate: false,
      },
    },
    onCompleted: ({ getAllCuisines }) => {
      const { cuisines } = getAllCuisines;
      setCuisines(cuisines);
    },
    onError: (error) => {console.error('Error fetching cuisines:', error);},
  });

  const handleFilterPress = (item: string) => {
    dispatch(setStagedFilters(item));
  };

  const ROW_COUNT = 3;
  const rows: string[][] = Array.from({ length: ROW_COUNT }, () => []);

  cuisines.forEach((item, index) => {
    const rowIndex = index % ROW_COUNT;
    rows[rowIndex].push(item?.name);
  });

  return (
    <View>
      <CustomText variant="heading2" fontWeight="semibold" className="mb-6">
        Filter
      </CustomText>

      <View className="pb-4 relative border-b border-b-border dark:border-b-dark-border">
        {loading ? (
          <View className="flex-1 justify-center items-center mt-6 mb-10">
            <ActivityIndicator size={'small'} color={currentTheme === 'dark' ? primaryColor : '#000'} />
          </View>
        ) : cuisines?.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-col justify-start gap-2">
              {rows.map((row, rowIdx) => (
                <View key={rowIdx} className="flex-row mb-2">
                  {row.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`px-4 py-2 rounded-full mx-1 
                                                ${stagedFilters.includes(item) ? 'bg-primary ' : 'bg-gray-100 dark:bg-primary/10'}`}
                      onPress={() => handleFilterPress(item)}
                    >
                      <Text
                        className={`
                                                    ${stagedFilters.includes(item) ? 'text-black' : 'text-gray-600 dark:text-primary'}
                                                `}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className=" mb-4">
            <CustomText className="text-center" variant="caption" fontSize="sm" fontWeight="medium">
              No filters found.
            </CustomText>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(KeywordFilters);
