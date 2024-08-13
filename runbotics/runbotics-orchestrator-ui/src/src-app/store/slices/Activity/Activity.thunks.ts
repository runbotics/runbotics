import { createAsyncThunk } from '@reduxjs/toolkit';

import { IActivity } from '#src-app/types/model/activity.model';
import Axios from '#src-app/utils/axios';

export const getActivities = createAsyncThunk<IActivity[]>(
    'activity/getActivities',
    () => Axios.get<IActivity[]>('/api/activities')
        .then((response) => response.data),
);
