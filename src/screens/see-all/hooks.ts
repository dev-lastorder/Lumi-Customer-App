import { DETAILS_ROUTE_BASED_ON_SHOP_TYPE } from "@/utils";
import { getValueOrDefault } from "@/utils/methods";
import { RelativePathString, useRouter } from "expo-router";

export const useNavigation = () => {
  const router = useRouter();
  const handleStoreCardPress = (id: string, shopType: string) => {
    router.push({
      pathname: getValueOrDefault(DETAILS_ROUTE_BASED_ON_SHOP_TYPE, shopType.toLowerCase(), '/restaurant-details') as RelativePathString,
      params: { id },
    });
  };
  return { handleStoreCardPress };
};