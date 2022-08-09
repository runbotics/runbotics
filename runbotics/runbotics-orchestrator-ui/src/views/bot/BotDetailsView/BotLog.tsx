import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { BotParams } from 'src/utils/types/BotParams';
import HistoryTable from '../../../components/HistoryTable';

const BotLog: FC = () => {
    const { id } = useParams<BotParams>();
    const botId = Number(id);

    return (
        <HistoryTable botId={botId} sx={{ paddingLeft: 0 }} />
    );
};
export default BotLog;
