import { View, Text, Modal, Pressable } from 'react-native'
import React from 'react'
import { useThemeColor } from '@/hooks';
import { CustomText } from '@/components';
import Filters from './Filters';
import Sort from './Sort';
import Header from './Header';
import ShowOnly from './ShowOnly';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { useDispatch } from 'react-redux';
import { commitFilters, setShowFilters } from '@/redux/slices/searchSlice';


const FilterBottomSheet = () => {
    const dispatch = useDispatch();

    const { success } = useThemeColor();
    
    const { 
        stagedFilter , commitFilter , stagedSort , commitSort , stagedOpenOnly , commitOpenOnly , showFilters , filterViewMode
    } = useSelector((state : RootState) => state.search);



    let isDisabled = 
        filterViewMode === 'all' 
        ? 
            (stagedFilter === 'all' && commitFilter === 'all' && stagedSort === 'Recommended' && commitSort === 'Recommended' && !commitOpenOnly && !stagedOpenOnly) 
        : 
        filterViewMode === 'filter'
        ?
            (stagedFilter === 'all' && commitFilter === 'all')
        :
        filterViewMode === 'sort'
        ?
            (stagedSort === 'Recommended' && commitSort === 'Recommended')
        : 
        filterViewMode === 'openOnly'
        ?
            (!commitOpenOnly && !stagedOpenOnly)
        :
        false;

    return (
        <Modal
        animationType="slide"
        transparent
        visible={showFilters}
        >
            <Pressable 
            className="flex-1 justify-end bg-black/50"
            onPress={() => dispatch(setShowFilters(false))}
            >
                <Pressable 
                className="relative bg-bgLight dark:bg-dark-bgLight px-4 py-8 rounded-t-2xl"
                onPress={e => e.stopPropagation()}
                >

                    <Header />
                    {
                        (filterViewMode === 'all' || filterViewMode === 'filter') && (
                            <Filters />
                        ) 
                    }
                    {
                        (filterViewMode === 'all' || filterViewMode === 'sort') && (
                            <Sort />
                        ) 
                    }
                    {
                        (filterViewMode === 'all' || filterViewMode === 'openOnly') && (
                            <ShowOnly />
                        ) 
                    }

                    <Pressable 
                    className="disabled:bg-primary/20 bg-primary/80 py-4 rounded-xl" 
                    disabled={isDisabled}
                    onPress={() => dispatch(commitFilters())}
                    >
                        <CustomText
                        lightColor={isDisabled ? success : '#000'}
                        darkColor={isDisabled ? success : '#000'}
                        variant='button' 
                        fontSize='sm'
                        fontWeight='medium'
                        >
                            Apply
                        </CustomText>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default FilterBottomSheet