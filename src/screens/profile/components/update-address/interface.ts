export interface ConfirmDeleteAddressModalProps {
  visible: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface UpdateAddressContentProps {
  setZoneModalVisible: (visible: boolean) => void;
  setAddressModalVisible: (visible: boolean) => void;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
  onUpdateZone: (zoneId: string, zoneTitle: string) => void;
  onUpdateLocation: (location: string) => void;
  onUpdateLocationType: (locationType: string) => void;
  onUpdateOtherDetails: (details: string) => void;
}

export interface UpdateAddressHeaderProps {
  setDeleteModalVisible: (value: boolean) => void;
}
