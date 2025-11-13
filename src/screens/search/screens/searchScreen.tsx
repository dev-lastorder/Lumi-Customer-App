import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import { FilterBar, SearchBar, SearchResults, SearchHistory } from '../components';
import { CustomIcon, CustomText } from '@/components';
import LocationPickerModal from '@/components/common/LocationPickerModal';
import Cuisines from '../components/cuisines/cuisines';

// Hooks
import { useThemeColor } from '@/hooks';
import { useLocationPicker } from '@/hooks/useLocationPicker';

// Utils / Services
import { useDebounce } from '@/utils';
import { useCuisines } from '@/api';
import { clearRecentSearches, getRecentSearches, storeSearch } from '../services';
import { clearAllFilters } from '@/redux/slices/searchSlice';
import adjust from '@/utils/helpers/adjust';

const SearchScreen = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [search, setSearch] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [seeAllFoods, setSeeAllFoods] = useState(false);
  const [searches, setSearches] = useState<string[]>([]);

  const { location: locationPicker, toggleLocationModal } = useLocationPicker();
  const { background: backgroundColor, text: color, primary } = useThemeColor();

  const debouncedKeyword = useDebounce(search);

  const { data, error, loading, refetch } = useCuisines({
    latitude: locationPicker?.latitude,
    longitude: locationPicker?.longitude,
  });

  // Lifecycle
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Handlers
  const loadSearchHistory = async () => {
    const results = await getRecentSearches();
    setSearches(results);
  };

  const clearSearchHistory = async () => {
    await clearRecentSearches();
    setSearches([]);
  };

  const resetSearch = () => {
    setSearch('');
    if (!seeAllFoods) inputRef.current?.blur();
    else setSeeAllFoods(false);
    dispatch(clearAllFilters());
  };

  const clearField = () => {
    setSearch('');
    resetSearch();
  };

  const saveSearch = async () => {
    await storeSearch(search);
    await loadSearchHistory();
  };

  return (
    <View style={{ paddingTop: insets.top + adjust(12), gap: adjust(12), backgroundColor }}>
      <HeaderSection
        search={search}
        setSearch={setSearch}
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        seeAllFoods={seeAllFoods}
        setSeeAllFoods={setSeeAllFoods}
        handleOnChange={setSearch}
        handleOnBlur={resetSearch}
        handleClearField={clearField}
        inputRef={inputRef}
      />

      {search !== '' && <FilterBar />}

      {search === '' ? (
        <ScrollView
          className="h-full w-full"
          contentContainerStyle={{ flexGrow: 1, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1" style={{ backgroundColor, gap: 20 }}>
            {!isFocus && <LocationSelector selectedTitle={locationPicker?.selectedTitle} onPress={() => toggleLocationModal(true)} />}
            {!isFocus && <Cuisines data={data || []} loading={loading} error={!!error} setSearch={setSearch} handleOnChange={setSearch} refetch={refetch} />}
            {isFocus && searches.length > 0 && (
              <SearchHistory searches={searches} setSearch={setSearch} delSearchHistory={clearSearchHistory} />
            )}
          </View>
        </ScrollView>
      ) : (
        <SearchResults
          keyword={debouncedKeyword}
          saveSearch={saveSearch}
          locationPicker={locationPicker}
          setSeeAllFoods={setSeeAllFoods}
          seeAllFoods={seeAllFoods}
          setIsFocus={setIsFocus}
        />
      )}

      <LocationPickerModal
        visible={locationPicker.showLocationModal}
        onClose={() => toggleLocationModal(false)}
        onOpen={() => toggleLocationModal(true)}
        redirectTo='search-home'
      />
    </View>
  );
};

export default SearchScreen;

const HeaderSection = ({
  search,
  setSearch,
  isFocus,
  setIsFocus,
  seeAllFoods,
  setSeeAllFoods,
  handleOnChange,
  handleOnBlur,
  handleClearField,
  inputRef,
}: any) => {
  const { background: backgroundColor } = useThemeColor();
  return (
    <View className="items-center px-4" style={{ backgroundColor }}>
      <View className="w-full">
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleOnBlur={handleOnBlur}
          handleOnChange={handleOnChange}
          handleClearField={handleClearField}
          inputRef={inputRef}
          isFocus={isFocus}
          setIsFocus={setIsFocus}
          seeAllFoods={seeAllFoods}
          setSeeAllFoods={setSeeAllFoods}
        />
      </View>
    </View>
  );
};


const LocationSelector = ({
  selectedTitle,
  onPress,
}: {
  selectedTitle: string;
  onPress: () => void;
}) => {
  const { background: backgroundColor, primary } = useThemeColor();
  return (
    <View className="w-full items-start px-4" style={{ backgroundColor }}>
      <TouchableOpacity className="flex-row justify-center items-center" onPress={onPress}>
        <CustomText fontSize="xs" fontWeight='semibold' className='text-text-secondary dark:text-text-secondary' isDefaultColor={false} style={{lineHeight:adjust(24)}} >
          Search near{'  '}
          <CustomText fontSize="xs" fontWeight='semibold' className="text-text dark:text-dark-text" isDefaultColor={false} style={{lineHeight:adjust(24)}}>
            {selectedTitle}
          </CustomText>
        </CustomText>
        <CustomIcon icon={{ size: 10, type: 'AntDesign', name: 'down', color: primary }} className='text-text dark:text-dark-text' />
      </TouchableOpacity>
    </View>
  );
};
