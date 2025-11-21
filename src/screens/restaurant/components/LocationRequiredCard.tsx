import { View, Text, TouchableOpacity } from 'react-native';
import { CustomIcon, CustomText } from '@/components';
import { useLocationPicker } from '@/hooks/useLocationPicker';

const LocationRequiredCard = () => {
    const { toggleLocationModal } = useLocationPicker();


    return (
        <View className="bg-bgLight dark:bg-dark-bgLight mx-4 mt-8 rounded-2xl shadow-lg p-5 items-center flex-col gap-4 border border-border dark:border-dark-border/30">
            <View className="bg-primary/50 p-4 rounded-full">
                <CustomIcon
                    icon={{ type: 'FontAwesome', name: 'map-pin', size: 36 }}
                />
            </View>
            <CustomText
                variant='subheading'
                fontSize='md'
                fontWeight='medium'
            >
                Location Needed
            </CustomText>
            <CustomText
                variant='caption'
                className='text-center'
            >
                Please select your location to view nearby restaurants and stores.
            </CustomText>
            <TouchableOpacity
                onPress={() => toggleLocationModal(true)}
                className="bg-primary/50 px-6 py-3 rounded-full mt-2 cursor-pointer"
            >
                <CustomText
                    variant='label'
                    fontWeight='medium'
                    fontSize='sm'
                >
                    Select Location
                </CustomText>
            </TouchableOpacity>
        </View>
    );
};

export default LocationRequiredCard;
