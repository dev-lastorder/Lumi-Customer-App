// Componnets
import { CustomText } from '../CustomText';

import { StyleProp, TextStyle } from 'react-native';

export default function ScreenHeader({
  title,
  titleStyle,
  rest,
}: { title: string; titleStyle?: StyleProp<TextStyle>; [key: string]: any }) {
  return (
    <CustomText variant="heading3" fontWeight="bold" fontSize='2xl' className='p-2 m-0' style={titleStyle} {...rest} >
      {title}
    </CustomText>
  );
}
