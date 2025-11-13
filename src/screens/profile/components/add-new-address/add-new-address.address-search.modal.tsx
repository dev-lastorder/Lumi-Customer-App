import React, { useState, useCallback } from 'react';
import { View, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
import { useQuery } from '@apollo/client';

// ─── Custom Components ─────────────────────────────────────────
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components';
import { GET_CONFIGURATION } from '@/api';
import { AddressSearchModalProps, Results } from './interface';

const AddressSearchModal: React.FC<AddressSearchModalProps> = ({ visible, onClose, onSelect, onSelectLatLong, zoneCoordinates }) => {
  // ─── Hooks ───────────────────────────────────────────────────
  const inset = useSafeAreaInsets();
  const { data } = useQuery(GET_CONFIGURATION);
  const apiKey = data?.configuration?.googleApiKey;

  // ─── State ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Results[]>([]);

  // ─── Search Handler with Google Places API ───────────────────
  const handleSearch = async (text: string) => {
    if (!apiKey || text.length < 3) return;

    let locationBias = '';

    // If zoneCoordinates exist, calculate center & bounds
    if (zoneCoordinates && zoneCoordinates.length > 2) {
      const lats = zoneCoordinates.map(([lng, lat]) => lat);
      const lngs = zoneCoordinates.map(([lng, lat]) => lng);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;

      const maxZoneSpan = Math.max(latDiff, lngDiff);
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      // Apply location bias depending on span
      locationBias =
        maxZoneSpan < 0.18 ? `locationbias=circle:10000@${centerLat},${centerLng}` : `locationbias=rect:${minLat},${minLng}|${maxLat},${maxLng}`;
    }

    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
        `?input=${encodeURIComponent(text)}` +
        `&inputtype=textquery` +
        `&fields=formatted_address,name,geometry` +
        `&key=${apiKey}` +
        locationBias;

      const res = await fetch(url);
      const json = await res.json();

      if (json.status === 'OK' && Array.isArray(json.candidates)) {
        const mapped: Results[] = json.candidates.map((c: any) => ({
          description: c.formatted_address ?? c.name,
          latitude: c.geometry.location.lat,
          longitude: c.geometry.location.lng,
        }));
        setResults(mapped);
      } else {
        setResults([]);
      }
    } catch (error) {

      setResults([]);
    }
  };

  // ─── Debounced Search ────────────────────────────────────────
  const debouncedSearch = useCallback(debounce(handleSearch, 400), [apiKey]);

  // ─── UI ──────────────────────────────────────────────────────
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ paddingTop: inset.top }} className="flex-1 bg-text/30 dark:bg-dark-text/30 px-4 pt-6">
        {/* Search Bar */}
        <View className="flex-row items-center bg-background dark:bg-dark-background px-4 py-4 rounded-md">
          <TouchableOpacity onPress={onClose}>
            <CustomIcon icon={{ type: 'Feather', name: 'arrow-left', size: 24 }} />
          </TouchableOpacity>

          <TextInput
            className="flex-1 ml-4 p-3 rounded-xl text-black dark:text-white"
            placeholder="Search for your address"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              debouncedSearch(text);
            }}
            autoFocus
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setResults([]);
              }}
              className="ml-2"
            >
              <CustomIcon icon={{ type: 'Feather', name: 'x', size: 20 }} />
            </TouchableOpacity>
          )}
        </View>

        {/* Show map fallback if no results */}
        {!results.length && (
          <TouchableOpacity
            className="flex-row items-center gap-2 px-4 py-4 border-t border-gray-200 bg-white dark:bg-dark-background mt-2 rounded-md"
            onPress={() => onSelect('MAP')}
          >
            <CustomIcon icon={{ type: 'Feather', name: 'map-pin', size: 18 }} />
            <View>
              <CustomText variant="body" fontSize="sm" fontWeight="semibold">
                Can’t find your address?
              </CustomText>
              <CustomText variant="caption">Use a map to do this instead</CustomText>
            </View>
          </TouchableOpacity>
        )}

        {/* Address Suggestions */}
        <View className="mt-2 rounded-md bg-white dark:bg-black">
          <FlatList
            data={results}
            keyExtractor={(item) => item?.description}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row gap-4 items-center px-4 py-4 border-b border-border dark:border-dark-border/30"
                onPress={() => {

                  onSelect(item.description);
                  onSelectLatLong ? onSelectLatLong({ latitude: String(item.latitude), longitude: String(item.longitude) }) : null;
                }}
              >
                <CustomIcon icon={{ type: 'Feather', name: 'map-pin', size: 18 }} />
                <CustomText variant="body" fontSize="md" fontWeight="normal" className="flex-1 text-black dark:text-white">
                  {item?.description}
                </CustomText>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {/* Footer */}
        <View className="px-4 bg-white rounded-md dark:bg-black py-2 text-right">
          <CustomText variant="caption" className="text-right text-gray-800 dark:text-white">
            powered by Google
          </CustomText>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSearchModal;
