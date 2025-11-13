import { useThemeColor } from '@/hooks';
import Svg, { Path, SvgProps, Circle } from 'react-native-svg';

const FromSvg = (props: SvgProps) => {
    const appTheme = useThemeColor();
    return (
        <Svg
            width={40}
            height={40}
            viewBox="0 0 50 50"   // matches your render size
            fill="none"
            {...props}
            color={appTheme.primary}
        >
            <Circle
                cx="25"   // center of 50x50 box
                cy="25"
                r="10"    // nice proportion (20px diameter in a 50px box)
                fill="white"
                stroke="#6EE7B7"
                strokeWidth="3"
            />
        </Svg>



    );
};

export default FromSvg;
