// src/components/CategoryCard/CategoryCard.smart.tsx
import React, { useCallback, useMemo } from 'react';
import { CategoryCardProps } from '../../interfaces/product-detail';
import CategoryCardDummy from './category-card.dummy';

interface CategoryCardSmartProps extends CategoryCardProps {
  onCategoryPress?: (categoryId: string, categoryName: string) => void;
}

const CategoryCardSmart: React.FC<CategoryCardSmartProps> = ({ item, onCategoryPress, isLoading }) => {
  const handlePress = useCallback(
    (categoryId: string) => {
      if (onCategoryPress) {
        onCategoryPress(categoryId, item.name);
      }
    },
    [onCategoryPress, item.name]
  );

  const memoizedItem = useMemo(() => item, [item.id, item.name, item.imageUri]);

  return <CategoryCardDummy item={memoizedItem} onPress={handlePress} isLoading={isLoading} />;
};

export default CategoryCardSmart;
