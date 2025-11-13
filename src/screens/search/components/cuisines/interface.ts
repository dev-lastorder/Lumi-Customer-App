import { ICuisinesData } from '@/api';

export interface ICuisinesSectionProps {
  data: ICuisinesData[];
  loading: boolean;
  error: boolean;
  refetch: () => void;
  setSearch: (text: string) => void | undefined;
  handleOnChange: (text: string) => void | undefined;
}
