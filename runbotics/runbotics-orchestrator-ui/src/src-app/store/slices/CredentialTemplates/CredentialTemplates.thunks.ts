import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

import { CredentialTemplate } from '#src-app/views/credentials/Credential/Credential.types';

const env = 'DEV';
const PARENT_URL_PATH = 'credentialId/credential-attributes';

// custom: 1v400222-5db2-4454-8df5-1ee0aa1e123d
// Microsofta: 8e500566-5db2-4454-8df5-1ee0aa1e625e
// Atlassian: 375ba506-de65-40b2-a751-614912075a2b

const testTemplates: CredentialTemplate[] = JSON.parse(`[
  {
    "id": "1v400222-5db2-4454-8df5-1ee0aa1e123d",
    "name": "Custom",
    "tenantId": "b7f9092f-5973-c781-08db-4d6e48f78e98",
    "description": "custom actions",
    "attributes": []
  },
  {
    "id": "8e500566-5db2-4454-8df5-1ee0aa1e625e",
    "name": "Microsofta",
    "tenantId": "b7f9092f-5973-c781-08db-4d6e48f78e98",
    "description": "this is for MS actions",
    "attributes": [
      {
        "id": "85352aad-4943-4e2f-a2cf-3ce45bc9386f",
        "name": "username",
        "description": "this is user login",
        "required": true,
        "type": "string",
        "templateId": "8e500566-5db2-4454-8df5-1ee0aa1e625e"
      },
      {
        "id": "fd5b409f-c29b-4ee7-ba4f-d5d6f69f78ed",
        "name": "password",
        "description": null,
        "required": true,
        "type": "string",
        "templateId": "8e500566-5db2-4454-8df5-1ee0aa1e625e"
      }
    ]
  },
  {
    "id": "375ba506-de65-40b2-a751-614912075a2b",
    "name": "Atlassian",
    "tenantId": "b7f9092f-5973-c781-08db-4d6e48f78e98",
    "description": "this is for Atlassian actions",
    "attributes": [
      {
        "id": "71ed7218-9078-41c6-8df1-f3f28e0f7395",
        "name": "login",
        "description": "this is user login",
        "required": true,
        "type": "string",
        "templateId": "375ba506-de65-40b2-a751-614912075a2b"
      },
      {
        "id": "e3f28e05-7ff6-403f-a5e1-95f2150a5cb6",
        "name": "password",
        "description": null,
        "required": true,
        "type": "string",
        "templateId": "375ba506-de65-40b2-a751-614912075a2b"
      },
      {
        "id": "4b45ccab-9d8c-41dd-91af-8853376e340f",
        "name": "url",
        "description": null,
        "required": false,
        "type": "string",
        "templateId": "375ba506-de65-40b2-a751-614912075a2b"
      }
    ]
  }
]
`);

export const fetchAllTemplates = createAsyncThunk('credential/templates/fetchAll', () => {
    if (env === 'DEV') {
        return testTemplates;
    }

    return axios.get<CredentialTemplate[]>(PARENT_URL_PATH).then(response => response.data);
});

export const fetchOneTemplate = createAsyncThunk('credential/templates/fetchOne', (templateId: string) => {
    if (env === 'DEV') {
        return testTemplates.filter(template => template.id === templateId);
    }

    return axios.get<CredentialTemplate[]>(`${PARENT_URL_PATH}/${templateId}`).then(response => response.data);
});


