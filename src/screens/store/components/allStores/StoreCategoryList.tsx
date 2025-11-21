import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks';
import { GET_ALL_CUISINES } from '@/api/graphql/query/getAllCuisines';
import { setSelectedCuisine } from '@/redux/slices/storeSlice';
import { RootState } from '@/redux';

import CategoryCard from '@/components/features/CategoryCard';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingCard from '@/screens/restaurant/components/LoadingCard';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';
import ItemNotFoundCard from '@/screens/restaurant/components/ItemNotFoundCard';

/* ----------------------------- Types ----------------------------- */
interface Cuisine {
  _id: string;
  name: string;
  image: string;
  shopType: string;
}

/* ------------------------- Hook: useCuisines ------------------------ */
const useCuisines = () => {
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  const { loading, error } = useQuery(GET_ALL_CUISINES, {
    variables: { input: { shopType: 'Grocery' } },
    onCompleted: ({ getAllCuisines }) => {
      setCuisines(getAllCuisines?.cuisines || []);
    },
    onError: (err) => {
      
    },
  });

  return { cuisines, loading, error };
};

/* --------------------- UI: CuisineScrollList ---------------------- */
const CuisineScrollList = ({
  cuisines,
  selectedCuisine,
  onSelect,
}: {
  cuisines: Cuisine[];
  selectedCuisine: string;
  onSelect: (name: string) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="pt-4 pb-2 pl-4"
    contentContainerClassName="gap-4"
  >
    {cuisines.map((cuisine, index) => (
      <CategoryCard
        key={index}
        category={cuisine}
        onPress={() => onSelect(cuisine.name)}
        isSelected={selectedCuisine === cuisine.name}
      />
    ))}
  </ScrollView>
);

/* -------------------------- Main Component -------------------------- */
const StoreCategoryList = () => {
  const { text, primary } = useThemeColor();
  const dispatch = useDispatch();
  const router = useRouter();

  const { selectedCuisine } = useSelector((state: RootState) => state.store);
  const { cuisines, loading, error } = useCuisines();

  const handleCuisinePress = (cuisineName: string) => {
    const isSelected = selectedCuisine === cuisineName;
    dispatch(setSelectedCuisine(isSelected ? '' : cuisineName));
  };

  const renderContent = () => {
    if (loading) return <LoadingCard message="Loading categories..." />;
    if (error) return <DisplayErrorCard message={`Error: ${error.message}`} />;
    if (!cuisines.length) return <ItemNotFoundCard message="No categories found" />;
    return (
      <CuisineScrollList
        cuisines={cuisines}
        selectedCuisine={selectedCuisine}
        onSelect={handleCuisinePress}
      />
    );
  };

  return (
    <View>
      <SectionHeader
        title="Categories"
        onSeeAll={() =>
          router.push({ pathname: '/see-all-categories', params: { title: 'All Store Categories' } })
        }
      />
      <View>{renderContent()}</View>
    </View>
  );
};

export default StoreCategoryList;
