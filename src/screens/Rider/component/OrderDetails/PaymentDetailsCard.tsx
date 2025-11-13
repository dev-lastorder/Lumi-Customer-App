import { CustomText } from '@/components';
import { Image, View } from 'react-native';

interface PaymentDetailsCardProps {
  method: string;
}

const PaymentDetailsCard = ({ details }: { details: PaymentDetailsCardProps }) => {
  const cashImage = require('../../../../assets/images/cash.png')
  return (
    <View className="py-4 gap-3">
      <CustomText lightColor="#71717A" darkColor="#71717A" fontSize="md">
        Payment
      </CustomText>

      <View className="flex-row items-center gap-3">
        <Image source={cashImage} className='w-6 h-6' resizeMode='contain' />
        <CustomText fontSize="md">{details.method}</CustomText>
      </View>
    </View>
  );
};

export default PaymentDetailsCard;
