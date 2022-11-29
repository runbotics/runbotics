import React, { FC, useMemo, useState } from 'react';

import { WidgetProps } from '@rjsf/core';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import i18next from 'i18next';
import { Editor } from 'react-draft-wysiwyg';

import useTranslations from 'src/hooks/useTranslations';

import { WrapperStyleObject, HoverWrapperStyleObject, ActiveWrapperStyleObject, ToolbarStyleObject, EditorStyleObject } from './DraftJSWidget.styles';

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
    const { translate } = useTranslations();
    const [state, setState] = useState(parseContentToEditorState(props.value));
    const [isActive, setIsActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    

    const currentWrapperStyle = useMemo(() => {
        if(isActive) return ActiveWrapperStyleObject();
        else if(isHovered) return HoverWrapperStyleObject();
        return WrapperStyleObject();
    }, [isActive, isHovered]);

    const handleHoverEditorArea = () => {
        setIsHovered(true);
    };

    const handleLeaveEditorArea = () => {
        setIsHovered(false);
    };

    const handleEnterEditorArea = () => {
        setIsActive(true);
    };


    const handleBlurEditorArea = () => {
        setIsActive(false);
    };

    const onEditorStateChange = (editorState) => {
        setState(editorState);
        const json = stateToHTML(editorState.getCurrentContent());
        if(json !== props.value) props.onChange(json);
    };

    return (
        <div 
            onMouseEnter={handleHoverEditorArea}
            onFocus={handleEnterEditorArea}
            onMouseLeave={handleLeaveEditorArea}
            onBlur={handleBlurEditorArea}
        >
            <Editor
                editorState={state}
                onEditorStateChange={onEditorStateChange}
                editorClassName="editorClassName"
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorStyle={EditorStyleObject()}
                toolbarStyle={ToolbarStyleObject()}
                wrapperStyle={currentWrapperStyle}
                localization={{ locale: i18next.language }}
                placeholder={translate('Process.Details.Modeler.Actions.Mail.Send.Content.Placeholder')}
            />
        </div>
    );
};

export default DraftJSEditor;
