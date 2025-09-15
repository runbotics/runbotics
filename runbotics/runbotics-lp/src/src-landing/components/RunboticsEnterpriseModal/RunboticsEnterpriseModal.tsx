import React, { useState } from 'react';
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
                        Runbotics nie jest już utrzymywany w modelu open-source.
                    </span>
                    <span className={styles.text}>
                        Jeśli chcesz korzystać z Runbotics, to skontaktuj się z
                        naszym partnerem All for One Poland po Runbotics
                        Enterprise.
                    </span>
                </div>
            </div>
            <div className={styles.buttons}>
                <button type="button" onClick={() => setOpen(false)}>
                    Rozumiem
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
                    Przejdź do Runbotics Enterprise
                </button>
            </div>
        </div>
    );
};

export default RunboticsEnterpriseModal;
