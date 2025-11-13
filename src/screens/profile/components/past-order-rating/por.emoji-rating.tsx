import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';

const EMOJIS = [
    { value: 1, emoji: '😡', label: 'Terrible' },
    { value: 2, emoji: '😞', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Meh' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '😍', label: 'Delightful' },
];

interface POREmojiRatingProps {
    onRate: (rating: number) => void;
    selectedRating: number;
    canEdit?: boolean;
}

const POREmojiRating: React.FC<POREmojiRatingProps> = ({ onRate, selectedRating, canEdit }) => {
    const appTheme = useThemeColor();

    return (
        <View className="flex-row justify-center mb-4">
            {EMOJIS?.map(e => (
                <TouchableOpacity
                    key={e.value}
                    className={`mx-2 items-center px-2 py-2 ${selectedRating === e.value ? ' bg-primary/30 rounded-xl' : ''}`}
                    onPress={() => { if (canEdit) { onRate(e.value) } else { alert("You can't edit the rating") } }}
                >
                    <CustomText fontSize="2xl" className='pt-6 leading-loose'>
                        {e.emoji}
                    </CustomText>
                    <CustomText fontSize="xs" className="mt-1" style={{ color: appTheme.textSecondary }}>
                        {e?.label}
                    </CustomText>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default POREmojiRating;
