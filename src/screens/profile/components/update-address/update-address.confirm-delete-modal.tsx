// components/modals/ConfirmDeleteAddressModal.tsx

// ─── Imports ─────────────────────────────────────────────
import React from 'react';
import { TouchableOpacity } from 'react-native';

// 🔧 Custom Components
import { CustomAnimatedModal } from '@/components';
import { CustomText } from '@/components'; // ✅ CustomText added

// 🧠 Types
import { ConfirmDeleteAddressModalProps } from './interface';

// ─── Component: ConfirmDeleteAddressModal ────────────────
const ConfirmDeleteAddressModal: React.FC<ConfirmDeleteAddressModalProps> = ({ visible, loading = false, onConfirm, onCancel }) => {
  return (
    <CustomAnimatedModal
      containerClassName="w-9/12 rounded-2xl bg-white dark:bg-black p-6 items-center"
      visible={visible}
      onClose={onCancel}
      animationType="spring"
    >
      <>
        {/* ── Title Text ─────────────────────── */}
        <CustomText variant="heading3" fontWeight="semibold" className="text-center mb-2 text-black dark:text-white">
          Are you sure?
        </CustomText>

        {/* ── Description Text ───────────────── */}
        <CustomText variant="caption" className="text-center mb-5 text-gray-500">
          This action will permanently delete this address.
        </CustomText>

        {/* ── Delete Button ──────────────────── */}
        <TouchableOpacity disabled={loading} className={`w-full bg-primary py-3 rounded-lg mb-3 ${loading ? 'opacity-50' : ''}`} onPress={onConfirm}>
          <CustomText fontSize="sm" variant="button" style={{ color: 'white' }} className="text-white text-center font-semibold">
            {loading ? 'Deleting Address ...' : 'Delete Address'}
          </CustomText>
        </TouchableOpacity>

        {/* ── Cancel Button ──────────────────── */}
        <TouchableOpacity disabled={loading} className="w-full bg-gray-100 py-3 rounded-lg" onPress={onCancel}>
          <CustomText variant="button" fontSize="sm" darkColor="black" className="text-gray-800 text-center font-semibold">
            Cancel
          </CustomText>
        </TouchableOpacity>
      </>
    </CustomAnimatedModal>
  );
};

export default ConfirmDeleteAddressModal;
