export const defaultForm = `{
    "schema": {
        "type": "object",
        "properties": {
            "input": {
                "title": "Input",
                "type": "string"
            },
            "output": {
                "title": "Output",
                "type": "string"
            }
        },
        "required": [
            "input",
            "output"
        ]
    },
    "uiSchema": {
        "ui:order": [
            "input",
            "output"
        ]
    },
    "formData": {}
}`;
