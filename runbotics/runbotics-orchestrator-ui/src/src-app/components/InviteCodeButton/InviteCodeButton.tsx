import { VFC, useEffect } from 'react';

import { Button } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { tenantsActions, tenantsSelector } from '#src-app/store/slices/Tenants';

interface InviteCodeButtonProps {
    tenantId?: string;
    fullWidth?: boolean | null;
}

const InviteCodeButton: VFC<InviteCodeButtonProps> = ({ tenantId, fullWidth }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const { inviteCode } = useSelector(tenantsSelector);

    const clipboardInviteCode = (e) => {
        navigator.clipboard.writeText(`${window.location.origin}/register?inviteCode=${inviteCode}`);
        e.target.innerText = translate('Component.InviteCodeButton.Copied');
    };

    const generateInviteCode = (e) => {
        dispatch(tenantsActions.generateInviteCode(tenantId ?? ''))
            .unwrap()
            .then(({ inviteCode: code }) => {
                navigator.clipboard.writeText(`${window.location.origin}/register?inviteCode=${code}`);
                e.target.innerText = translate('Component.InviteCodeButton.Copied');
            })
        ;
    };

    useEffect(() => {
        dispatch(tenantsActions.getInviteCode(tenantId ?? ''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tenantId]);

    const inviteButton = inviteCode
        ? <Button
            fullWidth={fullWidth}
            variant='outlined'
            onClick={clipboardInviteCode}
            onBlur={(e) => e.target.innerText=translate('Component.InviteCodeButton.Copy')}
        >
            {translate('Component.InviteCodeButton.Copy')}
        </Button>
        : <Button
            fullWidth={fullWidth}
            variant='contained'
            onClick={generateInviteCode}
        >
            {translate('Component.InviteCodeButton.Generate')}
        </Button>;

    return inviteButton;
};

export default InviteCodeButton;
