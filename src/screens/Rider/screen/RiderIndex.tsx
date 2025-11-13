import { View, Text, TouchableOpacity } from 'react-native'
import adjust from '@/utils/helpers/adjust';
import { router, useNavigation } from 'expo-router';
import { CustomText } from '@/components';

const RiderIndex = () => {

    return (
        <View style={{ paddingHorizontal: adjust(16) }}>
            <TouchableOpacity onPress={() => {

                router.push('/customer-ride');;
            }}>
                <CustomText lightColor='black' darkColor='white'>Let's Start Ride</CustomText>
            </TouchableOpacity>
        </View>
    )
}

export default RiderIndex;