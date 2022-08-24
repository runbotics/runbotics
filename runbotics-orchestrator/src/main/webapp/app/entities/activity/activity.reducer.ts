import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IActivity, defaultValue } from 'app/shared/model/activity.model';

export const ACTION_TYPES = {
  FETCH_ACTIVITY_LIST: 'activity/FETCH_ACTIVITY_LIST',
  FETCH_ACTIVITY: 'activity/FETCH_ACTIVITY',
  CREATE_ACTIVITY: 'activity/CREATE_ACTIVITY',
  UPDATE_ACTIVITY: 'activity/UPDATE_ACTIVITY',
  PARTIAL_UPDATE_ACTIVITY: 'activity/PARTIAL_UPDATE_ACTIVITY',
  DELETE_ACTIVITY: 'activity/DELETE_ACTIVITY',
  SET_BLOB: 'activity/SET_BLOB',
  RESET: 'activity/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IActivity>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ActivityState = Readonly<typeof initialState>;

// Reducer

export default (state: ActivityState = initialState, action): ActivityState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ACTIVITY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ACTIVITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ACTIVITY):
    case REQUEST(ACTION_TYPES.UPDATE_ACTIVITY):
    case REQUEST(ACTION_TYPES.DELETE_ACTIVITY):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_ACTIVITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ACTIVITY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ACTIVITY):
    case FAILURE(ACTION_TYPES.CREATE_ACTIVITY):
    case FAILURE(ACTION_TYPES.UPDATE_ACTIVITY):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_ACTIVITY):
    case FAILURE(ACTION_TYPES.DELETE_ACTIVITY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ACTIVITY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_ACTIVITY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ACTIVITY):
    case SUCCESS(ACTION_TYPES.UPDATE_ACTIVITY):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_ACTIVITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ACTIVITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/activities';

// Actions

export const getEntities: ICrudGetAllAction<IActivity> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ACTIVITY_LIST,
    payload: axios.get<IActivity>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IActivity> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ACTIVITY,
    payload: axios.get<IActivity>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IActivity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ACTIVITY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IActivity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ACTIVITY,
    payload: axios.put(`${apiUrl}/${entity.executionId}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IActivity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_ACTIVITY,
    payload: axios.patch(`${apiUrl}/${entity.executionId}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IActivity> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ACTIVITY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
