import { View, ActivityIndicator } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';

type LoadingCardProps = {
    message?: string;
};

const LoadingCard = ({ message = "Loading, please wait..." }: LoadingCardProps) => {
    const { primary } = useThemeColor();

    return (
        <View className="bg-bgLight dark:bg-dark-bgLight mx-4 mt-8 rounded-2xl shadow-lg p-5 items-center flex-col gap-4 border border-border dark:border-dark-border/30">
            <View className="bg-primary/30 p-4 rounded-full">
                <ActivityIndicator
                    size={16}
                    color={primary}
                />
            </View>
            <CustomText variant="subheading" fontSize="sm" fontWeight="medium">
                {message}
            </CustomText>
        </View>
    );
}

export default LoadingCard;