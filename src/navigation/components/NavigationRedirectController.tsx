import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import { ZoneTypes } from '@/utils';

const ZONE_SELECTION_PATH = '/zone-selection';
const DISCOVERY_PATH = '/(food-delivery)/(discovery)/discovery';

export const NavigationRedirectController = () => {
  const router = useRouter();
  const pathname = usePathname();
  const type = useAppSelector((state) => state.locationPicker.type);
  const latitude = useAppSelector((state) => state.locationPicker.latitude);

  useEffect(() => {
 

    if (shouldRedirectToZone(type)) {
      if (pathname !== ZONE_SELECTION_PATH) {
        router.replace(ZONE_SELECTION_PATH);
      }
      return;
    }

    const isOnWrongPath =
      pathname === ZONE_SELECTION_PATH;

    if (isOnWrongPath) {
    console.log("Wrong path")
    }
  }, [type, pathname, router]);

  return null;
};

const shouldRedirectToZone = (zoneType?: ZoneTypes): boolean => {
  return !zoneType || !['zone', 'address', 'current'].includes(zoneType);
};
