import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';
import { useAppSelector } from '@/redux';
import { GET_ZONES } from '@/api';
import ZoneMap from '../components/zone-map';
import ZoneHeader from '../components/zone-header';
import ZoneFooterButton from '../components/zone-footer';
import ChooseZoneModal from '@/components/modals/choose-zone.modal';
import ZoneConfirmModal from '../components/zone-selection-confirm-modal';
import { LoadingPlaceholder, SomethingWentWrong } from '@/components';
import { useConfirmZone, useZonePolygons } from '../hooks';


export function ZoneNotCoveredScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const dark = theme === 'dark';

  const { data, loading, error } = useQuery(GET_ZONES);
  const zonePolygons = useZonePolygons(data?.zonesCentral);

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedZoneTitle, setSelectedZoneTitle] = useState<string>('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [chooseModalVisible, setChooseModalVisible] = useState(false);

  const resetSelection = () => {
    setSelectedZoneId(null);
    setSelectedZoneTitle('');
  };

  const handleConfirmZone = useConfirmZone({
    zones: data?.zonesCentral || [],
    selectedZoneId,
    selectedZoneTitle,
    onConfirmSuccess: () => {
      setConfirmModalVisible(false);
      resetSelection();
    },
  });


  if (loading) {
    return <LoadingPlaceholder placeholder={'fetching zones'} />
  }
  if (error) {
    return <SomethingWentWrong title='Something went Wrong' description='Unable to load delivery zones. Please try again later.' />
  }

  return (
    <View
      className="flex-1 relative"
      style={{
        backgroundColor: dark ? '#000' : '#fff',
      }}
    >
      <ZoneMap
        dark={dark}
        zonePolygons={zonePolygons}
        selectedZoneId={selectedZoneId}
        setSelectedZoneId={setSelectedZoneId}
        setSelectedZoneTitle={setSelectedZoneTitle}
        setConfirmModalVisible={setConfirmModalVisible}
      />

      <ZoneHeader dark={dark} />

      <ZoneFooterButton insets={insets} onPress={() => setChooseModalVisible(true)} />

      <ChooseZoneModal
        visible={chooseModalVisible}
        onClose={() => setChooseModalVisible(false)}
        onSelect={(zone) => {
          setSelectedZoneId(zone._id);
          setSelectedZoneTitle(zone.title);
          setChooseModalVisible(false);
          setConfirmModalVisible(true);
        }}
        selectedZoneId={selectedZoneId}
        zones={data?.zonesCentral || []}
      />

      <ZoneConfirmModal
        visible={confirmModalVisible}
        onClose={() => {
          resetSelection();
          setConfirmModalVisible(false);
        }}
        onConfirm={handleConfirmZone}
        zoneTitle={selectedZoneTitle}
      />
    </View>
  );
}
