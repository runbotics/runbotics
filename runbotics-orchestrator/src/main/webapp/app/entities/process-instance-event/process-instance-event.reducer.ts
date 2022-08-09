import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProcessInstanceEvent, defaultValue } from 'app/shared/model/process-instance-event.model';

export const ACTION_TYPES = {
  FETCH_PROCESSINSTANCEEVENT_LIST: 'processInstanceEvent/FETCH_PROCESSINSTANCEEVENT_LIST',
  FETCH_PROCESSINSTANCEEVENT: 'processInstanceEvent/FETCH_PROCESSINSTANCEEVENT',
  CREATE_PROCESSINSTANCEEVENT: 'processInstanceEvent/CREATE_PROCESSINSTANCEEVENT',
  UPDATE_PROCESSINSTANCEEVENT: 'processInstanceEvent/UPDATE_PROCESSINSTANCEEVENT',
  PARTIAL_UPDATE_PROCESSINSTANCEEVENT: 'processInstanceEvent/PARTIAL_UPDATE_PROCESSINSTANCEEVENT',
  DELETE_PROCESSINSTANCEEVENT: 'processInstanceEvent/DELETE_PROCESSINSTANCEEVENT',
  SET_BLOB: 'processInstanceEvent/SET_BLOB',
  RESET: 'processInstanceEvent/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProcessInstanceEvent>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProcessInstanceEventState = Readonly<typeof initialState>;

// Reducer

export default (state: ProcessInstanceEventState = initialState, action): ProcessInstanceEventState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROCESSINSTANCEEVENT):
    case REQUEST(ACTION_TYPES.UPDATE_PROCESSINSTANCEEVENT):
    case REQUEST(ACTION_TYPES.DELETE_PROCESSINSTANCEEVENT):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCEEVENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT):
    case FAILURE(ACTION_TYPES.CREATE_PROCESSINSTANCEEVENT):
    case FAILURE(ACTION_TYPES.UPDATE_PROCESSINSTANCEEVENT):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCEEVENT):
    case FAILURE(ACTION_TYPES.DELETE_PROCESSINSTANCEEVENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROCESSINSTANCEEVENT):
    case SUCCESS(ACTION_TYPES.UPDATE_PROCESSINSTANCEEVENT):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCEEVENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROCESSINSTANCEEVENT):
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

const apiUrl = 'api/process-instance-events';

// Actions

export const getEntities: ICrudGetAllAction<IProcessInstanceEvent> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT_LIST,
    payload: axios.get<IProcessInstanceEvent>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProcessInstanceEvent> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSINSTANCEEVENT,
    payload: axios.get<IProcessInstanceEvent>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProcessInstanceEvent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROCESSINSTANCEEVENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProcessInstanceEvent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROCESSINSTANCEEVENT,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IProcessInstanceEvent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCEEVENT,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProcessInstanceEvent> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROCESSINSTANCEEVENT,
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
