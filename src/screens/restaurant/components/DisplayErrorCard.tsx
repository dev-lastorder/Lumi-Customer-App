import { View, TouchableOpacity } from 'react-native';
import { CustomIcon, CustomText } from '@/components';

type DisplayErrorCardProps = {
    message: string;
    onRetry?: () => void;
};

const DisplayErrorCard = ({ message, onRetry }: DisplayErrorCardProps) => (
    <View className="bg-red-50 dark:bg-red-900 mx-4 mt-8 rounded-2xl shadow-lg p-5 items-center flex-col gap-4 border border-red-300 dark:border-red-700">
        <View className="bg-red-200 dark:bg-red-700 p-4 rounded-full">
            <CustomIcon icon={{ type: 'MaterialIcons', name: 'error-outline', size: 36, color: '#ef4444' }} />
        </View>
        <CustomText variant="subheading" fontSize="md" fontWeight="medium" className="text-red-600 dark:text-red-300">
            Oops! Something went wrong
        </CustomText>
        <CustomText variant="caption" className="text-center text-red-500 dark:text-red-200">
            {message}
        </CustomText>
        {onRetry && (
            <TouchableOpacity onPress={onRetry} className="bg-red-500 px-6 py-3 rounded-full mt-2">
                <CustomText variant="label" fontWeight="medium" fontSize="sm" className="text-white">
                    Retry
                </CustomText>
            </TouchableOpacity>
        )}
    </View>
);

export default DisplayErrorCard;