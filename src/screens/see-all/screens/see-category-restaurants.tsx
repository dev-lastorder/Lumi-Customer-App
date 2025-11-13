import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

const SeeCategoryRestaurantsScreen = () => {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    console.log('Category ID:', id);
  }, [id]);

  return (
    <View>
      <Text>SeeCategoryRestaurantsScreen</Text>
    </View>
  );
};

export default SeeCategoryRestaurantsScreen;
