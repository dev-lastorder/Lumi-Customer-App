import React, { useMemo } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import CustomBottomSheetModal from '@/components/common/BottomModalSheet/CustomBottomSheetModal';
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components/common/CustomText';
import { Props, Zone } from './interfaces';

const ChooseZoneModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  selectedZoneId,
  zones,
  loading,
}) => {
  const sortedZones = useMemo(() => [...zones].sort((a, b) => a.title.localeCompare(b.title)), [zones]);



  const ZoneItem = ({ item }: { item: Zone }) => {
    const isSelected = item._id === selectedZoneId;

    return (
      <TouchableOpacity
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Select ${item.title}${isSelected ? ', currently selected' : ''}`}
        accessibilityState={{ selected: isSelected }}
        className="flex-row justify-between items-center px-5 py-4 min-h-[56px] border-b border-border dark:border-dark-border/30"
      >
        <CustomText
          variant="body"
          fontSize="md"
          numberOfLines={2}
          className={`flex text-base leading-6 ${isSelected ? 'text-primary font-semibold' : 'text-gray-800 font-normal'
            }`}
        >
          {item.title}
        </CustomText>

        {isSelected && (
          <View className="ml-3">
            <CustomIcon icon={{ type: 'Feather', name: 'check', size: 20, color: '#AAC810' }} />
          </View>
        )}
      </TouchableOpacity>
    );
  };


  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-16 gap-3">
      <CustomIcon icon={{ type: 'Feather', name: 'map-pin', size: 48, color: '#9CA3AF' }} />
      <CustomText variant="body" fontSize="md" className="text-base text-gray-500 text-center">
        No zones available
      </CustomText>
      <CustomText variant="body" fontSize="sm" className="text-sm text-gray-400 text-center px-5">
        Please check back later or contact support if this issue persists.
      </CustomText>
    </View>
  );

  const ListContent = () => (
    <FlatList
      data={sortedZones}
      keyExtractor={(item) => item._id}
      renderItem={ZoneItem}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator
      bounces
      accessibilityLabel="List of zones"
      accessibilityHint="Scroll to see all available zones"
    />
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center py-16">
          <ActivityIndicator size="large" color="#AAC810" />
        </View>
      );
    }
    if (!zones.length) return <EmptyState />;
    return <ListContent />;
  };

  return (
    <CustomBottomSheetModal visible={visible} onClose={onClose} headerTitle="Choose Zone">
      {renderContent()}
    </CustomBottomSheetModal>
  );
};

export default ChooseZoneModal;
