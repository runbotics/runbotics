import dynamic from 'next/dynamic';

const ElementAwareAutocompleteWidget = dynamic(() => import('./ElementAwareAutocompleteWidget'), { ssr: false });
const GlobalVariableSelectWidget = dynamic(() => import('./GlobalVariableSelectWidget'), { ssr: false });
const JsonViewWidget = dynamic(() => import('./JsonViewWidget'), { ssr: false });
const EditorWidget = dynamic(() => import('./EditorWidget'), { ssr: false });
const DraftJSEditor = dynamic(() => import('./DraftJSWidget'), { ssr: false });
const ProcessNameSuggestionWidget = dynamic(() => import('./SuggestProcessesNameWidget'), { ssr: false });
const FileDropzoneWidget = dynamic(() => import('./FileDropzone'), { ssr: false });
const BrowserTargetWidget = dynamic(() => import('./BrowserTargetWidget'), { ssr: false });
const TypographyWidget = dynamic(() => import('./TypographyWidget'), { ssr: false });

const customWidgets = {
    TextWidget: ElementAwareAutocompleteWidget,
    ProcessNameSuggestionWidget,
    JsonViewWidget,
    EditorWidget,
    DraftJSEditor,
    GlobalVariableSelectWidget,
    FileDropzoneWidget,
    BrowserTargetWidget,
    TypographyWidget
};

export default customWidgets;
