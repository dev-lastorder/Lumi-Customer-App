// Componnets
import { CustomText } from '../CustomText';

export default function ScreenSubHeader({ title }: { title: string }) {
  return (
    <CustomText variant="heading3" fontWeight="semibold" fontSize='xl' className='p-2 m-0'>
      {title}
    </CustomText>
  );
}
