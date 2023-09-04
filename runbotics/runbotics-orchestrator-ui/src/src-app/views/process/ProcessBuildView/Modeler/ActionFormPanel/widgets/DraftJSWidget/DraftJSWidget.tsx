import React, { FC, useMemo, useState } from 'react';

import { WidgetProps } from '@rjsf/core';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import i18next from 'i18next';
import { Editor } from 'react-draft-wysiwyg';


import useTranslations from '#src-app/hooks/useTranslations';


import {
    useWrapperStyleObject,
    useHoverWrapperStyleObject,
    useActiveWrapperStyleObject,
    useToolbarStyleObject,
    useEditorStyleObject,
    StyledContainer,
    StyledIconWrapper
} from './DraftJSWidget.styles';
import { isInfoTooltip } from './DraftJSWidgets.utils';
import InfoButtonTooltip from '../components/InfoButtonTooltip';


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
    const activeWrapperStyleObject = useActiveWrapperStyleObject();
    const hoverWrapperStyleObject = useHoverWrapperStyleObject();
    const wrapperStyleObject = useWrapperStyleObject();
    const editorStyleObject = useEditorStyleObject();
    const toolbarStyleObject = useToolbarStyleObject();

    const tooltip = isInfoTooltip(props.options)
        ? (
            <StyledIconWrapper>
                <InfoButtonTooltip message={props.options.info}/>
            </StyledIconWrapper>
        ) : null;

    const currentWrapperStyle = useMemo(() => {
        if(isActive) return activeWrapperStyleObject;
        else if(isHovered) return hoverWrapperStyleObject;
        return wrapperStyleObject;
    }, [isActive, isHovered, activeWrapperStyleObject, hoverWrapperStyleObject, wrapperStyleObject]);

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
        <StyledContainer 
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
                editorStyle={editorStyleObject}
                toolbarStyle={toolbarStyleObject}
                wrapperStyle={currentWrapperStyle}
                localization={{ locale: i18next.language }}
                placeholder={translate('Process.Details.Modeler.Actions.Mail.Send.Content.Placeholder')}
                toolbar={{
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                }}
            />
            {tooltip}
        </StyledContainer>
    );
};

export default DraftJSEditor;
