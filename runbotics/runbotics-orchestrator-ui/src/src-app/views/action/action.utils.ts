export interface ExternalActionFormValidationState {
    script: boolean;
    label: boolean
}

export const initialFormValidationState: ExternalActionFormValidationState = {
    script: false,
    label: false
};

export const isValueEmpty = (value: string) => {
    if (!value || value.trim() === '') {
        return false;
    }

    return true;
};

export   const isScriptNameValid = (scriptName: string) => {
    if (!scriptName || !scriptName.startsWith('external.') ||
        scriptName.length < 10 || scriptName.trim() === 'external.') {
        return false;
    }

    return true;
};

export function isValidJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
