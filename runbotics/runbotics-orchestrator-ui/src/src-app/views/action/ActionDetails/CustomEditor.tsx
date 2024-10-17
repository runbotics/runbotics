import React, { FC } from 'react';

import Editor from '@monaco-editor/react';

import ErrorBoundary from '#src-app/components/utils/ErrorBoundary';

import { IAction } from '#src-app/types/model/action.model';

import { isValidJson } from '../action.utils';

interface EditorProps {
    setLoading: (value: boolean) => void;
    setDraft: (value: React.SetStateAction<IAction>) => void;
    draftForm: string;
}

export const CustomEditor: FC<EditorProps> = ({ setLoading, setDraft, draftForm }) => {
    const handleEditorChange = (value: string) => {
        if (!isValidJson(value)) {
            setLoading(true);
            return;
        }

        setDraft(prev => ({
            ...prev,
            form: value
        }));

        setLoading(false);
    };

    return (
        <ErrorBoundary>
            <Editor height="60vh" defaultLanguage="json" value={draftForm} onChange={handleEditorChange} />
        </ErrorBoundary>
    );
};
