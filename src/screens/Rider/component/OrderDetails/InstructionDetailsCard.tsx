import { CustomIcon, CustomText } from '@/components';
import adjust from '@/utils/helpers/adjust';
import { View } from 'react-native';

const InstructionDetailsCard = () => {
  return (
    <View className="py-4 gap-4">
      <CustomText fontSize="lg" fontWeight="semibold">
        Things to keep in mind
      </CustomText>

      <View className="flex-row items-start gap-3 w-96">
        <CustomIcon icon={{ type: 'FontAwesome', name: 'hourglass-o', size: adjust(22) }} />
        <View className="-mt-1 px-1">
          <CustomText fontSize="md" fontWeight="semibold">
            Wait time
          </CustomText>
          <CustomText fontSize="md" darkColor="#71717A" lightColor="#71717A">
            5 minutes of wait time included to meet your ride.
          </CustomText>
        </View>
      </View>

      <View className="flex-row items-start gap-3 w-96">
        <CustomIcon icon={{ type: 'Feather', name: 'shield', size: adjust(22) }} />
        <View className="-mt-1 px-1">
          <CustomText fontSize="md" fontWeight="semibold">
            Cancellation policy
          </CustomText>
          <CustomText fontSize="md" darkColor="#71717A" lightColor="#71717A">
            Cancel for free up to 60 minutes before your reservation.
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default InstructionDetailsCard;
