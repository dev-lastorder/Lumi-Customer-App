import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText, InputWithLabel } from '@/components';
import { useThemeColor } from '@/hooks';
import CustomBottomSheetModal from '@/components/common/BottomModalSheet/CustomBottomSheetModal';

interface PORTipModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (tip: string) => void;
    tempTip: string;
    setTempTip: (tip: string) => void;
}

const PORTipModal: React.FC<PORTipModalProps> = ({ isVisible, onClose, onSave, tempTip, setTempTip }) => {
    const appTheme = useThemeColor();

    return (
        <CustomBottomSheetModal
            visible={isVisible}
            onClose={onClose}
            headerTitle="Set courier tip"
        >
            <View className="p-6 pt-0">
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity
                        className="px-4 py-2 rounded-xl bg-primary/10"
                        onPress={() => {
                            const currentTip = parseFloat(tempTip);
                            const newTip = Math.max(0, currentTip - 1);
                            setTempTip(newTip < 0 ? "0" : String(newTip));
                        }}
                    >
                        <CustomText className='pt-2' fontSize="xl" fontWeight='bold' style={{ color: appTheme.primary }}>-</CustomText>
                    </TouchableOpacity>
                    <CustomText fontSize="xl" style={{ color: appTheme.text }}>
                        {tempTip} €
                    </CustomText>
                    <TouchableOpacity
                        className="px-4 py-2 rounded-xl bg-primary/10"
                        onPress={() => setTempTip(String((parseFloat(tempTip) + 1)))}
                    >
                        <CustomText className='pt-2' fontSize="xl" fontWeight='bold' style={{ color: appTheme.primary }}>+</CustomText>
                    </TouchableOpacity>
                </View>
                <View className="mb-4">
                    <View className="">
                        <InputWithLabel
                            style={{
                                color: appTheme.text,
                                minHeight: 40,
                            }}
                            as="TextInput"
                            value={tempTip}
                            onChangeText={setTempTip}
                            keyboardType="numeric"
                            placeholder="Enter custom tip"
                            placeholderTextColor={appTheme.textSecondary}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    className="h-12 rounded-xl justify-center items-center"
                    style={{ backgroundColor: appTheme.primary }}
                    onPress={() => onSave(tempTip)}
                >
                    <CustomText fontWeight="medium" fontSize="md" style={{ color: appTheme.buttonText }}>
                        Save
                    </CustomText>
                </TouchableOpacity>
            </View>
        </CustomBottomSheetModal>
    );
};

export default PORTipModal;
