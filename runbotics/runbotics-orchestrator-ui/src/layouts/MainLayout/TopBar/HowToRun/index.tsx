import React, { useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import useLocalStorage from 'src/hooks/useLocalStorage';
import useTranslations from 'src/hooks/useTranslations';
import HowToRunDialog from './HowToRunDialog';

const Index = () => {
    const { translate } = useTranslations();
    const [isOpen, setOpen] = useLocalStorage('HowToRun', false);
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        if (urlParams && urlParams.get('open') === 'howto') {
            setOpen(true);
        }
    }, [location.search, setOpen]);
    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title={translate('Install.Tooltip.Title')}>
                <IconButton color="inherit" onClick={handleOpen}>
                    <GetAppIcon />
                </IconButton>
            </Tooltip>
            {isOpen && <HowToRunDialog open={isOpen} onClose={handleClose} />}
        </>
    );
};

export default Index;
