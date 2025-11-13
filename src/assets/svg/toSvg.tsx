import { useThemeColor } from '@/hooks';
import Svg, { Path, SvgProps, Circle } from 'react-native-svg';

const ToSvg = (props: SvgProps) => {
  const appTheme = useThemeColor();
  return (
    <Svg
      width={600}
      height={600}
      viewBox="0 0 512 512"
      fill="none"
      {...props}
      color={appTheme.primary}
    >
      <Circle cx="8" cy="8" r="6" fill="white" stroke="#F87171" strokeWidth="4" />
    </Svg>
  );
};

export default ToSvg;
