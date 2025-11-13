import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, FlatList } from 'react-native';
import { CustomIcon } from '@/components/common/Icon';
import { useAppSelector } from '@/redux';
import CustomBottomSheetModal from '../common/BottomModalSheet/CustomBottomSheetModal';

const HEADER_HEIGHT = 4;
const TITLE_FADE_OFFSET = 10;

export const countries = [
  { name: 'Afghanistan', flag: '🇦🇫' },
  { name: 'Albania', flag: '🇦🇱' },
  { name: 'Algeria', flag: '🇩🇿' },
  { name: 'Andorra', flag: '🇦🇩' },
  { name: 'Angola', flag: '🇦🇴' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Armenia', flag: '🇦🇲' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Azerbaijan', flag: '🇦🇿' },
  { name: 'Bahamas', flag: '🇧🇸' },
  { name: 'Bahrain', flag: '🇧🇭' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Belarus', flag: '🇧🇾' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Belize', flag: '🇧🇿' },
  { name: 'Benin', flag: '🇧🇯' },
  { name: 'Bhutan', flag: '🇧🇹' },
  { name: 'Bolivia', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { name: 'Botswana', flag: '🇧🇼' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Brunei', flag: '🇧🇳' },
  { name: 'Bulgaria', flag: '🇧🇬' },
  { name: 'Burkina Faso', flag: '🇧🇫' },
  { name: 'Burundi', flag: '🇧🇮' },
  { name: 'Cambodia', flag: '🇰🇭' },
  { name: 'Cameroon', flag: '🇨🇲' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Chad', flag: '🇹🇩' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Comoros', flag: '🇰🇲' },
  { name: 'Congo (Brazzaville)', flag: '🇨🇬' },
  { name: 'Congo (Kinshasa)', flag: '🇨🇩' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Cuba', flag: '🇨🇺' },
  { name: 'Cyprus', flag: '🇨🇾' },
  { name: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Djibouti', flag: '🇩🇯' },
  { name: 'Dominica', flag: '🇩🇲' },
  { name: 'Dominican Republic', flag: '🇩🇴' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'El Salvador', flag: '🇸🇻' },
  { name: 'Estonia', flag: '🇪🇪' },
  { name: 'Eswatini', flag: '🇸🇿' },
  { name: 'Ethiopia', flag: '🇪🇹' },
  { name: 'Fiji', flag: '🇫🇯' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Gabon', flag: '🇬🇦' },
  { name: 'Gambia', flag: '🇬🇲' },
  { name: 'Georgia', flag: '🇬🇪' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Guatemala', flag: '🇬🇹' },
  { name: 'Guinea', flag: '🇬🇳' },
  { name: 'Guyana', flag: '🇬🇾' },
  { name: 'Haiti', flag: '🇭🇹' },
  { name: 'Honduras', flag: '🇭🇳' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Iran', flag: '🇮🇷' },
  { name: 'Iraq', flag: '🇮🇶' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Israel', flag: '🇮🇱' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Jamaica', flag: '🇯🇲' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Jordan', flag: '🇯🇴' },
  { name: 'Kazakhstan', flag: '🇰🇿' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Kuwait', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', flag: '🇰🇬' },
  { name: 'Laos', flag: '🇱🇦' },
  { name: 'Latvia', flag: '🇱🇻' },
  { name: 'Lebanon', flag: '🇱🇧' },
  { name: 'Liberia', flag: '🇱🇷' },
  { name: 'Libya', flag: '🇱🇾' },
  { name: 'Lithuania', flag: '🇱🇹' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Madagascar', flag: '🇲🇬' },
  { name: 'Malawi', flag: '🇲🇼' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Maldives', flag: '🇲🇻' },
  { name: 'Mali', flag: '🇲🇱' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Mauritania', flag: '🇲🇷' },
  { name: 'Mauritius', flag: '🇲🇺' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Moldova', flag: '🇲🇩' },
  { name: 'Monaco', flag: '🇲🇨' },
  { name: 'Mongolia', flag: '🇲🇳' },
  { name: 'Montenegro', flag: '🇲🇪' },
  { name: 'Morocco', flag: '🇲🇦' },
  { name: 'Mozambique', flag: '🇲🇿' },
  { name: 'Myanmar', flag: '🇲🇲' },
  { name: 'Namibia', flag: '🇳🇦' },
  { name: 'Nepal', flag: '🇳🇵' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Nicaragua', flag: '🇳🇮' },
  { name: 'Niger', flag: '🇳🇪' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'North Korea', flag: '🇰🇵' },
  { name: 'North Macedonia', flag: '🇲🇰' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Oman', flag: '🇴🇲' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Panama', flag: '🇵🇦' },
  { name: 'Paraguay', flag: '🇵🇾' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Philippines', flag: '🇵🇭' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Qatar', flag: '🇶🇦' },
  { name: 'Romania', flag: '🇷🇴' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Senegal', flag: '🇸🇳' },
  { name: 'Serbia', flag: '🇷🇸' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Slovakia', flag: '🇸🇰' },
  { name: 'Slovenia', flag: '🇸🇮' },
  { name: 'Somalia', flag: '🇸🇴' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Sudan', flag: '🇸🇩' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Syria', flag: '🇸🇾' },
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'Tajikistan', flag: '🇹🇯' },
  { name: 'Tanzania', flag: '🇹🇿' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Tunisia', flag: '🇹🇳' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Turkmenistan', flag: '🇹🇲' },
  { name: 'Uganda', flag: '🇺🇬' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Uzbekistan', flag: '🇺🇿' },
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'Yemen', flag: '🇾🇪' },
  { name: 'Zambia', flag: '🇿🇲' },
  { name: 'Zimbabwe', flag: '🇿🇼' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: { name: string; flag: string }) => void;
  selectedCountry?: { name: string; flag: string } | null;
}

const ChooseCountryModal: React.FC<Props> = ({ visible, onClose, onSelect, selectedCountry }) => {
  const renderItem = ({ item }: { item: { name: string; flag: string } }) => {
    const isSelected = item.name === selectedCountry?.name;
    return (
      <TouchableOpacity onPress={() => onSelect(item)} className="flex-row items-center justify-between py-4 px-4 border-b border-border">
        <View className="flex-row items-center space-x-4">
          <Text className="text-xl">{item.flag}</Text>
          <Text className="text-base text-black dark:text-white font-medium">{item.name}</Text>
        </View>
        {isSelected && <CustomIcon icon={{ type: 'Feather', name: 'check', size: 20, color: '#AAC810' }} />}
      </TouchableOpacity>
    );
  };

  return (
    <CustomBottomSheetModal maxHeight={'80%'} animatedHeader={true} headerTitle="Choose country" visible={visible} onClose={onClose}>
      <Animated.FlatList data={countries} keyExtractor={(item) => item.name} renderItem={renderItem} showsVerticalScrollIndicator={false} />
    </CustomBottomSheetModal>
  );
};

export default ChooseCountryModal;
