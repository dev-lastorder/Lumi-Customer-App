// Components

import { useState } from 'react';
import { View } from 'react-native';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';
import { OrderHistoryHeader, OrderHistoryList, OrderHistoryNoData } from '../components/order-history';
import { useUserOrderHistory } from '@/hooks/useUserOrderHistory';
import { groupOrdersByDate } from '@/utils/helpers/groupOrdersByDate';
import { CustomText, LoadingPlaceholder } from '@/components';
import { useThemeColor } from '@/hooks';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';


const OrderHistoryMainScreen = () => {

    // const [orders] = useState<any[]>(demoOrders); // [] for no data
    const { orders, loading, error } = useUserOrderHistory();
    const appTheme = useThemeColor();
    const groupedOrders = groupOrdersByDate(orders);


    return (
        <ScreenWrapperWithAnimatedTitleHeader title="Past Orders">
            <View className="flex-1 bg-background dark:bg-dark-background">

                {loading ? (
                    <>
                        <OrderHistoryHeader />
                        <View className="flex-1 mt-10  justify-center items-center">
                            <LoadingPlaceholder />
                            <CustomText fontSize="md" className="mt-4" style={{ color: appTheme.textSecondary }}>
                                Loading your orders...
                            </CustomText>
                        </View>
                    </>
                ) : error ? (
                    <>
                        <OrderHistoryHeader />
                        <DisplayErrorCard message={error?.message || "Unable to fetch the Orders please try again."} />
                    </>
                ) : orders.length === 0 && !loading ? (
                    <OrderHistoryNoData onBrowse={() => { /* navigate to browse */ }} />
                ) : (
                    <>
                        <OrderHistoryHeader />
                        <OrderHistoryList orders={groupedOrders} />
                    </>
                )}
            </View>

        </ScreenWrapperWithAnimatedTitleHeader>
    );
};

export default OrderHistoryMainScreen;
