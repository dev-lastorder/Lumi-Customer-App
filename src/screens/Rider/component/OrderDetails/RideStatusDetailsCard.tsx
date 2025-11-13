import { CustomText } from '@/components';
import { View } from 'react-native';

interface RideStatusDetailsCardProps {
  status: string;
}

const RideStatusDetailsCard = ({ details }: { details: RideStatusDetailsCardProps }) => {
  const bgColor = () => {
    if (details.status === 'Scheduled') {
      return '#FEFCE8';
    } else if (details.status === 'Completed') {
      return '#F0FDF4';
    } else {
      return '#FEF2F2';
    }
  };
  const textColor = () => {
    if (details.status == 'Scheduled' || details.status == 'ASSIGNED') {
      return '#A16207';
    } else if (details.status == 'Completed') {
      return '#047857';
    } else {
      return '#DC2626';
    }
  };
  return (
    <View className="py-4 gap-3">
      <CustomText lightColor="#71717A" darkColor="#71717A" fontSize="md">
        Ride status
      </CustomText>

      <View className="px-3 py-2 rounded-xl self-start" style={{ backgroundColor: bgColor() }}>
        <CustomText fontSize="sm" fontWeight="semibold" lightColor={textColor()} darkColor={textColor()}>
          {details.status}
        </CustomText>
      </View>
    </View>
  );
};

export default RideStatusDetailsCard;
