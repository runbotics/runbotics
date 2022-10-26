import React, { VFC, useEffect, useState } from 'react';
import { translate } from 'src/hooks/useTranslations';
import LeavePrompt from './LeavePrompt';

interface Props {
    when?: boolean | undefined;
    navigate: (path: string) => void;
    shouldBlockNavigation?: (location: Location) => boolean;
}

const RouteLeavingGuard: VFC<Props> = ({ when, navigate, shouldBlockNavigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [lastLocation, setLastLocation] = useState<Location | null>(null);
    const [isNavigationConfirmed, setIsNavigationConfirmed] = useState(false);

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleBlockedNavigation = (nextLocation: Location): boolean => {
        if (!isNavigationConfirmed && (!shouldBlockNavigation || shouldBlockNavigation(nextLocation))) {
            setModalVisible(true);
            setLastLocation(nextLocation);
            return false;
        }
        return true;
    };

    const handleConfirmNavigationClick = () => {
        setModalVisible(false);
        setIsNavigationConfirmed(true);
    };

    useEffect(() => {
        if (isNavigationConfirmed && lastLocation) {
            navigate(lastLocation.pathname);
        }
    }, [isNavigationConfirmed, lastLocation]);

    return (
        <>
            {/* <Prompt when={when} message={handleBlockedNavigation} /> */}
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
