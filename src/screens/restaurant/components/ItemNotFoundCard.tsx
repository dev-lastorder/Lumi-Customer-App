import { View } from 'react-native';
import { CustomIcon, CustomText } from '@/components';
import { useThemeColor } from '@/hooks';

type ItemNotFoundCardProps = {
    message?: string;
};

const ItemNotFoundCard = ({ message = "No items found. Please try a different search or check back later." }: ItemNotFoundCardProps) => {
    const { primary } = useThemeColor();

    return (
        <View className="bg-bgLight dark:bg-dark-bgLight mx-4 mt-8 rounded-2xl shadow-lg p-5 items-center flex-col gap-4 border border-border dark:border-dark-border/30">
            <View className="bg-primary/20 p-4 rounded-full">
                <CustomIcon icon={{ type: 'Feather', name: 'search', size: 36, color: primary }} />
            </View>
            <CustomText variant="subheading" fontSize="md" fontWeight="medium">
                Nothing Found
            </CustomText>
            <CustomText variant="caption" className="text-center">
                {message}
            </CustomText>
        </View>
    )
};

export default ItemNotFoundCard;