import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IScheduleProcess, defaultValue } from 'app/shared/model/schedule-process.model';

export const ACTION_TYPES = {
  FETCH_SCHEDULEPROCESS_LIST: 'scheduleProcess/FETCH_SCHEDULEPROCESS_LIST',
  FETCH_SCHEDULEPROCESS: 'scheduleProcess/FETCH_SCHEDULEPROCESS',
  CREATE_SCHEDULEPROCESS: 'scheduleProcess/CREATE_SCHEDULEPROCESS',
  UPDATE_SCHEDULEPROCESS: 'scheduleProcess/UPDATE_SCHEDULEPROCESS',
  PARTIAL_UPDATE_SCHEDULEPROCESS: 'scheduleProcess/PARTIAL_UPDATE_SCHEDULEPROCESS',
  DELETE_SCHEDULEPROCESS: 'scheduleProcess/DELETE_SCHEDULEPROCESS',
  RESET: 'scheduleProcess/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IScheduleProcess>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ScheduleProcessState = Readonly<typeof initialState>;

// Reducer

export default (state: ScheduleProcessState = initialState, action): ScheduleProcessState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SCHEDULEPROCESS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SCHEDULEPROCESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_SCHEDULEPROCESS):
    case REQUEST(ACTION_TYPES.UPDATE_SCHEDULEPROCESS):
    case REQUEST(ACTION_TYPES.DELETE_SCHEDULEPROCESS):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_SCHEDULEPROCESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_SCHEDULEPROCESS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SCHEDULEPROCESS):
    case FAILURE(ACTION_TYPES.CREATE_SCHEDULEPROCESS):
    case FAILURE(ACTION_TYPES.UPDATE_SCHEDULEPROCESS):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_SCHEDULEPROCESS):
    case FAILURE(ACTION_TYPES.DELETE_SCHEDULEPROCESS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SCHEDULEPROCESS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_SCHEDULEPROCESS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_SCHEDULEPROCESS):
    case SUCCESS(ACTION_TYPES.UPDATE_SCHEDULEPROCESS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_SCHEDULEPROCESS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_SCHEDULEPROCESS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/schedule-processes';

// Actions

export const getEntities: ICrudGetAllAction<IScheduleProcess> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SCHEDULEPROCESS_LIST,
    payload: axios.get<IScheduleProcess>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IScheduleProcess> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SCHEDULEPROCESS,
    payload: axios.get<IScheduleProcess>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IScheduleProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SCHEDULEPROCESS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IScheduleProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SCHEDULEPROCESS,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IScheduleProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_SCHEDULEPROCESS,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IScheduleProcess> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SCHEDULEPROCESS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
