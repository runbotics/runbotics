import React, { FC, useState } from 'react';

import { WidgetProps } from '@rjsf/core';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';

const parseContentToEditorState = (text: string) => {
    if (text) {
        const isHTML = /<\/?[a-z][\s\S]*>/i.test(text);
        let content;

        if (isHTML) {
            const blocksFromHTML = convertFromHTML(text);
            content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        } else {
            content = ContentState.createFromText(text);
        }
        const state: EditorState = EditorState.createWithContent(content);
        return state;
    }
    return EditorState.createEmpty();
};

const DraftJSEditor: FC<WidgetProps> = (props) => {
    const [state, setState] = useState(parseContentToEditorState(props.value));

    const onEditorStateChange = (editorState) => {
        setState(editorState);
        const json = stateToHTML(editorState.getCurrentContent());
        props.onChange(json);
    };

    return (
        <>
            <Editor
                editorState={state}
                onEditorStateChange={onEditorStateChange}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
            />
        </>
    );
};

export default DraftJSEditor;
