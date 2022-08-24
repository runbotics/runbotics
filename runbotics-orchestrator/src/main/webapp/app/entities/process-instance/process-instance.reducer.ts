import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProcessInstance, defaultValue } from 'app/shared/model/process-instance.model';

export const ACTION_TYPES = {
  FETCH_PROCESSINSTANCE_LIST: 'processInstance/FETCH_PROCESSINSTANCE_LIST',
  FETCH_PROCESSINSTANCE: 'processInstance/FETCH_PROCESSINSTANCE',
  CREATE_PROCESSINSTANCE: 'processInstance/CREATE_PROCESSINSTANCE',
  UPDATE_PROCESSINSTANCE: 'processInstance/UPDATE_PROCESSINSTANCE',
  PARTIAL_UPDATE_PROCESSINSTANCE: 'processInstance/PARTIAL_UPDATE_PROCESSINSTANCE',
  DELETE_PROCESSINSTANCE: 'processInstance/DELETE_PROCESSINSTANCE',
  SET_BLOB: 'processInstance/SET_BLOB',
  RESET: 'processInstance/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProcessInstance>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProcessInstanceState = Readonly<typeof initialState>;

// Reducer

export default (state: ProcessInstanceState = initialState, action): ProcessInstanceState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCESSINSTANCE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROCESSINSTANCE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROCESSINSTANCE):
    case REQUEST(ACTION_TYPES.UPDATE_PROCESSINSTANCE):
    case REQUEST(ACTION_TYPES.DELETE_PROCESSINSTANCE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCESSINSTANCE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROCESSINSTANCE):
    case FAILURE(ACTION_TYPES.CREATE_PROCESSINSTANCE):
    case FAILURE(ACTION_TYPES.UPDATE_PROCESSINSTANCE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCE):
    case FAILURE(ACTION_TYPES.DELETE_PROCESSINSTANCE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSINSTANCE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSINSTANCE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROCESSINSTANCE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROCESSINSTANCE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROCESSINSTANCE):
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

const apiUrl = 'api/process-instances';

// Actions

export const getEntities: ICrudGetAllAction<IProcessInstance> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSINSTANCE_LIST,
    payload: axios.get<IProcessInstance>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProcessInstance> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSINSTANCE,
    payload: axios.get<IProcessInstance>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProcessInstance> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROCESSINSTANCE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProcessInstance> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROCESSINSTANCE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IProcessInstance> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_PROCESSINSTANCE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProcessInstance> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROCESSINSTANCE,
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
