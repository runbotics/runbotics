import React, { useState } from 'react';

import { translate } from '#src-app/hooks/useTranslations';

import styles from './RunboticsEnterpriseModal.module.scss';

const RunboticsEnterpriseModal: React.FC = () => {
    const [open, setOpen] = useState(true);

    if (!open) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.contentRow}>
                <img
                    src="/images/logos/runbotics_enterprise.png"
                    alt="RunBotics Logo"
                    className={styles.logo}
                />
                <div className={styles.textGroup}>
                    <span className={styles.title}>
                        {translate('Enterprise.Title')}
                    </span>
                    <span className={styles.text}>
                        {translate('Enterprise.Description')}
                    </span>
                </div>
            </div>
            <div className={styles.buttons}>
                <button type="button" onClick={() => setOpen(false)}>
                    {translate('Enterprise.Button.Dismiss')}
                </button>
                <button
                    type="button"
                    onClick={() =>
                        window.open(
                            'https://softwarehouse.all-for-one.pl/runbotics-enterprise/',
                            '_blank'
                        )
                    }
                    className={styles.primaryButton}
                >
                    {translate('Enterprise.Button.Cta')}
                </button>
            </div>
        </div>
    );
};

export default RunboticsEnterpriseModal;
