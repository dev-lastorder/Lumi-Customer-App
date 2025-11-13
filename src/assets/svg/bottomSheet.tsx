import Svg, { Path, G, Defs, ClipPath, Rect, SvgProps } from 'react-native-svg';

const BottomSheetIcon = (props: SvgProps) => (
  <Svg 
    viewBox="0 0 393 566" 
    fill="none" 
    preserveAspectRatio="none"
    {...props}
  >
    <G clipPath="url(#clip0_5186_4863)">
      <Path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M393 260V566H0V260H21.2C39.7 260 55.6 240 75 200C95 140 140 80 196 80C252 80 297 140 317 200C337 240 352.3 260 370.8 260H393Z" 
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_5186_4863">
        <Rect width="393" height="566" fill="white"/>
      </ClipPath>
    </Defs>
  </Svg>
);

export default BottomSheetIcon;