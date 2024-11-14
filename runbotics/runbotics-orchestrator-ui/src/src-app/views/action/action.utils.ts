export interface ExternalActionFormValidationState {
    script: boolean;
    label: boolean
}

export const initialFormValidationState: ExternalActionFormValidationState = {
    script: false,
    label: false
};

export const isScriptNameValid = (scriptName: string) => {
    const MANDATORY_SCRIPT_NAME_PREFIX = '.external';
    const MIN_SCRIPT_NAME_LENGTH = MANDATORY_SCRIPT_NAME_PREFIX.length + 1;

    if (!scriptName || !scriptName.startsWith('external.') ||
        scriptName.length < MIN_SCRIPT_NAME_LENGTH || scriptName.trim() === 'external.') {
        return false;
    }

    return true;
};
