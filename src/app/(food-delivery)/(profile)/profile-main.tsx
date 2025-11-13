import { withAuthGuard } from "@/hoc";
import { ProfileMainScreen } from "@/screens";

const ProfileMainPage = () => {
  return <ProfileMainScreen />;
};

export default withAuthGuard(ProfileMainPage);
