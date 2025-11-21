import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';

export default function PastOrderActions({ appTheme, handleOrderAgain, handleRateTheOrder, isShowRateAndTipBtn }: { appTheme: any, handleOrderAgain: () => void, handleRateTheOrder: () => void, isShowRateAndTipBtn: boolean }) {
    return (
        <>
            {!isShowRateAndTipBtn && <> <TouchableOpacity onPress={handleRateTheOrder} className="rounded-lg mb-2" style={{ backgroundColor: appTheme.primary + '11' }}>
                <CustomText fontWeight="medium" fontSize="sm" className="text-center py-3" style={{ color: appTheme.primary }}>
                    Add courier tip
                </CustomText>
            </TouchableOpacity>
                <TouchableOpacity onPress={handleRateTheOrder} className="rounded-lg mb-2" style={{ backgroundColor: appTheme.primary + '11' }}>
                    <CustomText fontWeight="medium" fontSize="sm" className="text-center py-3" style={{ color: appTheme.primary }}>
                        Rate the order
                    </CustomText>
                </TouchableOpacity></>}
            <TouchableOpacity onPress={handleOrderAgain} className="rounded-lg mb-6" style={{ backgroundColor: appTheme.primary }}>
                <CustomText fontWeight="medium" fontSize="sm" className="text-center py-3" style={{ color: '#fff' }}>
                    Order again
                </CustomText>
            </TouchableOpacity>
        </>
    );
}