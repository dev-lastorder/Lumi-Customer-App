import React from 'react';
import { View, ScrollView } from 'react-native';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';
import { SubItemsBottomSheet } from '@/components/modals/sub-items-bottom-sheet';
import { usePastReorderLogic } from '@/hooks/usePastReorderLogic';
import {
    PastReorderHeader,
    PastReorderItemList,
    PastReorderAddToCartButton,
    PastReorderLoadingError,
} from '@/screens/profile/components/past-reorder-screen';
import { useLocalSearchParams } from 'expo-router';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';

export default function PastReorderScreen() {
    const { orderId, restaurantId } = useLocalSearchParams();
    console.log(orderId, restaurantId, "orderid and restaurantId")
    const {
        order,
        orderLoading,
        orderError,
        restaurantData,
        restaurantLoading,
        restaurantError,
        selectedItems,
        isBottomSheetVisible,
        setIsBottomSheetVisible,
        currentSubItems,
        handleToggleSelectItem,
        handleShowSubItems,
        handleAddToCart,
        isAddToCartDisabled,
        calculateItemPrice,
    } = usePastReorderLogic(orderId, restaurantId);


    if (orderLoading || restaurantLoading) {
        return (
            <ScreenWrapperWithAnimatedTitleHeader title="Previous Order">
                <PastReorderLoadingError isLoading={true} message="" />
            </ScreenWrapperWithAnimatedTitleHeader>
        );
    }

    console.log(restaurantData)

    if (orderError || !order || restaurantError || !restaurantData?.restaurant) {
        return (
            <ScreenWrapperWithAnimatedTitleHeader title="Previous Order">
                <DisplayErrorCard message="Error loading order or restaurant details, or data not found." />
            </ScreenWrapperWithAnimatedTitleHeader>
        );
    }

    console.log("currentSubItems", JSON.stringify(currentSubItems, null, 2));

    return (
        <ScreenWrapperWithAnimatedTitleHeader
            title="Previous Order"
            footer={(
                <PastReorderAddToCartButton
                    onPress={handleAddToCart}
                    isDisabled={isAddToCartDisabled}
                />
            )}
        >
            <PastReorderHeader message="Select items to reorder again" />

            <PastReorderItemList
                orderItems={order.items}
                restaurantData={restaurantData}
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelectItem}
                onShowSubItems={handleShowSubItems}
                calculateItemPrice={calculateItemPrice}
            />

            <SubItemsBottomSheet
                visible={isBottomSheetVisible}
                onClose={() => setIsBottomSheetVisible(false)}
                subItems={currentSubItems}
            />
        </ScreenWrapperWithAnimatedTitleHeader>
    );
}
