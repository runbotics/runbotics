import { VFC, useEffect } from 'react';

import { Button } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { tenantsActions, tenantsSelector } from '#src-app/store/slices/Tenants';

interface InviteCodeButtonProps {
    tenantId?: string;
}

const InviteCodeButton: VFC<InviteCodeButtonProps> = ({ tenantId }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const { inviteCode } = useSelector(tenantsSelector);

    const clipboardInviteCode = (e) => {
        navigator.clipboard.writeText(`${window.location.origin}/register?inviteCode=${inviteCode}`);
        e.target.innerText = translate('Component.InviteCodeButton.Copied');
    };

    const generateInviteCode = () => {
        dispatch(tenantsActions.generateInviteCode(tenantId ?? ''));
    };

    useEffect(() => {
        dispatch(tenantsActions.getInviteCode(tenantId ?? ''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tenantId]);

    const inviteButton = inviteCode
        ? <Button
            variant='outlined'
            onClick={clipboardInviteCode}
            onBlur={(e) => e.target.innerText=translate('Component.InviteCodeButton.Copy')}
        >
            {translate('Component.InviteCodeButton.Copy')}
        </Button>
        : <Button
            variant='contained'
            onClick={generateInviteCode}
        >
            {translate('Component.InviteCodeButton.Generate')}
        </Button>;

    return inviteButton;
};

export default InviteCodeButton;
