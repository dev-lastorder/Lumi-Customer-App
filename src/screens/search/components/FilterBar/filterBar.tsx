import React, { useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { CustomIcon, CustomText } from '@/components';
import FilterBottomSheet from './filterBottomSheet';
import { useThemeColor } from '@/hooks';
import { RootState } from '@/redux';
import { clearAllFilters, setCommitFiltersToStaged, setFilterViewMode } from '@/redux/slices/searchSlice';
import splitCamelCase from '@/utils/helpers/splitCamelCase';
import adjust from '@/utils/helpers/adjust';

const FilterBar = () => {
  const dispatch = useDispatch();
  const { bgLight, text, primary } = useThemeColor();
  const { showFilters, commitFilter, commitSort, commitOpenOnly } = useSelector(
    (state: RootState) => state.search
  );

  const isSortApplied = commitSort !== 'Recommended';
  const isFilterApplied = commitFilter !== 'all';
  const isAnyFilterApplied = isSortApplied || isFilterApplied || commitOpenOnly;

  useEffect(() => {
    if (!showFilters) {
      dispatch(setCommitFiltersToStaged());
    }
  }, [showFilters]);

  const handleShowModal = (mode: 'all' | 'sort' | 'filter' | 'openOnly') => {
    dispatch(setFilterViewMode(mode));
  };

  const handleClearAll = () => {
    dispatch(clearAllFilters());
  };

  return (
    <View className="flex-row gap-2 pl-4">
      <FilterIconButton onPress={() => handleShowModal('all')} isActive={isAnyFilterApplied} bgColor={bgLight} iconColor={text} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>

        <View className="flex-row items-center justify-start gap-2" style={{ minWidth: '100%' }}>
          <FilterPill
            label={isSortApplied ? splitCamelCase(commitSort) : 'Sort by'}
            isActive={isSortApplied}
            onPress={() => handleShowModal('sort')}
            color={primary}
            textColor={text}
          />

          <FilterPill
            label={isFilterApplied ? splitCamelCase(commitFilter) : 'All results'}
            isActive={isFilterApplied}
            onPress={() => handleShowModal('filter')}
            color={primary}
            textColor={text}
          />

          <FilterPill
            label="Open now"
            isActive={commitOpenOnly}
            onPress={() => handleShowModal('openOnly')}
            color={primary}
            textColor={text}
          />

          {isAnyFilterApplied && <ClearAllButton onPress={handleClearAll} color={primary} />}
        </View>
      </ScrollView>

      <FilterBottomSheet />
    </View>
  );
};

export default FilterBar;

// ------------------------
// Subcomponents
// ------------------------

const FilterIconButton = ({
  onPress,
  isActive,
  bgColor,
  iconColor,
}: {
  onPress: () => void;
  isActive: boolean;
  bgColor: string;
  iconColor: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center px-3 py-3 gap-1 rounded-full relative"
    style={{ backgroundColor: bgColor }}
  >
    <CustomIcon icon={{ size: adjust(18), type: 'Octicons', name: 'filter', color: iconColor }} />
    {isActive && <View className="absolute -top-1 right-0 w-3 h-3 bg-primary rounded-full" />}
  </TouchableOpacity>
);

const FilterPill = ({
  label,
  isActive,
  onPress,
  color,
  textColor,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  color: string;
  textColor: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`
      flex-row items-center gap-1 px-5 py-2 rounded-3xl border-[2px]
      ${isActive ? 'border-primary' : 'border-border dark:border-dark-border/30'}
    `}
  >
    <CustomText variant='label' fontWeight='semibold' style={{ color: isActive ? color : textColor }}>
      {label}
    </CustomText>
    <CustomIcon
      icon={{
        size: adjust(12),
        type: 'AntDesign',
        name: 'down',
        color: isActive ? color : textColor,
      }}
    />
  </TouchableOpacity>
);

const ClearAllButton = ({ onPress, color }: { onPress: () => void; color: string }) => (
  <TouchableOpacity className="flex-row items-center gap-1 px-3" onPress={onPress}>
    <CustomText fontSize="xs" fontWeight="medium" style={{ color }}>
      Clear all
    </CustomText>
  </TouchableOpacity>
);
