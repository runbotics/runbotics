import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBot, defaultValue } from 'app/shared/model/bot.model';

export const ACTION_TYPES = {
  FETCH_BOT_LIST: 'bot/FETCH_BOT_LIST',
  FETCH_BOT: 'bot/FETCH_BOT',
  CREATE_BOT: 'bot/CREATE_BOT',
  UPDATE_BOT: 'bot/UPDATE_BOT',
  PARTIAL_UPDATE_BOT: 'bot/PARTIAL_UPDATE_BOT',
  DELETE_BOT: 'bot/DELETE_BOT',
  RESET: 'bot/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBot>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type BotState = Readonly<typeof initialState>;

// Reducer

export default (state: BotState = initialState, action): BotState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BOT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BOT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_BOT):
    case REQUEST(ACTION_TYPES.UPDATE_BOT):
    case REQUEST(ACTION_TYPES.DELETE_BOT):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_BOT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_BOT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BOT):
    case FAILURE(ACTION_TYPES.CREATE_BOT):
    case FAILURE(ACTION_TYPES.UPDATE_BOT):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_BOT):
    case FAILURE(ACTION_TYPES.DELETE_BOT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_BOT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_BOT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_BOT):
    case SUCCESS(ACTION_TYPES.UPDATE_BOT):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_BOT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_BOT):
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

const apiUrl = 'api/bots';

// Actions

export const getEntities: ICrudGetAllAction<IBot> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_BOT_LIST,
    payload: axios.get<IBot>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IBot> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BOT,
    payload: axios.get<IBot>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IBot> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BOT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBot> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BOT,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IBot> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_BOT,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBot> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BOT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
