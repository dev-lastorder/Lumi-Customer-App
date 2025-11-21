import { useRestaurantFavourite } from '@/api';
import { useAppDispatch, useAppSelector } from '@/redux';
import type { Restaurant } from '@/utils/interfaces';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, type StyleProp, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { CustomIcon } from '../../common';
import { CustomText } from '@/components/common/CustomText';
import { getBaseVariationIdForItem, shadowStyle } from '@/utils';
import { createImageArray } from '@/utils/testing';
import Animated from 'react-native-reanimated';
import { CarouselImageItemProps } from './interface';
import { useScrollXTracker } from '@/hooks';
import { ImageCarousel } from './ImageCarousel';
import { BlurView } from 'expo-blur'
import adjust from '@/utils/helpers/adjust';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { openProductDetailModal } from '@/redux/slices/productModalSlice';
import { Product } from '@/utils/interfaces/product-detail';
import { useCartState, useRestaurantData } from '@/screens/restaurant/hooks';

interface RestaurantStoreCardProps {
  item: Restaurant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}


const FavouriteButton = ({ isFav, isLoading, onToggle }: { isFav: boolean; isLoading: boolean; onToggle: () => void }) => {
  if (isLoading) {
    return (
      <View className="bg-dark-card/50 p-2 rounded-full">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }

  return (
    <TouchableOpacity className=" flex items-center justify-center rounded-full bg-dark-icon-background p-2" style={{ width: adjust(36), height: adjust(36) }} onPress={onToggle} activeOpacity={0.7}>
      <CustomIcon
        icon={{
          name: isFav ? 'heart-fill' : 'heart',
          type: 'Octicons',
          size: 22,
        }}
        className={isFav ? 'text-primary' : 'text-dark-text-secondary'}
        isDefaultColor={false}
      />
    </TouchableOpacity>
  );
};

const DeliveryTimeBadge = ({ deliveryTime }: { deliveryTime: string }) => (
  <View className="bg-icon-background dark:bg-dark-icon-background rounded-lg px-2 py-1" style={{ minWidth: adjust(52) }}>
    <CustomText
      fontSize="xs"
      fontFamily="Inter"
      fontWeight="semibold"
      className="text-primary dark:text-dark-primary text-center leading-4"
      isDefaultColor={false}
    >
      {deliveryTime}
    </CustomText>
    <CustomText
      fontFamily="Inter"
      fontSize="xs"
      fontWeight="light"
      className="text-primary dark:text-dark-primary text-center leading-4"
      isDefaultColor={false}
    >
      min
    </CustomText>
  </View>
);

const RestaurantBadge = ({ badge }: { badge?: string }) => {
  if (!badge) return null;

  return (
    <View className="bg-primary dark:bg-dark-primary rounded px-2 py-0.5 ml-2">
      <CustomText fontSize="xs" fontWeight="bold" className="text-dark-text" isDefaultColor={false}>
        {badge}
      </CustomText>
    </View>
  );
};

const HeaderSection = ({ name, subTitle = '', badge }: { name: string; subTitle?: string; badge?: string }) => (
  <View className="flex-col gap-y-2">
    <View className="flex-row items-center">
      <CustomText variant="body" fontFamily="Inter" fontWeight="bold" numberOfLines={1}>
        {name}
      </CustomText>
      <RestaurantBadge badge={badge} />
    </View>
    {subTitle && (
      <CustomText
        fontSize="sm"
        fontFamily="Inter"
        className="text-text-secondary dark:text-dark-text-secondary"
        numberOfLines={2}
        isDefaultColor={false}
      >
        {subTitle}
      </CustomText>
    )}
  </View>
);

const PriceRangeIndicator = ({ priceRange }: { priceRange: number }) => {
  const symbol = useAppSelector((state) => state.configuration?.configuration?.currencySymbol);
  const getPriceSymbols = (range: number) => {
    const symbols = [symbol, symbol, symbol, symbol];
    return symbols.map((symbol, index) => (
      <CustomText
        key={index}
        fontSize="sm"
        fontWeight="medium"
        className={index < range ? 'text-text dark:text-dark-text/80 ' : 'text-text-secondary dark:text-dark-text-secondary/80'}
        isDefaultColor={false}
      >
        {symbol}
      </CustomText>
    ));
  };

  return <View className="flex-row items-center">{getPriceSymbols(priceRange)}</View>;
};

const InfoItem = ({ iconName, iconType, text, priceRange }: { iconName: string; iconType: any; text?: string; priceRange?: number }) => (
  <View className="flex-row items-center gap-x-2">
    <CustomIcon
      icon={{
        name: iconName,
        type: iconType,
        size: 16,
      }}
      className="text-text-secondary dark:text-dark-text-secondary"
    />
    {text && (
      <CustomText fontSize="xs" fontWeight="medium" className="text-text-secondary dark:text-dark-text-secondary" isDefaultColor={false}>
        {text}
      </CustomText>
    )}
    {priceRange && <PriceRangeIndicator priceRange={priceRange} />}
  </View>
);

const FooterSection = ({
  minimumOrder,
  rating,
  currencySymbol,
  priceRange = 4,
}: {
  minimumOrder: number;
  rating: number;
  currencySymbol: string;
  priceRange?: number;
}) => (
  <View className="">
    <InfoItem iconName="bicycle" iconType="MaterialCommunityIcons" text={`${currencySymbol} ${minimumOrder}`} />
    <View className="flex-row items-center gap-x-4">
      <InfoItem iconName="emoticon-happy-outline" iconType="MaterialCommunityIcons" text={rating.toFixed(1)} />
      <InfoItem iconName="dollar" iconType="FontAwesome" priceRange={priceRange} />
    </View>
  </View>
);

const RestaurantStoreCard = ({ item, onPress = () => '', style, showFavIcon = true, ...rest }: RestaurantStoreCardProps) => {
  const { onToggleFavourite, isFavourting } = useRestaurantFavourite();
  const currencySymbol = useAppSelector((state) => state.configuration.configuration.currencySymbol);
  const user = useAppSelector((state) => state.auth.user);
  // Track which image is currently visible (for scroll position)
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();

  // Custom Hooks for data, cart, and layout
  const { itemQuantities, defaultAddonIds } = useCartState(item?._id, item?.categories);


  console.log(item?._id, item?.categories, 'itemQuantities, defaultAddonIds');

  const isFav = useMemo(() => {
    return user?.favourite?.includes(item._id) ?? false;
  }, [item._id, user?.favourite]);

  const hasSubtitle = item.subTitle && item.subTitle.trim().length > 0;
  const deliveryTime = `${item.deliveryTime || 25}-${(item.deliveryTime || 25) + 10}`;
  const rating = item.reviewAverage || 8.6;

  // Get up to 3 food images from the first category
  const foodImages = item.categories && item.categories.length > 0
    ? item.categories
      .flatMap(cat => (cat.foods || []).map(food => ({
        uri: food.image,
        food,
        cId: cat._id,
      })))
      .slice(0, 3)
    : [];

  // Build the images array: restaurant image first, then food images
  const images = [
    { uri: item.image, type: 'restaurant', foodId: item?._id, categoryId: "", food: null },
    ...foodImages.map(f => ({ uri: f.uri, type: 'food', food: f.food, foodId: f.food?._id, categoryId: f?.cId })),
  ];

  // If no categories or no foods, fallback to only restaurant image
  const imagesToShow = images.length > 1 ? images : [{ uri: item.image, type: 'restaurant' }, { uri: item.image, type: 'restaurant' }, { uri: item.image, type: 'restaurant' }];


  // Handler for image press
  const handleImagePress = () => {
    if (currentIndex === 0) {
      onPress?.();
    } else {
      onPress?.();
      const currentImage = images[currentIndex];
      if (currentImage?.food) {
        // Map food to Product interface
        console.log("addons of prodcut", JSON.stringify(item.options, null, 2))
        const food = currentImage.food;
        const product: Product = {
          id: food._id,
          title: food.title,
          description: food.description,
          image: food.image,
          price: food.price,
          currency: food.currency,
          isActive: food.isActive,
          isOutOfStock: food.isOutOfStock,
          restaurantId: food.restaurantId,
          restaurantName: food.restaurantName,
          variations: food.variations?.map((v: any) => {
            // Build addons array only if there are any
            const mappedAddons = (v.addons || [])
              .map((addonId: string) => {
                const addon = item.addons?.find((a: any) => a._id === addonId);
                if (!addon) return null;
                // Build options array only if there are any
                const mappedOptions = (addon.options || [])
                  .map((optionId: string) => {
                    const option = item.options?.find((o: any) => o._id === optionId);
                    return option
                      ? {
                        id: option._id,
                        title: option.title,
                        price: option.price,
                        description: option.description,
                        isOutOfStock: option.isOutOfStock,
                      }
                      : null;
                  })
                  .filter(Boolean);

                return {
                  id: addon._id,
                  title: addon.title,
                  price: mappedOptions.reduce((sum, opt) => sum + (opt?.price || 0), addon.price || 0),
                  description: addon.description,
                  isOutOfStock: addon.isOutOfStock,
                  quantityMaximum: addon.quantityMaximum,
                  quantityMinimum: addon.quantityMinimum,
                  ...(mappedOptions.length > 0 && { options: mappedOptions }),
                };
              })
              .filter(Boolean);

            return {
              id: v._id,
              title: v.title,
              price: v.price,
              ...(mappedAddons.length > 0 && { addons: mappedAddons }),
            };
          }) || [],
        };
        const quantityOfBaseConfigInCart = itemQuantities[food._id] || 0;
        const isEditing = quantityOfBaseConfigInCart > 0;
        const baseVariationId = getBaseVariationIdForItem(product);


        // console.log('OnClickProductDetailModal', JSON.stringify({
        //   product,
        //   initialQuantity: isEditing ? quantityOfBaseConfigInCart : 1,
        //   initialVariationId: isEditing ? baseVariationId : product?.variations?.[0]?.id,
        //   initialAddonIds: isEditing ? defaultAddonIds : [],
        //   actionType: isEditing ? 'edit' : 'add',
        // }, null, 2));


        setTimeout(() => {
          dispatch(openProductDetailModal({
            product,
            initialQuantity: isEditing ? quantityOfBaseConfigInCart : 1,
            initialVariationId: isEditing ? baseVariationId : product?.variations?.[0]?.id,
            initialAddonIds: isEditing ? defaultAddonIds : [],
            actionType: isEditing ? 'edit' : 'add',
          }));
        }, 400);
      }
    }
  };


  return (
    <TouchableOpacity
      className="bg-card dark:bg-dark-card rounded-lg overflow-hidden"
      style={[shadowStyle.card, style]}
      onPress={handleImagePress}
      activeOpacity={0.95}
      {...rest}
    >
      <View className="relative">
        {/* TODO: GET THE DYNAMIC MULTIPLE IMAGES WITH ID'S OF THE FOOD */}
        <View className="overflow-hidden" pointerEvents="box-none">
          <ImageCarousel onIndexChange={setCurrentIndex} images={imagesToShow.map((img, idx) => ({
            imageUri: img.uri,
            id: idx,
          }))} />
        </View>
        {
          item.deliveryOptions && (
            (() => {
              const { pickup, delivery } = item.deliveryOptions || {};
              const showPickupOnly = pickup && !delivery;
              const showDeliveryOnly = delivery && !pickup;

              if (!showPickupOnly && !showDeliveryOnly) return null;

              return (
                <View className="absolute top-3 left-3 z-10">
                  <BlurView
                    intensity={40}
                    tint="light"
                    className="px-3 py-1 rounded-md flex-row items-center gap-2"

                  >
                    {
                      showPickupOnly
                        ?
                        <CustomIcon
                          icon={{
                            name: 'person-running',
                            type: 'FontAwesome6',
                            size: 22,
                          }}
                          isDefaultColor={true}
                        />
                        :
                        <CustomIcon
                          icon={{
                            name: 'delivery-dining',
                            type: 'MaterialIcons',
                            size: 22,
                          }}
                          isDefaultColor={true}
                        />
                    }

                    <Text className="text-sm font-medium text-white">
                      {showPickupOnly ? 'Pickup Only' : 'Delivery Only'}
                    </Text>
                  </BlurView>
                </View>
              );
            })()
          )
        }

        {
          (showFavIcon && user.id) && (
            <View className="absolute top-4 right-4 z-10">
              <FavouriteButton
                isFav={isFav}
                isLoading={isFavourting}
                onToggle={() => onToggleFavourite(item._id.toString())}
              />
            </View>
          )
        }
        <View className="flex-row px-3 pt-3 pb-4 justify-between">
          <View className="gap-2">
            <HeaderSection name={item.name} subTitle={hasSubtitle ? item.subTitle : undefined} />
            <FooterSection minimumOrder={item.minimumOrder || 175} rating={rating} currencySymbol="KZT" priceRange={4} />
          </View>
          <View>
            <DeliveryTimeBadge deliveryTime={deliveryTime} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantStoreCard;
