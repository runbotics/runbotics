import React, { FC } from 'react';

import { useRouter } from 'next/router';

import HistoryTable from '../../../components/HistoryTable';

const BotLog: FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const botId = Number(id);

    return <HistoryTable botId={botId} sx={{ paddingLeft: 0 }} />;
};
export default BotLog;
