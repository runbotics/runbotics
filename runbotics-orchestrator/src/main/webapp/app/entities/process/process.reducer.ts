import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProcess, defaultValue } from 'app/shared/model/process.model';

export const ACTION_TYPES = {
  FETCH_PROCESS_LIST: 'process/FETCH_PROCESS_LIST',
  FETCH_PROCESS: 'process/FETCH_PROCESS',
  CREATE_PROCESS: 'process/CREATE_PROCESS',
  UPDATE_PROCESS: 'process/UPDATE_PROCESS',
  PARTIAL_UPDATE_PROCESS: 'process/PARTIAL_UPDATE_PROCESS',
  DELETE_PROCESS: 'process/DELETE_PROCESS',
  SET_BLOB: 'process/SET_BLOB',
  RESET: 'process/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProcess>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProcessState = Readonly<typeof initialState>;

// Reducer

export default (state: ProcessState = initialState, action): ProcessState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCESS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROCESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROCESS):
    case REQUEST(ACTION_TYPES.UPDATE_PROCESS):
    case REQUEST(ACTION_TYPES.DELETE_PROCESS):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_PROCESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCESS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROCESS):
    case FAILURE(ACTION_TYPES.CREATE_PROCESS):
    case FAILURE(ACTION_TYPES.UPDATE_PROCESS):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_PROCESS):
    case FAILURE(ACTION_TYPES.DELETE_PROCESS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROCESS):
    case SUCCESS(ACTION_TYPES.UPDATE_PROCESS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_PROCESS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROCESS):
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

const apiUrl = 'api/processes';

// Actions

export const getEntities: ICrudGetAllAction<IProcess> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESS_LIST,
    payload: axios.get<IProcess>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProcess> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESS,
    payload: axios.get<IProcess>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROCESS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROCESS,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_PROCESS,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProcess> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROCESS,
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
