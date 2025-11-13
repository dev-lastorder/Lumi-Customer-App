import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop, SvgProps } from 'react-native-svg';

const UpdateNumberSVG = (props: SvgProps) => (
  <Svg width="512" height="512" viewBox="0 0 512 512" fill="none" {...props}>
    <Defs>
      <LinearGradient id="paint0" x1="113.649" y1="29.8633" x2="113.649" y2="444.948" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#90E36D" />
        <Stop offset="0.5" stopColor="#74D24C" />
        <Stop offset="1" stopColor="#58C02B" />
      </LinearGradient>
      <LinearGradient id="paint1" x1="259.825" y1="0.00098" x2="259.825" y2="92.2008" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#90E36D" />
        <Stop offset="0.5" stopColor="#74D24C" />
        <Stop offset="1" stopColor="#58C02B" />
      </LinearGradient>
      <LinearGradient id="paint2" x1="344.125" y1="67.0527" x2="344.125" y2="482.137" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#90E36D" />
        <Stop offset="0.5" stopColor="#74D24C" />
        <Stop offset="1" stopColor="#58C02B" />
      </LinearGradient>
      <LinearGradient id="paint3" x1="197.866" y1="419.799" x2="197.866" y2="512.001" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#90E36D" />
        <Stop offset="0.5" stopColor="#74D24C" />
        <Stop offset="1" stopColor="#58C02B" />
      </LinearGradient>
      <LinearGradient id="paint4" x1="228.842" y1="185.179" x2="228.842" y2="339.195" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#90E36D" />
        <Stop offset="0.5" stopColor="#74D24C" />
        <Stop offset="1" stopColor="#58C02B" />
      </LinearGradient>
      <LinearGradient id="paint5" x1="264.921" y1="185.179" x2="264.921" y2="311.477" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#90E36D" />
        <Stop offset="0.5" stopColor="#74D24C" />
        <Stop offset="1" stopColor="#58C02B" />
      </LinearGradient>
      <ClipPath id="clip0">
        <Rect width="512" height="512" fill="white" />
      </ClipPath>
    </Defs>

    <G clipPath="url(#clip0)">
      <Path
        d="M32.3095 256.488C32.3095 322.266 64.9895 380.41 114.996 415.57C123.809 421.77 124.277 434.64 115.813 441.305L115.574 441.492C110.047 445.844 102.297 446.132 96.5395 442.09C38.1605 401.09 0.000488281 333.242 0.000488281 256.488C0.000488281 131.992 103.05 30.9263 227.297 29.8633V62.1803C120.883 63.2343 32.3095 149.828 32.3095 256.488Z"
        fill="url(#paint0)"
      />
      <Path
        d="M233.23 0.96501L292.605 41.578C295.785 43.754 295.785 48.445 292.605 50.621L233.23 91.234C229.594 93.723 224.66 91.117 224.66 86.714V5.48901C224.66 1.08301 229.594 -1.51899 233.23 0.966011V0.96501Z"
        fill="url(#paint1)"
      />
      <Path
        d="M425.383 255.512C425.383 189.734 392.699 131.59 342.691 96.4302C333.879 90.2302 333.411 77.3602 341.875 70.6952L342.113 70.5082C347.641 66.1562 355.391 65.8682 361.148 69.9102C419.531 110.91 457.688 178.758 457.688 255.512C457.688 380.008 354.813 481.074 230.563 482.137V449.82C336.977 448.766 425.383 362.176 425.383 255.512Z"
        fill="url(#paint2)"
      />
      <Path
        d="M224.46 511.035L165.086 470.422C161.906 468.246 161.906 463.555 165.086 461.379L224.461 420.766C228.094 418.277 233.031 420.883 233.031 425.286V506.512C233.031 510.918 228.093 513.523 224.46 511.035Z"
        fill="url(#paint3)"
      />
      <Path
        d="M329.629 230.82L232.371 311.477L207.851 331.813C202.074 336.598 194.761 339.195 187.324 339.195C186.086 339.195 184.848 339.125 183.598 338.98C174.922 337.96 166.938 333.36 161.699 326.363L123.879 275.949C115.339 264.563 117.649 248.399 129.039 239.844C140.437 231.304 156.602 233.614 165.145 245.004L190.675 279.047L190.883 278.879L296.711 191.113C307.676 182.027 323.934 183.543 333.023 194.508C342.113 205.473 340.593 221.73 329.629 230.82Z"
        fill="url(#paint4)"
      />
      <Path
        d="M329.629 230.82L232.371 311.477C216.465 303.535 202.477 292.559 190.883 278.879L296.711 191.113C307.676 182.027 323.934 183.543 333.023 194.508C342.113 205.473 340.593 221.73 329.629 230.82Z"
        fill="url(#paint5)"
      />
    </G>
  </Svg>
);

export default UpdateNumberSVG;
