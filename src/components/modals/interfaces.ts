export interface Zone {
  _id: string;
  title: string;
  location: { coordinates: string[] };

}

export interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (zone: Zone) => void;
  selectedZoneId: string | null;
  zones: Zone[];
  loading?: boolean;
  error?: string | null;
}