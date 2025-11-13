import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import CustomBottomSheetModal from '@/components/common/BottomModalSheet/CustomBottomSheetModal';
import { CustomText } from '@/components';
import { Ionicons } from '@expo/vector-icons';

interface ReasonPickerModalProps {
  visible: boolean;
  reasons: string[];
  selectedReason: string;
  onSelect: (reason: string) => void;
  onClose: () => void;
  appTheme: any;
}

const ReasonPickerModal: React.FC<ReasonPickerModalProps> = ({
  visible,
  reasons,
  selectedReason,
  onSelect,
  onClose,
  appTheme,
}) => (
  <CustomBottomSheetModal
    visible={visible}
    onClose={onClose}
    headerTitle="Select a reason"
    isShowHeader={false}
    containerStyle={{ backgroundColor: appTheme.card }}
  >
    <CustomText
      variant='heading3'
      fontSize="lg"
      fontWeight='medium'
      className="mb-6 text-xl font-extrabold text-center"
      style={{ color: appTheme.text, letterSpacing: 0.2 }}
    >
      Select a reason
    </CustomText>
    <FlatList
      data={reasons}
      keyExtractor={(item) => item}
      contentContainerStyle={{
        paddingHorizontal: 16
      }}
      renderItem={({ item }) => {
        const isSelected = item === selectedReason;
        return (
          <TouchableOpacity
            onPress={() => {
              onSelect(item);
              onClose();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 16,
              marginVertical: 6,
              borderRadius: 12,
              backgroundColor: isSelected ? appTheme.primary + '22' : appTheme.background,
              shadowColor: isSelected ? appTheme.primary : '#000',
              shadowOpacity: isSelected ? 0.15 : 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              borderWidth: isSelected ? 1.5 : 1,
              borderColor: isSelected ? appTheme.primary : appTheme.border,
            }}
          >
            <CustomText
              fontSize='sm'
              style={{
                color: isSelected ? appTheme.primary : appTheme.text,

                fontWeight: isSelected ? 'bold' : '500',
                flex: 1,
              }}
            >
              {item}
            </CustomText>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={22} color={appTheme.primary} style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        );
      }}
      ListFooterComponent={<View style={{ height: 8 }} />}
      showsVerticalScrollIndicator={false}
    />
    <TouchableOpacity
      onPress={onClose}
      style={{
        marginTop: 18,
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: appTheme.primary,
        borderRadius: 10,
        paddingVertical: 12,
        marginHorizontal: 18,
        shadowColor: appTheme.primary,
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
      activeOpacity={0.85}
    >
      <CustomText style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
        Cancel
      </CustomText>
    </TouchableOpacity>
  </CustomBottomSheetModal>
);

export default ReasonPickerModal;