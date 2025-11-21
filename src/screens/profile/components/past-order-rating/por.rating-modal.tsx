
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText, InputWithLabel } from '@/components';
import { useThemeColor } from '@/hooks';
import CustomBottomSheetModal from '@/components/common/BottomModalSheet/CustomBottomSheetModal';

interface PORRatingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (comment: string) => void;
    tempComment: string;
    setTempComment: (comment: string) => void;
}

const PORRatingModal: React.FC<PORRatingModalProps> = ({ isVisible, onClose, onSave, tempComment, setTempComment }) => {
    const appTheme = useThemeColor();

    return (
        <CustomBottomSheetModal
            visible={isVisible}
            onClose={onClose}
            headerTitle="Add a comment"
        >
            <View className="p-6 pt-0">
                <View className="mb-4">
                    <View>
                        <InputWithLabel
                            style={{
                                color: appTheme.text,
                                minHeight: 220
                            }}
                            editable
                            as="textarea"
                            maxLength={200}

                            value={tempComment}
                            onChangeText={setTempComment}
                            placeholder="Type your comment here..."
                            placeholderTextColor={appTheme.textSecondary}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    className="h-12 rounded-xl justify-center items-center"
                    style={{ backgroundColor: appTheme.primary }}
                    onPress={() => onSave(tempComment)}
                >
                    <CustomText fontWeight="medium" fontSize="md" style={{ color: appTheme.buttonText }}>
                        Save
                    </CustomText>
                </TouchableOpacity>
            </View>
        </CustomBottomSheetModal>
    );
};

export default PORRatingModal;
