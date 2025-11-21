// ─────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────
import { View, Image, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CustomText } from '@/components';
import { Restaurant } from '@/utils';
import { useAppSelector } from '@/redux';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// ─────────────────────────────────────────────
// 🧩 Component: DeliveryInformation
// ─────────────────────────────────────────────
const DeliveryInformation = () => {
  const { info } = useLocalSearchParams();
  const { name, minimumOrder, deliveryTime, location } = !!info ? (JSON.parse(info as string) as unknown as Restaurant) : {};

  // Redux
  const configuration = useAppSelector((state) => state.configuration.configuration);

  return (
    <View>
      {/* ── Title */}
      <CustomText variant="subheading" fontWeight="semibold" fontSize="lg" className="mb-2 text-black dark:text-white ">
        Delivery information
      </CustomText>

      {/* ── Map Placeholder Image
      <Image source={{ uri: 'https://i.ibb.co/GJ8xL1p/map-placeholder.png' }} className="w-full h-48 rounded-lg" resizeMode="cover" /> */}
      <View className="h-40">
        <MapView
          style={{ flex: 1, backgroundColor: 'red' }}
          zoomEnabled={true}
          zoomControlEnabled={true}
          zoomTapEnabled={true}
          initialRegion={{
            latitude: parseFloat(location?.coordinates?.[1].toString() ?? ''),
            latitudeDelta: LATITUDE_DELTA,
            longitude: parseFloat(location?.coordinates?.[0]?.toString() ?? ''),
            longitudeDelta: LONGITUDE_DELTA,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            title={name}
            coordinate={{
              latitude: parseFloat(location?.coordinates?.[1].toString() ?? ''),
              longitude: parseFloat(location?.coordinates?.[0]?.toString() ?? ''),
            }}
          ></Marker>
        </MapView>
      </View>

      {/* ── Info Rows */}
      <View className="mt-4 space-y-2">
        {/* <InfoRow label="Restaurant delivery area" value="Show map" isLink /> */}
        <InfoRow label="Delivery cost" value={`${configuration?.currencySymbol}${configuration?.deliveryRate?.toString()}`} />
        <InfoRow label="Minimum Order" value={`${configuration?.currencySymbol}${minimumOrder?.toString()}`} />
        <InfoRow label="Estimated delivery time" value={`${deliveryTime?.toString()} min`} />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────
// 🧩 Component: InfoRow
// ─────────────────────────────────────────────
const InfoRow = ({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) => (
  <View className="flex-row justify-between py-2">
    <CustomText className="text-base text-text dark:text-dark-text">{label}</CustomText>
    <CustomText lightColor={isLink ? '#AAC810' : '#212121'} darkColor={isLink ? '#AAC810' : '#F5F5F5'}>
      {value}
    </CustomText>
  </View>
);

export default DeliveryInformation;
