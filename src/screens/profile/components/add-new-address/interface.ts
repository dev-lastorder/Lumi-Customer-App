export interface AddNewAddressContentProps {
  selectedZone: string | null;
  location: string | null;
  setZoneModalVisible: (visible: boolean) => void;
  setAddressModalVisible: (visible: boolean) => void;
}

export interface AddressSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
  onSelectLatLong?: (data: { latitude: string; longitude: string }) => void; // optional for custom address selection
  zoneCoordinates?: number[][]; // coordinates of selected zone polygon
}

export interface LocationPermissionModalProps {
  visible: boolean;
  onAccept: (data: { location: string; city: string; country: string; latitude: string; longitude: string }) => void;
  onReject: () => void;
}

export interface Results {
  description: string;
  latitude: number;
  longitude: number;
}
