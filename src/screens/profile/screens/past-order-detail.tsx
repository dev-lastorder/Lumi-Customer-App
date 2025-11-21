
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks';
import Animated from 'react-native-reanimated';
import { PastOrderDetailActions, PastOrderDetailDelivery, PastOrderDetailHeader, PastOrderDetailOrderItems, PastOrderDetailOrderStatus, PastOrderDetailOrderSummary, PastOrderDetailOrderTotal } from '../components/past-order-detail';
import { usePastOrderDetail } from '@/hooks/usePastOrderDetail';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';
import { CustomText, LoadingPlaceholder } from '@/components';



const PastOrderDetailMainScreen = () => {

    const { id } = useLocalSearchParams();
    const { order: pastOrder, loading, error, getOrderDisplayDate } = usePastOrderDetail(id as string);
    const orderDate = getOrderDisplayDate(pastOrder)
    const appTheme = useThemeColor();
    const router = useRouter();

    console.log(JSON.stringify(pastOrder.review), "past order reivew")


    return (
        <ScreenWrapperWithAnimatedTitleHeader title={pastOrder?.restaurant?.name || "Past Order Detail"}>

            {loading ? (
                <Animated.View className="flex-1 justify-center items-center mt-10">
                    <LoadingPlaceholder />
                    <CustomText fontSize="md" className="mt-4" style={{ color: appTheme.textSecondary }}>
                        Loading order details...
                    </CustomText>
                </Animated.View>
            ) : error ? (
                <DisplayErrorCard message={error?.message || 'Unable to fetch the order. Please try again.'} />
            ) : pastOrder ? (
                <Animated.ScrollView
                    style={{ flex: 1, backgroundColor: appTheme.background }}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40, paddingTop: 0 }}
                    showsVerticalScrollIndicator={false}
                >
                    <PastOrderDetailHeader
                        deliveredAt={pastOrder.createdAt}
                        restaurant={pastOrder.restaurant?.name}
                        appTheme={appTheme}
                    />
                    <PastOrderDetailDelivery
                        address={pastOrder.deliveryAddress?.deliveryAddress}
                        note={pastOrder.instructions}
                        phone={pastOrder.rider?.phone || ""}
                        appTheme={appTheme}
                    />
                    <PastOrderDetailOrderStatus
                        status={pastOrder.orderStatus}
                        statusTime={orderDate}
                        appTheme={appTheme}
                    />
                    <PastOrderDetailOrderTotal
                        price={pastOrder.orderAmount?.toString() || ""}
                        appTheme={appTheme}
                    />
                    <PastOrderDetailActions
                        appTheme={appTheme}
                        handleOrderAgain={() => {
                            router.push({
                                pathname: '/past-reorder',
                                params: { restaurantId: pastOrder?.restaurant?._id, orderId: pastOrder?._id },
                            });

                        }}
                        handleRateTheOrder={
                            () => {
                                router.push({
                                    pathname: '/(profile)/past-order-rating-and-tiping',
                                    params: { orderId: pastOrder?._id },
                                });
                            }
                        }
                        isShowRateAndTipBtn={false}
                    />
                    <PastOrderDetailOrderItems
                        items={pastOrder.items?.map(item => {
                            // Each addon price is the sum of its options' prices
                            const addonsTotal = Array.isArray(item.addons)
                                ? item.addons.reduce((addonSum, addon) => {
                                    const addonPrice = Array.isArray(addon.options)
                                        ? addon.options.reduce((optSum, opt) => optSum + (Number(opt.price) || 0), 0)
                                        : 0;
                                    return addonSum + addonPrice;
                                }, 0)
                                : 0;

                            // Variation price
                            const variationPrice = Number(item.variation?.price) || 0;

                            // Quantity
                            const quantity = Number(item.quantity) || 1;

                            // Total for one item
                            const singleItemTotal = variationPrice + addonsTotal;

                            // Total for all quantities
                            const totalPrice = singleItemTotal * quantity;

                            return {
                                name: item.title,
                                quantity: item.quantity,
                                image: { uri: item?.image },
                                price: totalPrice.toString(),
                            };
                        })}
                        appTheme={appTheme}
                    />
                    <PastOrderDetailOrderSummary
                        order={{
                            tip: pastOrder.tipping,
                            price: pastOrder.orderAmount,
                            paymentMethod: pastOrder.paymentMethod,
                            paymentTime: pastOrder.deliveredAt,
                            restaurant: pastOrder.restaurant?.name,
                            venueAddress: pastOrder.restaurant?.address,
                            venuePhone: pastOrder.restaurant?.phone,
                            orderNumber: pastOrder.orderId,
                            orderId: pastOrder._id,
                            deliveredAt: orderDate,
                            taxationAmount: pastOrder.taxationAmount,
                            deliveryCharges: pastOrder?.deliveryCharges,
                            serviceProvider: "Enatega, support@enatega.com", // or your actual provider
                        }}
                        appTheme={appTheme}
                    />
                </Animated.ScrollView>
            ) : null}


        </ScreenWrapperWithAnimatedTitleHeader>
    )
}

export default PastOrderDetailMainScreen