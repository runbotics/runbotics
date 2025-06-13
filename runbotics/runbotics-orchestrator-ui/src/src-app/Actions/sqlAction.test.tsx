import Form from '@rjsf/core';
import { render, screen } from '@testing-library/react';
import { SqlAction } from 'runbotics-common';
import { describe, expect, vi, beforeEach, test } from 'vitest';

import getSQLActions from './sql.actions';

// Mock translations
vi.mock('#src-app/hooks/useTranslations', () => ({
    translate: vi.fn((key: string) => key)
}));

// Mock actions utils
vi.mock('./actions.utils', () => ({
    propertyCustomCredential: {
        title: 'Custom Credential',
        type: 'string'
    },
    schemaCustomCredential: {
        'ui:widget': 'CredentialWidget'
    }
}));

// Mock custom widgets
const mockWidgets = {
    CredentialWidget: ({ value, onChange, options }: any) => (
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid="credential-widget"
        >
            <option value="">Select credential</option>
            <option value="test-credential">Test Credential</option>
        </select>
    ),
    EditorWidget: ({ value, onChange, options }: any) => (
        <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid="editor-widget"
            placeholder={`${options?.language || 'text'} editor`}
        />
    ),
    AutocompleteWidget: ({ value, onChange, options }: any) => (
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid="autocomplete-widget"
        />
    )
};

describe('SQL Actions Form Rendering', () => {
    let sqlActions: Record<string, any>;

    beforeEach(() => {
        sqlActions = getSQLActions();
    });

    describe('SQL_CONNECT Action Form', () => {
        test('should render connect form with credential field', () => {
            const connectAction = sqlActions[SqlAction.CONNECT];
            const { schema, uiSchema, formData } = connectAction.form;

            const onSubmit = vi.fn();
            const onChange = vi.fn();            
            render(
                <Form
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={formData}
                    onSubmit={onSubmit}
                    onChange={onChange}
                    widgets={mockWidgets}
                />
            );

            // Check if input section is rendered
            expect(screen.getByText('Process.Details.Modeler.Actions.Common.Input')).toBeDefined();
            
            // Check if credential field exists in schema
            expect(schema.properties.input.properties.customCredentialId).toBeDefined();
        });
    });
    
});
