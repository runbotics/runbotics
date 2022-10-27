import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

import { IActivity } from 'src/types/model/activity.model';

export const getActivities = createAsyncThunk<IActivity[]>(
    'activity/getActivities',
    () => Axios.get<IActivity[]>('/api/activities')
        .then((response) => response.data),
);
