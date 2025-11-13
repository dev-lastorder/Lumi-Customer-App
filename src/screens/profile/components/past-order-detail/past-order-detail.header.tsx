import React from 'react';
import { CustomText } from '@/components';
import formatDate from '@/utils/helpers/formatDate';

export default function PastOrderHeader({ deliveredAt, restaurant, appTheme }: { deliveredAt: string, restaurant: string, appTheme: any }) {
    return (
        <>
            <CustomText fontSize="sm" className="mb-1" style={{ color: appTheme.textSecondary }}>
                {formatDate(deliveredAt)}
            </CustomText>
            <CustomText fontWeight="bold" fontSize="xl" className="mb-5" style={{ color: appTheme.text }}>
                {restaurant}
            </CustomText>
        </>
    );
}