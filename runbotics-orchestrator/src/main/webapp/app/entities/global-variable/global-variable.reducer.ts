import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IGlobalVariable, defaultValue } from 'app/shared/model/global-variable.model';

export const ACTION_TYPES = {
  FETCH_GLOBALVARIABLE_LIST: 'globalVariable/FETCH_GLOBALVARIABLE_LIST',
  FETCH_GLOBALVARIABLE: 'globalVariable/FETCH_GLOBALVARIABLE',
  CREATE_GLOBALVARIABLE: 'globalVariable/CREATE_GLOBALVARIABLE',
  UPDATE_GLOBALVARIABLE: 'globalVariable/UPDATE_GLOBALVARIABLE',
  PARTIAL_UPDATE_GLOBALVARIABLE: 'globalVariable/PARTIAL_UPDATE_GLOBALVARIABLE',
  DELETE_GLOBALVARIABLE: 'globalVariable/DELETE_GLOBALVARIABLE',
  RESET: 'globalVariable/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IGlobalVariable>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type GlobalVariableState = Readonly<typeof initialState>;

// Reducer

export default (state: GlobalVariableState = initialState, action): GlobalVariableState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_GLOBALVARIABLE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_GLOBALVARIABLE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_GLOBALVARIABLE):
    case REQUEST(ACTION_TYPES.UPDATE_GLOBALVARIABLE):
    case REQUEST(ACTION_TYPES.DELETE_GLOBALVARIABLE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_GLOBALVARIABLE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_GLOBALVARIABLE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_GLOBALVARIABLE):
    case FAILURE(ACTION_TYPES.CREATE_GLOBALVARIABLE):
    case FAILURE(ACTION_TYPES.UPDATE_GLOBALVARIABLE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_GLOBALVARIABLE):
    case FAILURE(ACTION_TYPES.DELETE_GLOBALVARIABLE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_GLOBALVARIABLE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_GLOBALVARIABLE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_GLOBALVARIABLE):
    case SUCCESS(ACTION_TYPES.UPDATE_GLOBALVARIABLE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_GLOBALVARIABLE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_GLOBALVARIABLE):
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

const apiUrl = 'api/global-variables';

// Actions

export const getEntities: ICrudGetAllAction<IGlobalVariable> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_GLOBALVARIABLE_LIST,
    payload: axios.get<IGlobalVariable>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IGlobalVariable> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_GLOBALVARIABLE,
    payload: axios.get<IGlobalVariable>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IGlobalVariable> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_GLOBALVARIABLE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IGlobalVariable> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_GLOBALVARIABLE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IGlobalVariable> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_GLOBALVARIABLE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IGlobalVariable> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_GLOBALVARIABLE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
