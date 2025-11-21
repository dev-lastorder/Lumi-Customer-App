// src/screens/checkout/CheckoutScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { DeliveryForm } from '../components/order-checkout/delivery-form';
import { MapWithShadow } from '../components/order-checkout/map-with-shadow';
import { PickupForm } from '../components/order-checkout/pickup-form';
import {
  clearCart,
  RootState,
  setCouponCode,
  setCouponDiscount,
  setOrderMode,
  setPaymentMethod,
  setShippingAddress,
  useAppDispatch,
  useAppSelector,
} from '@/redux';

// ─── GraphQL ──────────────────────────────────────────────────

import { PAYMENT_METHODS } from '@/utils';
import { set } from 'lodash';
import { TypeToggle } from '../components/order-checkout/type-toggle';
import { VALIDATE_COUPON } from '@/api/graphql/mutation/coupon';
import { PLACE_ORDER } from '@/api/graphql/mutation/order';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@apollo/client';
import { GET_RESTAURANT_FOR_CHECKOUT_SCREEN } from '@/api';
import { addOrderId } from '@/redux/slices/orderIdsSlice';
import { CustomHeader, CustomIcon, CustomText } from '@/components';
import SlideToConfirmButton from '@/components/common/SlideToConfirm';

// ─── Types ──────────────────────────────────────────────────

type CheckoutScreenProps = {
  source?: string
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ source }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { configuration } = useSelector((s: RootState) => s.configuration);
  const auth = useSelector((s: RootState) => s.auth);

  const { checkout, currentRestaurantId, items } = useSelector((s: RootState) => s.cart);
  const mode = checkout?.orderMode || 'Delivery';
  // const mode = useSelector((s: RootState) => s.cart.checkout?.orderMode) || 'Delivery';
  const location = useAppSelector((s) => s.locationPicker);

  const [isPickup, setIsPickup] = useState(checkout?.orderMode === 'Pickup');
  const [orderLoading, setOrderLoading] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);

  // ─── Derived state ──────────────────────────────────────────
  const { data: restaurantData, loading: loadingData } = useQuery(GET_RESTAURANT_FOR_CHECKOUT_SCREEN, {
    variables: { id: currentRestaurantId },
    fetchPolicy: 'network-only',
  });

  // Debugging logs for MapViewDirections
  useEffect(() => {
    if (!loadingData && restaurantData) {
      const restaurantCoords = restaurantData?.restaurant?.location.coordinates;
      console.log('Restaurant Coordinates (raw):', restaurantCoords);
      console.log('Shipping Latitude (raw):', checkout.shippingLatitude);
      console.log('Shipping Longitude (raw):', checkout.shippingLongitude);

      const sourceLat = Number(restaurantCoords?.[1]) || 0;
      const sourceLon = Number(restaurantCoords?.[0]) || 0;
      const destLat = Number(checkout.shippingLatitude) || 0;
      const destLon = Number(checkout.shippingLongitude) || 0;

      console.log('MapWithShadow Source (processed):', { latitude: sourceLat, longitude: sourceLon });
      console.log('MapWithShadow Destination (processed):', { latitude: destLat, longitude: destLon });
    }
  }, [loadingData, restaurantData, checkout.shippingLatitude, checkout.shippingLongitude]);

  useMemo(() => {
    if (location.type === 'current' || location.type === 'address') {
      dispatch(
        setShippingAddress({
          addressId: location.addressId ? location.addressId : '',
          address: location.label ? location.label : '',
          latitude: location.latitude ? location.latitude : '',
          longitude: location.longitude ? location.longitude : '',
          addressDetails: location.label ? location.label : '',
        })
      );
    }
  }, [location]);

  useEffect(() => {
    if (restaurantData?.restaurant) {
      const { pickup, delivery } = restaurantData?.restaurant?.deliveryOptions || {};
      const pickupOnly = pickup && !delivery;
      dispatch(setOrderMode(pickupOnly ? 'Pickup' : 'Delivery'));
    }
  }, [restaurantData])

  useMemo(() => {
    let isSubscribed = true;
    (async () => {
      if (restaurantData && !!restaurantData?.restaurant) {
        const latOrigin = Number(restaurantData?.restaurant.location.coordinates[1]);
        const lonOrigin = Number(restaurantData?.restaurant.location.coordinates[0]);
        const latDest = Number(location.latitude);
        const longDest = Number(location.longitude);
        const distance = calculateDistance(latOrigin, lonOrigin, latDest, longDest);
        setTax(parseFloat(restaurantData?.restaurant.tax) || 0);
        let costType = configuration.costType;
        let amount = calculateAmount(costType, configuration.deliveryRate, distance);

        if (isSubscribed) {
          setDeliveryCharges(amount > 0 ? parseFloat(amount) : configuration.deliveryRate);
        }
      }
    })();
    return () => {
      isSubscribed = false;
    };
  }, [restaurantData, location]);

  const [validateCoupon, { loading: loadingCoupon }] = useMutation(VALIDATE_COUPON, {
    onCompleted: ({ coupon }) => {
      if (coupon.enabled) {
        dispatch(setCouponCode(coupon.title));
        dispatch(setCouponDiscount(coupon.discount));
      } else {
      }
    },
    onError: () => { },
  });

  const [placeOrder] = useMutation(PLACE_ORDER, {
    onCompleted: (res) => {
      const { placeOrder: o } = res;
      setOrderLoading(false);
      dispatch(addOrderId(o.orderId));
      dispatch(clearCart());
      if (o.paymentMethod === 'COD') {

        router.push({
          pathname: '/order-tracking',
          params: { id: o._id.toString() },
        });
      } else {
        router.replace({
          pathname: '/stripe-checkout',
          params: { id: o._id.toString(), orderId: o.orderId, amount: o.paidAmount },
        });
      }
    },
    onError: (err) => {
      setOrderLoading(false);
      Alert.alert('Order failed', err.message);
    },
  });

  // ─── Helpers ────────────────────────────────────────────────

  const onInitPaymentMethod = () => {
    if (!restaurantData || !restaurantData.restaurant) return;

    const _paymentMethods = paymentMethods.map((method) => {
      if (restaurantData.restaurant.stripeDetailsSubmitted && method.name === 'Stripe') {
        return { ...method, isDetailsSubmitted: true };
      }
      return method;
    });

    if (_paymentMethods.length == 1) {
      dispatch(setPaymentMethod(_paymentMethods[0].name as 'COD' | 'Stripe'));
    }

    setPaymentMethods(_paymentMethods);
  };

  const handleModeChange = (newMode: 'Delivery' | 'Pickup') => {
    dispatch(setOrderMode(newMode));
  };

  function taxCalculation() {
    const tax = restaurantData?.restaurant?.tax ? restaurantData?.restaurant.tax : 0;
    if (tax === 0) {
      return parseFloat(tax).toFixed(2);
    }
    const delivery = isPickup ? 0 : parseFloat(deliveryCharges.toString());
    const amount = calculatePrice(delivery, true);
    const taxAmount = ((parseFloat(amount) / 100) * parseFloat(tax)).toFixed(2);
    return parseFloat(taxAmount);
  }

  function calculatePrice(delivery = 0, withDiscount: any) {
    let itemTotal = 0;
    Object.values(items).forEach((cartItem) => {
      itemTotal += cartItem.unitPrice * cartItem.quantity;
    });
    if (withDiscount && checkout?.couponCode && checkout?.couponDiscount !== 0) {
      itemTotal = itemTotal - (checkout?.couponDiscount / 100) * itemTotal;
    }
    const deliveryAmount = delivery > 0 ? deliveryCharges : 0;
    return (itemTotal + deliveryAmount).toFixed(2);
  }

  /*  function calculateTotal() {
    let itemTotal = 0;
    Object.values(items).forEach((cartItem) => {
      itemTotal += cartItem.unitPrice * cartItem.quantity;
    });
    const discountAmount = checkout?.couponDiscount > 0 ? ((checkout?.couponDiscount || 0) / 100) * itemTotal : 0;
    const tipAmount = checkout?.tip;
    const total = itemTotal + tax + deliveryCharges - discountAmount + tipAmount;
    return total.toFixed(2);
  }
 */
  function calculateDistance(latS: any, lonS: any, latD: any, lonD: any) {
    var R = 6371; // km
    var dLat = toRad(latD - latS);
    var dLon = toRad(lonD - lonS);
    var lat1 = toRad(latS);
    var lat2 = toRad(latD);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function toRad(Value: any) {
    return (Value * Math.PI) / 180;
  }

  function calculateAmount(costType: any, deliveryRate: any, distance: any) {
    return costType === 'fixed' ? deliveryRate : Math.ceil(distance) * deliveryRate;
  }

  const handlePlaceOrder = () => {
    if (!auth.isAuthenticated) {
      router.push('/(food-delivery)/(profile)/login');
      return;
    }

    if (!currentRestaurantId || Object.keys(items).length === 0) {
      Alert.alert('Cart is empty');
      return;
    }
    setOrderLoading(true);



    const orderInput = Object.values(items).map((i) => ({
      food: i.productId,
      quantity: i.quantity,
      variation: i.variationId,
      addons: i.selectedAddonIds.map((a) => ({ _id: a, options: [] })),
    }));

    console.log(JSON.stringify(orderInput, null, 2))

    let address: any = {};
    if (isPickup) {
      address = {
        label: 'Current Location',
        deliveryAddress: 'Pickup',
        details: 'User will pick up the order',
        longitude: String(checkout?.shippingLongitude),
        latitude: String(checkout?.shippingLatitude),
      };
    } else {
      address = {
        label: checkout?.shippingAddress,
        deliveryAddress: checkout?.shippingAddress,
        details: checkout?.addressDetails,
        longitude: String(checkout?.shippingLongitude),
        latitude: String(checkout?.shippingLatitude),
      };
    }
    // console.log(JSON.stringify({
    //   restaurant: currentRestaurantId,
    //   orderInput,
    //   paymentMethod: checkout.paymentMethod.toUpperCase(),
    //   couponCode: checkout.couponCode || null,
    //   tipping: checkout.tip,
    //   taxationAmount: Number(taxCalculation()),
    //   address: address,
    //   orderDate: new Date().toISOString(),
    //   isPickedUp: isPickup,
    //   deliveryCharges: deliveryCharges,
    //   instructions: checkout.courierInstructions,
    // },null,2))

    placeOrder({
      variables: {
        restaurant: currentRestaurantId,
        orderInput,
        paymentMethod: checkout?.paymentMethod.toUpperCase(),
        couponCode: checkout?.couponCode || null,
        tipping: checkout?.tip,
        taxationAmount: Number(taxCalculation()),
        address: address,
        orderDate: new Date().toISOString(),
        isPickedUp: isPickup,
        deliveryCharges: deliveryCharges,
        instructions: checkout?.courierInstructions,
      },
    });
  };

  const onInfoPress = () => {
    router.push({
      pathname: "/restaurant-more-info",
      params: {
        info: JSON.stringify(restaurantData?.restaurant),
      }
    })
  }


  // Use Effect
  useEffect(() => {
    onInitPaymentMethod;
  }, [restaurantData]);

  return (
    loadingData
      ?
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
        <ActivityIndicator
          size={'large'}
        />
      </View>
      :
      <View className="flex-1 bg-background dark:bg-dark-background">
        {/* ── Top bar */}
        <CustomHeader
          title={restaurantData?.restaurant?.name || 'Checkout'}
          subtitle="Complete your order"
          showGoBack
          onGoBack={() => {
            router.back();
          }}
          rightIcons={[<CustomIcon key="info" icon={{ type: 'Feather', name: 'info', size: 22 }} />]}
        />

        {/* ── Scrollable content */}
        <ScrollView
          contentContainerStyle={{
            paddingTop: 0,
            paddingBottom: insets.bottom + 80, // leave room for button
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Map section */}
          <MapWithShadow
            sourceLocation={{
              latitude: Number(restaurantData?.restaurant?.location.coordinates[1]) || 0,
              longitude: Number(restaurantData?.restaurant?.location.coordinates[0]) || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            destinationLocation={{
              latitude: Number(checkout.shippingLatitude) || 0,
              longitude: Number(checkout.shippingLongitude) || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          />

          {/* ── Delivery / Pickup toggle overlapping the map */}
          <TypeToggle
            selected={mode}
            onChange={handleModeChange}
            restaurant={restaurantData?.restaurant}
          />

          {/* ── Form for chosen mode */}
          {mode === 'Delivery' ? (
            <DeliveryForm
              paymentMethods={paymentMethods}
              deliveryTime={restaurantData?.restaurant?.deliveryTime}
              deliveryCharges={deliveryCharges}
              tax={tax}
              validateCoupon={validateCoupon}
              validatingCoupon={loadingCoupon}
              source={source}
            />
          ) : (
            <PickupForm paymentMethods={paymentMethods} tax={tax} validateCoupon={validateCoupon} validatingCoupon={loadingCoupon} />
          )}
        </ScrollView>

        {/* ── Sticky bottom action */}
        <View
          // style={{ paddingBottom: insets.bottom }}
          className="absolute bottom-0 left-0 right-0 bg-background dark:bg-dark-card p-4 border-t border-gray-200 dark:border-gray-700"
        >
          {/* <TouchableOpacity
            disabled={orderLoading}
            onPress={handlePlaceOrder}
            className={`rounded-lg py-4 m-4 mb-2 items-center ${orderLoading ? 'opacity-50 bg-gray-400' : 'bg-primary'}`}
          >
            {orderLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                {checkout.paymentMethod === 'COD' ? (
                  <SlideToConfirmButton
                    onSlideComplete={handlePlaceOrder}
                    text="Slide to Place Order"
                    disabled={orderLoading}
                  />
                ) : (
                  <TouchableOpacity
                    disabled={orderLoading}
                    onPress={handlePlaceOrder}
                    className={`rounded-lg py-4 m-4 mb-2 items-center ${orderLoading ? 'opacity-50 bg-gray-400' : 'bg-primary'}`}
                  >
                    {orderLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <CustomText className="text-white text-lg">Pay with Stripe</CustomText>
                    )}
                  </TouchableOpacity>
                )}

              </>
            )}
          </TouchableOpacity> */}




          {checkout.paymentMethod === 'COD' ? (

            <View className={`rounded-lg py-4 m-4 mb-2 items-center ${orderLoading ? 'opacity-50 bg-gray-400' : 'bg-primary'}`}>

              <SlideToConfirmButton
                onSlideComplete={handlePlaceOrder}
                text="Slide to Place Order"
                disabled={orderLoading}
              />

            </View>
          ) : (

            <>

              <TouchableOpacity
                disabled={orderLoading}
                onPress={handlePlaceOrder}
                className={`rounded-lg py-4 m-4 mb-2 items-center ${orderLoading ? 'opacity-50 bg-gray-400' : 'bg-primary'}`}
              >
                {orderLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <CustomText className="text-white text-lg">Pay with Stripe</CustomText>
                )}
              </TouchableOpacity>

            </>
          )

          }








        </View>
      </View>
  );
}

export default CheckoutScreen;