import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks';
import adjust from '@/utils/helpers/adjust';

interface CustomPaginationDotsProps {
  currentIndex: number;
  totalItems: number;
  onPressDot: (index: number) => void;
}

const CustomPaginationDots: React.FC<CustomPaginationDotsProps> = ({
  currentIndex,
  totalItems,
  onPressDot,
}) => {
  const { primary, bgLight } = useThemeColor();

  if (totalItems <= 1) {
    return null;
  }

  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? primary : bgLight },
            index === currentIndex && styles.activeDot,
          ]}
          onPress={() => onPressDot(index)}
          accessibilityLabel={`Go to slide ${index + 1}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: adjust(8),
    paddingVertical: adjust(8),
  },
  dot: {
    width: adjust(8),
    height: adjust(8),
    borderRadius: adjust(4),
  },
  activeDot: {
    // Add any specific active dot styles here if needed, e.g., a slightly larger size
    // width: adjust(10),
    // height: adjust(10),
    // borderRadius: adjust(5),
  },
});

export default CustomPaginationDots;
