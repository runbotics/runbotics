import { Location } from 'history';
import React, { useEffect, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { translate } from 'src/hooks/useTranslations';
import { processActions } from 'src/store/slices/Process';
import LeavePrompt from './LeavePrompt';

interface Props {
  when?: boolean | undefined;
  navigate: (path: string) => void;
  shouldBlockNavigation: (location: Location) => boolean;
}

const RouteLeavingGuard = ({
  when,
  navigate,
  shouldBlockNavigation,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBlockedNavigation = (nextLocation: Location): boolean => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      setModalVisible(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setModalVisible(false);
    setConfirmedNavigation(true);
  }; 

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      navigate(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <LeavePrompt
        open={modalVisible}
        titleText={translate('Process.Modeler.LeaveModelerTitle')}
        contentText={translate('Process.Modeler.LoseModelerChangesContent')}
        cancelButtonText={translate('Process.Modeler.DialogCancel')}
        confirmButtonText={translate('Process.Modeler.DialogConfirm')}
        onCancel={closeModal}
        onConfirm={handleConfirmNavigationClick}
      />
    </>
  );
};
export default RouteLeavingGuard;

function dispatch(arg0: { payload: boolean; type: string; }) {
  throw new Error('Function not implemented.');
}
