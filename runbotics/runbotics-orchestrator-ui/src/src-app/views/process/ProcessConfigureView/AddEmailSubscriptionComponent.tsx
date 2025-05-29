import { FormEvent, useState, VFC } from 'react';

import { Button, Grid } from '@mui/material';

import { translate } from '#src-app/hooks/useTranslations';

import { StyledTextField } from '#src-app/views/users/UsersListView/UsersListView.styles';

interface ProcessAddEmailSubscriptionComponentProps {
    onEmailAdd: (email: string) => Promise<void>;
}

const AddEmailSubscriptionComponent: VFC<
    ProcessAddEmailSubscriptionComponentProps
> = ({ onEmailAdd }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        onEmailAdd(email).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <Grid
            container
            spacing={0}
            marginBottom={4}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid item xs={1}>
                <form
                    onSubmit={handleSubmit}
                >
                    <StyledTextField
                        margin="dense"
                        type="email"
                        required
                        placeholder={translate(
                            'Process.Edit.EmailSubscription.EmailPlaceholder'
                        )}
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button type="submit" disabled={isSubmitting}>
                        {translate('Process.Edit.EmailSubscription.AddEmail')}
                    </Button>
                </form>
            </Grid>
        </Grid>
    );
};
export default AddEmailSubscriptionComponent;
