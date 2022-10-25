import { useSelector } from 'src/store';
import useTranslations from 'src/hooks/useTranslations';

const LeavePromt = () => {
    const { isSaveDisabled } = useSelector((state) => state.process.modeler);
    const { translate } = useTranslations();
    return (
        // <Prompt
        //     when={!isSaveDisabled}
        //     message={(location) =>
        //         !location.pathname.includes('build') ? translate('Process.Modeler.LeavePrompt') : false
        //     }
        // />
        <></>
    );
};

export default LeavePromt;
