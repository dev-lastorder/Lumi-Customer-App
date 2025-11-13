interface Option {
  label: string;
  icon: any;
  color?: string;
}

export interface AddressTypeSelectorProps {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
}

export interface LocationTypeSelectorProps {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
}
