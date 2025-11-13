import React from 'react';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { CustomText, LoadingPlaceholder } from '@/components';
import { useThemeColor, usePastOrderRating } from '@/hooks';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PORRatingModal, PORTipModal, PORHeader, POREmojiRating } from '../components/past-order-rating';

export default function PastOrderRatingAndTippingScreen() {
    const appTheme = useThemeColor();
    const router = useRouter();
    const inset = useSafeAreaInsets();

    const {
        rating,
        setRating,
        isLoading,
        tip,
        comment,
        showCommentModal,
        setShowCommentModal,
        showTipModal,
        setShowTipModal,
        tempComment,
        setTempComment,
        tempTip,
        setTempTip,
        handleSubmit,
        handleSaveComment,
        handleSaveTip,
        restaurant,
        loading: orderLoading,
        order,
    } = usePastOrderRating();

    if (orderLoading) {
        return (
            <View style={{ paddingTop: inset.top }} className="flex-1 bg-background dark:bg-dark-background justify-center items-center">
                <LoadingPlaceholder size="large" />
            </View>
        );
    }

    if (!restaurant) {
        return (
            <View style={{ paddingTop: inset.top }} className="flex-1 bg-background dark:bg-dark-background justify-center items-center">
                <CustomText>Order not found or an error occurred.</CustomText>
            </View>
        );
    }

    return (
        <View style={{ paddingTop: inset.top }} className="flex-1 bg-background dark:bg-dark-background">
            {/* Top bar */}
            <View className="flex-row justify-end items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <CustomText fontSize="sm" fontWeight="semibold" className="text-primary" style={{ color: appTheme.primary }}>
                        Skip
                    </CustomText>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <PORHeader restaurant={restaurant} />

                {/* Question */}
                <View className="items-center mb-2">
                    <CustomText fontWeight="bold" fontSize="xl" className="mb-2" style={{ color: appTheme.text }}>
                        How was the food?
                    </CustomText>
                    <CustomText fontSize="sm" className="text-center mb-6" style={{ color: appTheme.textSecondary }}>
                        Your feedback helps our restaurant partners improve their offering.
                    </CustomText>
                </View>

                <POREmojiRating onRate={setRating} selectedRating={rating} canEdit={!order?.review} />

                {/* Add comment button */}
                <View className="items-center mb-2">
                    {!order?.review ? <TouchableOpacity
                        className="mt-2 mb-4"
                        onPress={() => {
                            if (!order?.review) {
                                setTempComment(comment);
                                setShowCommentModal(true);
                            }
                        }}
                    >
                        <CustomText fontSize="sm" className="text-primary px-4 text-center" style={{ color: appTheme.primary }}>
                            {comment ? comment : "+ Add a comment for the restaurant"}
                        </CustomText>
                    </TouchableOpacity> : <CustomText fontSize="sm" className="text-primary px-4 text-center" style={{ color: appTheme.primary }}>
                        {order?.review?.description ? order?.review?.description : ""}
                    </CustomText>}
                </View>
            </ScrollView>

            <View className="border-t border-gray-200 dark:border-dark-grey/30 pt-3" >

                {/* Courier tip section */}
                {rating > 2 && <View className="flex-row items-center justify-between px-4 pb-3  bg-background dark:bg-dark-background">
                    <CustomText fontSize="md" style={{ color: appTheme.text }}>
                        Courier tip: <CustomText fontWeight="bold">{tip} €</CustomText>
                    </CustomText>
                    <TouchableOpacity onPress={() => {
                        setTempTip(tip);
                        setShowTipModal(true);
                    }}>
                        <CustomText fontWeight="semibold" fontSize="md" className="text-primary" style={{ color: appTheme.primary }}>
                            Increase
                        </CustomText>
                    </TouchableOpacity>
                </View>}

                {/* Complete button */}
                <View className="px-4 pb-6 pt-2 bg-background dark:bg-dark-background">

                    <TouchableOpacity
                        className={`h-14 justify-center items-center rounded-xl ${(!rating || isLoading || (order?.review && Number(tip) === 0)) ? 'opacity-50' : ''}`}
                        style={{
                            backgroundColor: appTheme.primary,
                            width: '100%',
                        }}
                        onPress={() => handleSubmit(!order?.review)}
                        disabled={!rating || isLoading || (order?.review && Number(tip) === 0)}
                    >

                        {isLoading ? (
                            <ActivityIndicator size="small" color={appTheme.background} />
                        ) : (
                            <CustomText fontWeight="medium" fontSize="md" style={{ color: appTheme.buttonText }}>
                                Complete
                            </CustomText>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <PORRatingModal
                isVisible={showCommentModal}
                onClose={() => setShowCommentModal(false)}
                onSave={handleSaveComment}
                tempComment={tempComment}
                setTempComment={setTempComment}
            />

            <PORTipModal
                isVisible={showTipModal}
                onClose={() => setShowTipModal(false)}
                onSave={handleSaveTip}
                tempTip={tempTip}
                setTempTip={setTempTip}
            />
        </View>
    );
}
