import { Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../components/seeAllItems/Header';
import { CustomText } from '@/components';
import { useState } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { ProductCard } from '../components';
import { Product } from '@/utils/interfaces/product-detail';

const productsData = [
  {
    id: 'prod3',
    image: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
    title: 'Aranzhim Lulesh Miks',
    price: 2500,
    currency: 'ALL',
    description: 'Një kombinim i freskët...',
    isActive: true,
    isOutOfStock: true,
  },
  {
    id: 'prod3',
    image: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
    title: 'Aranzhim Lulesh Miks',
    price: 2500,
    currency: 'ALL',
    description: 'Një kombinim i freskët...',
    isActive: true,
    isOutOfStock: true,
  },
  {
    id: 'prod3',
    image: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
    title: 'Aranzhim Lulesh Miks',
    price: 2500,
    currency: 'ALL',
    description: 'Një kombinim i freskët...',
    isActive: true,
    isOutOfStock: true,
  },
  {
    id: 'prod3',
    image: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
    title: 'Aranzhim Lulesh Miks',
    price: 2500,
    currency: 'ALL',
    description: 'Një kombinim i freskët...',
    isActive: true,
    isOutOfStock: true,
  },
  {
    id: 'prod3',
    image: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
    title: 'Aranzhim Lulesh Miks',
    price: 2500,
    currency: 'ALL',
    description: 'Një kombinim i freskët...',
    isActive: true,
    isOutOfStock: true,
  },
  {
    id: 'prod3',
    image: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
    title: 'Aranzhim Lulesh Miks',
    price: 2500,
    currency: 'ALL',
    description: 'Një kombinim i freskët...',
    isActive: true,
    isOutOfStock: true,
  },
  {
    id: 'prod3',
    image: 'https://images.pexels.com/photos/4109122/pexels-photo-4109122.jpeg',
    title: 'Aranzhim Lulesh Miks',
    price: 2500,
    currency: 'ALL',
    description: 'Një kombinim i freskët...',
    isActive: true,
    isOutOfStock: true,
  },
];

const SeeAllItemsScreen = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="bg-bgLight dark:bg-dark-bgLight px-4 pt-2 pb-4">
        <Header />
      </SafeAreaView>

      <ScrollView className="pt-6 flex-1 bg-white dark:bg-black px-4 flex-col gap-3" showsVerticalScrollIndicator={false}>
        <CustomText variant="heading3" fontWeight="semibold" fontSize="lg">
          Deals
        </CustomText>

        <View className="flex-row flex-wrap gap-x-3">
          {products.map((item) => (
            <View key={item.id}>
              <ProductCard product={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SeeAllItemsScreen;
