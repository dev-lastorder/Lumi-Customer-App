interface Address {
  _id: string;
  label: string;
  deliveryAddress: string;
  details: string;
  zone: {
    _id: string;
    title: string;
  };
  location: {
    coordinates: [string, string]; // [latitude, longitude] as strings
  };
}

export interface AddressesListCardProps {
  address: Address;
}
