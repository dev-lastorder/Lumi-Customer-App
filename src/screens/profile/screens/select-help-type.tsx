// Components
import { CustomPaddedView, ScreenWrapperWithAnimatedHeader } from '@/components';
import { SelectHelpTypeHeader, SelectHelpTypeMain } from '../components/select-help-type';
import { useThemeColor } from '@/hooks';

const SelectHelpTypeScreen = () => {
  const appTheme = useThemeColor();
  return (
    <ScreenWrapperWithAnimatedHeader
      title="Support"
      showSettings={false}
      showGoBack={true}
      showLocationDropdown={false}
      showMap={false}
      style={{ flexGrow: 1, backgroundColor: appTheme.background }}
    >
      <CustomPaddedView paddingHorizontal={16}>
        <SelectHelpTypeHeader />
        <SelectHelpTypeMain />
      </CustomPaddedView>
    </ScreenWrapperWithAnimatedHeader>
  );
};

export default SelectHelpTypeScreen;
