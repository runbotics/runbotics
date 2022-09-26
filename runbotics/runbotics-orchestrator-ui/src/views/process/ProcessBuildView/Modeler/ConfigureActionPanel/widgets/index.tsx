import ElementAwareAutocompleteWidget from './ElementAwareAutocompleteWidget';
import GlobalVariableSelectWidget from './GlobalVariableSelectWidget';
import JsonViewWidget from './JsonViewWidget';
import EditorWidget from './EditorWidget';
import DraftJSEditor from './DraftJSWidget';
import ProcessNameSuggestionWidget from './SuggestProcessesNameWidget';
import FileDropzoneWidget from './FileDropzone';

const customWidgets = {
    ElementAwareAutocomplete: ElementAwareAutocompleteWidget,
    TextWidget: ElementAwareAutocompleteWidget,
    ProcessNameSuggestionWidget,
    JsonViewWidget,
    EditorWidget,
    DraftJSEditor,
    GlobalVariableSelectWidget,
    FileDropzone: FileDropzoneWidget,
};

export default customWidgets;
