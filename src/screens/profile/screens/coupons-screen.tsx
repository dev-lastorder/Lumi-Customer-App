// src/screens/coupons/CouponsScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Alert, TouchableOpacity, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLazyQuery } from '@apollo/client';

// ─── Components & Hooks ───────────────────────────────────────
import { ScreenWrapperWithAnimatedHeader, LoadingPlaceholder, NoData, CustomText } from '@/components';
import { useLocationPicker } from '@/hooks/useLocationPicker';

// ─── API & Assets ─────────────────────────────────────────────
import { GET_COMBINED_COUPONS } from '@/api';
import placeholderImage from '@/assets/images/no-coupons-found.png';

// ─── Local UI ─────────────────────────────────────────────────
import { CouponsListCard, CouponsListFooter } from '../components/coupons';

const CouponsScreen = () => {
  const {
    location: { latitude, longitude, zoneCoordinates, type },
  } = useLocationPicker();

  const [page, setPage] = useState(1);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // ref‐based cache & loading lock
  const cacheRef = useRef(new Map<number, any[]>());
  const loadingRef = useRef(false);

  const parsedLat = latitude ? parseFloat(latitude) : null;
  const parsedLng = longitude ? parseFloat(longitude) : null;

  // base query variables
  const baseVars: any = {
    page,
    limit: 15,
    ...(type === 'current' || type === 'address'
      ? { lat: parsedLat, lng: parsedLng }
      : {
          lat: null,
          lng: null,
          zoneCoordinates: {
            coordinates: zoneCoordinates,
            type: 'Polygon',
          },
        }),
  };

  const [fetchCoupons, { data, loading, fetchMore, error }] = useLazyQuery(GET_COMBINED_COUPONS, {
    fetchPolicy: 'network-only',
    variables: baseVars,
  });

  // initial fetch on location/type change
  useEffect(() => {
    if ((latitude && longitude) || (zoneCoordinates && zoneCoordinates.length > 0)) {
      cacheRef.current.clear();
      setCoupons([]);
      setPage(1);
      setHasMore(true);
      fetchCoupons();
    }
  }, [latitude, longitude, zoneCoordinates, type]);

  // append pages & update hasMore
  useEffect(() => {
    const resp = data?.getCouponsCombinedByStoreAndCoupons;
    if (resp) {
      const cur = resp.currentPage;
      const list = resp.data;

      if (!cacheRef.current.has(cur)) {
        cacheRef.current.set(cur, list);
        setCoupons((prev) => [...prev, ...list]);
      }

      setHasMore(!!resp.nextPage);
      setPage(cur);
      loadingRef.current = false;
    }

    if (error) {
      Alert.alert('Error', 'Failed to load coupons. Please try again later.');
    }
  }, [data, error]);

  // manually fetch next page
  const loadMore = useCallback(async () => {
    if (!hasMore) return;

    const next = page + 1;
    loadingRef.current = true;

    try {
      await fetchMore({
        variables: {
          page: next,
          limit: 15,
          ...(type === 'current' || type === 'address'
            ? { lat: parsedLat, lng: parsedLng }
            : {
                zoneCoordinates: {
                  coordinates: zoneCoordinates!,
                  type: 'Polygon',
                },
              }),
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const prevData = prev.getCouponsCombinedByStoreAndCoupons;
          const moreData = fetchMoreResult.getCouponsCombinedByStoreAndCoupons;
          return {
            getCouponsCombinedByStoreAndCoupons: {
              ...moreData,
              data: [...prevData.data, ...moreData.data],
            },
          };
        },
      });
      setPage(next);
      setHasMore(!!data?.getCouponsCombinedByStoreAndCoupons.nextPage);
    } catch (e) {
      
    } finally {
      loadingRef.current = false;
    }
  }, [page, hasMore, type, parsedLat, parsedLng, zoneCoordinates]);

  return (
    <ScreenWrapperWithAnimatedHeader
      title="All Coupons"
      location="Your Location"
      showGoBack
      showMap={false}
      showSettings={false}
      showLocationDropdown
      scrollEventThrottle={16}
    >
      <View className="px-4 py-6">
        {loading && coupons.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <LoadingPlaceholder />
          </View>
        ) : coupons.length > 0 ? (
          <>
            {coupons.map((c) => (
              <CouponsListCard key={c._id} coupon={c} />
            ))}

            {/* always show the footer loading indicator */}
            <CouponsListFooter isShow={coupons.length > 0} isLoadingMore={loading} hasMore={hasMore} />

            {/* new Load More button */}
            {hasMore && !loading && (
              <TouchableOpacity onPress={loadMore} disabled={loading} className="mt-4 mb-8 px-6 py-3 border border-primary rounded-full items-center">
                <CustomText variant="button" fontWeight="normal" fontSize="sm" className="text-white">
                  Load More
                </CustomText>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <NoData title="No Coupons Found" description="There are currently no coupons available in your location." imageSource={placeholderImage} />
        )}
      </View>
    </ScreenWrapperWithAnimatedHeader>
  );
};

export default CouponsScreen;
