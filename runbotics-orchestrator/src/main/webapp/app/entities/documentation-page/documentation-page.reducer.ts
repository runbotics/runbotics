import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDocumentationPage, defaultValue } from 'app/shared/model/documentation-page.model';

export const ACTION_TYPES = {
  FETCH_DOCUMENTATIONPAGE_LIST: 'documentationPage/FETCH_DOCUMENTATIONPAGE_LIST',
  FETCH_DOCUMENTATIONPAGE: 'documentationPage/FETCH_DOCUMENTATIONPAGE',
  CREATE_DOCUMENTATIONPAGE: 'documentationPage/CREATE_DOCUMENTATIONPAGE',
  UPDATE_DOCUMENTATIONPAGE: 'documentationPage/UPDATE_DOCUMENTATIONPAGE',
  PARTIAL_UPDATE_DOCUMENTATIONPAGE: 'documentationPage/PARTIAL_UPDATE_DOCUMENTATIONPAGE',
  DELETE_DOCUMENTATIONPAGE: 'documentationPage/DELETE_DOCUMENTATIONPAGE',
  SET_BLOB: 'documentationPage/SET_BLOB',
  RESET: 'documentationPage/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDocumentationPage>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type DocumentationPageState = Readonly<typeof initialState>;

// Reducer

export default (state: DocumentationPageState = initialState, action): DocumentationPageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DOCUMENTATIONPAGE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DOCUMENTATIONPAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DOCUMENTATIONPAGE):
    case REQUEST(ACTION_TYPES.UPDATE_DOCUMENTATIONPAGE):
    case REQUEST(ACTION_TYPES.DELETE_DOCUMENTATIONPAGE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_DOCUMENTATIONPAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_DOCUMENTATIONPAGE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DOCUMENTATIONPAGE):
    case FAILURE(ACTION_TYPES.CREATE_DOCUMENTATIONPAGE):
    case FAILURE(ACTION_TYPES.UPDATE_DOCUMENTATIONPAGE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_DOCUMENTATIONPAGE):
    case FAILURE(ACTION_TYPES.DELETE_DOCUMENTATIONPAGE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_DOCUMENTATIONPAGE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_DOCUMENTATIONPAGE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_DOCUMENTATIONPAGE):
    case SUCCESS(ACTION_TYPES.UPDATE_DOCUMENTATIONPAGE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_DOCUMENTATIONPAGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_DOCUMENTATIONPAGE):
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

const apiUrl = 'api/documentation-pages';

// Actions

export const getEntities: ICrudGetAllAction<IDocumentationPage> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_DOCUMENTATIONPAGE_LIST,
    payload: axios.get<IDocumentationPage>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IDocumentationPage> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DOCUMENTATIONPAGE,
    payload: axios.get<IDocumentationPage>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IDocumentationPage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DOCUMENTATIONPAGE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDocumentationPage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DOCUMENTATIONPAGE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IDocumentationPage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_DOCUMENTATIONPAGE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDocumentationPage> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DOCUMENTATIONPAGE,
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
