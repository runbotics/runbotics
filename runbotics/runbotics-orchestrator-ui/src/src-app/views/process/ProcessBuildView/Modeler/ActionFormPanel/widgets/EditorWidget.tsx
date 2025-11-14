import React, { FC, useEffect, useRef } from 'react';

import Editor, { useMonaco } from '@monaco-editor/react';
import { WidgetProps } from '@rjsf/core';

import useTranslations from '#src-app/hooks/useTranslations';

const EditorWidget: FC<WidgetProps> = (props) => {
    const monaco = useMonaco();
    const { translate } = useTranslations();
    const editorRef = useRef(null);
    const language: string = props.uiSchema['ui:options']?.language
        ? (props.uiSchema['ui:options']?.language as string)
        : 'typescript';
    const readOnly = !!props.uiSchema['ui:options']?.readonly;
    const editorHeight: string = props.uiSchema['ui:options']?.editorHeight
        ? (props.uiSchema['ui:options']?.editorHeight as string)
        : '60vh';

    const handleEditorDidMount = (editor, monacoInstance) => {
        editorRef.current = editor;
        editor.addAction({
            id: 'auto-save-id',

            // A label of the action that will be presented to the user.
            label: translate('Process.Details.Modeler.Widgets.Editor.AutoSave.Label'),

            // An optional array of keybindings for the action.
            keybindings: [monacoInstance.KeyMod.CtrlCmd || monacoInstance.KeyCode.KEY_S],

            // A precondition for this action.
            precondition: null,

            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
            keybindingContext: null,

            contextMenuGroupId: 'navigation',

            contextMenuOrder: 1.5,

            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convinience
            run() {
                alert(translate('Process.Details.Modeler.Widgets.Editor.AutoSave.NotImplemented'));
            },
        });
    };

    const handleEditorChange = (value) => {
        props.onChange(value);
    };

    useEffect(() => {
        if (monaco) {
            const compilerOptions = monaco.languages.typescript.typescriptDefaults.getCompilerOptions();
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                ...compilerOptions,
                module: 1,
            });
        }
    }, [monaco]);


    console.log('EditorWidget render', props.formData);
    return (
        <Editor
            height={editorHeight}
            defaultLanguage={language}
            value={props.value ?? props.formData ?? ''}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{ readOnly }}
        />
    );
};

export default EditorWidget;
