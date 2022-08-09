import ElementAwareAutocompleteWidget from './ElementAwareAutocompleteWidget';
import GlobalVariableSelectWidget from './GlobalVariableSelectWidget';
import JsonViewWidget from './JsonViewWidget';
import EditorWidget from './EditorWidget';
import DraftJSEditor from './DraftJSWidget';
import ProcessNameSuggestionWidget from './SuggestProcessesNameWidget';

const customWidgets = {
    ElementAwareAutocomplete: ElementAwareAutocompleteWidget,
    TextWidget: ElementAwareAutocompleteWidget,
    ProcessNameSuggestionWidget,
    JsonViewWidget,
    EditorWidget,
    DraftJSEditor,
    GlobalVariableSelectWidget,
};

export default customWidgets;
