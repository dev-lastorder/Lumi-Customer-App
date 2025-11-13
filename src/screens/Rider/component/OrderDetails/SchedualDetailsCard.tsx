import { CustomIcon, CustomText } from '@/components';
import adjust from '@/utils/helpers/adjust';
import { View } from 'react-native';

interface SchedualDetailsCardProps {
  day: string;
  time: string;
}

const SchedualDetailsCard = ({ details }: { details: SchedualDetailsCardProps }) => {
  return (
    <View className="py-4 gap-3">
      <CustomText lightColor="#71717A" darkColor="#71717A" fontSize="md">
        Schedual for
      </CustomText>

      <View className="flex-row items-center gap-3">
        <CustomIcon icon={{ type: 'MaterialCommunityIcons', name: 'calendar-month-outline', size: adjust(25) }} />

        <CustomText fontSize="md">
          {details.day}. {details.time}
        </CustomText>
      </View>
    </View>
  );
};

export default SchedualDetailsCard;
