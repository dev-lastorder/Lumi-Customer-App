import { Modal, Pressable } from 'react-native';
import KeywordFilters from './KeywordFilters';
import SortOptions from './SortOptions';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from '@/redux';
import { useDispatch } from 'react-redux';
import { commitFilters, setCommitFiltersToStaged, setIsFiltersApplied, setShowFilters } from '@/redux/slices/storeSlice';
import FiltersSheetHeader from './FiltersSheetHeader';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_NEARBY_RESTAURANTS_AND_STORE_COUNT } from '@/api/graphql/query/getNearbyRestaurantsAndStores';



const FilterBottomSheet = () => {
    const dispatch = useDispatch();

    const { showFilters, appliedFilters, appliedSort, stagedFilters, stagedSort, isFiltersApplied } = useSelector((state: RootState) => state.store);
    const location = useAppSelector((state) => state.locationPicker);
    const { success } = useThemeColor();

    const [getRestaurantsCount, { data: countData, loading: countLoading, called, error: countError }] = useLazyQuery(GET_NEARBY_RESTAURANTS_AND_STORE_COUNT);

    useEffect(() => {
        if (showFilters || isFiltersApplied) {
            getRestaurantsCount({
                variables: {
                    input: {
                        userLocation: {
                            latitude: parseFloat(location.latitude || '0'),
                            longitude: parseFloat(location.longitude || '0'),
                        },
                        shopType: "grocery",
                        filters: stagedFilters,
                        sortBy: stagedSort === 'Recommended' ? null : stagedSort,
                    }
                }
            });
        }
    }, [stagedFilters, stagedSort, showFilters, isFiltersApplied, location.latitude, location.longitude]);

    const applyFilter = () => {
        dispatch(commitFilters());
        dispatch(setShowFilters(false));
    }


    const closeModal = () => {
        dispatch(setShowFilters(false));
        dispatch(setIsFiltersApplied(false));
    }

    const isDisabled = stagedFilters?.length === 0 && appliedFilters?.length === 0 && appliedSort === 'Recommended' && stagedSort === 'Recommended';



    useEffect(() => {
        if (!showFilters && !isFiltersApplied) {
            dispatch(setCommitFiltersToStaged())
        }
    }, [showFilters]);

    return (
        <Modal
            animationType="slide"
            transparent
            visible={showFilters}
        >
            <Pressable
                className="flex-1 justify-end bg-black/50"
                onPress={closeModal}
            >
                <Pressable
                    className="relative bg-bgLight dark:bg-dark-bgLight px-4 py-8 rounded-t-2xl"
                    onPress={e => e.stopPropagation()}
                >
                    <FiltersSheetHeader />
                    <KeywordFilters />
                    <SortOptions />

                    <Pressable
                        className="disabled:bg-primary/20 bg-primary/80 py-4 rounded-xl"
                        disabled={isDisabled}
                        onPress={applyFilter}
                    >
                        <CustomText
                            lightColor={isDisabled ? success : '#000'}
                            darkColor={isDisabled ? success : '#000'}
                            variant='button'
                            fontSize='sm'
                            fontWeight='medium'
                        >
                            {countLoading
                                ? 'Apply (searching...)'
                                : countData?.getNearbyRestaurantsOrStoresCount?.docsCount !== undefined && countData?.getNearbyRestaurantsOrStoresCount?.docsCount !== null
                                    ? `Apply (${countData.getNearbyRestaurantsOrStoresCount.docsCount} found)`
                                    : 'Apply'}
                        </CustomText>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default FilterBottomSheet;
