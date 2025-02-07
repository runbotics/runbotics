import { FC, FocusEvent } from 'react';

import useOptions from '#src-app/hooks/useOptions';

import useTranslations from '#src-app/hooks/useTranslations';

import { FlowExpression } from './GatewayFormRenderer.styles';
import { isSequenceWithExpression } from './GatewayFormRenderer.utils';
import { IBpmnConnection, IBpmnGateway } from '../../../helpers/elementParameters';
import FlowLabelForm from '../../FlowLabelForm';
import AutocompleteWidget from '../../widgets/AutocompleteWidget';
import { NewValueWithName } from '../../widgets/AutocompleteWidget/AutocompleteWidget.types';

interface GatewayFlowExpressionProps {
    gateway: IBpmnGateway;
    outgoing: IBpmnConnection;
    handleOnFocus: (event: FocusEvent<HTMLInputElement>) => void;
    handleOnBlur: (event: FocusEvent<HTMLInputElement>) => void;
    handleCancel: (flow: IBpmnConnection) => void;
    handleExpressionChange: (newValueWithName: NewValueWithName) => void;
    handleConnectionNameChange: (inputValue: string, flow: IBpmnConnection) => void;
}

const GatewayFlowExpression: FC<GatewayFlowExpressionProps> = ({
    gateway,
    outgoing,
    handleOnFocus,
    handleOnBlur,
    handleCancel,
    handleExpressionChange,
    handleConnectionNameChange
}) => {
    const { options } = useOptions();
    const { translate } = useTranslations();

    const emptyExpressionError = translate('Process.Edit.Form.Fields.Error.Required');

    return (
        <FlowExpression key={'flow-expression-' + outgoing.id}>
            <FlowLabelForm
                formLabel={translate('Process.Details.Modeler.ActionPanel.Form.FlowName.Title')}
                onSubmit={name => handleConnectionNameChange(name, outgoing)}
                selectedElement={outgoing}
                onCancel={() => handleCancel(outgoing)}
                onFocus={handleOnFocus}
            />
            <AutocompleteWidget
                id={'autocomplete-text-field-' + outgoing.id}
                withName={true}
                onChange={handleExpressionChange}
                autocompleteOptions={options}
                handleOnBlur={handleOnBlur}
                handleOnFocus={handleOnFocus}
                label={`${translate('Process.Details.Modeler.ActionPanel.Form.Connection.Expression.Expression')}`}
                value={outgoing.businessObject.conditionExpression?.body ?? ''}
                name={outgoing.id}
                customErrors={isSequenceWithExpression(gateway, outgoing) ? undefined : [emptyExpressionError]}
                disabled={false}
                required={false}
                autofocus={false}
            />
        </FlowExpression>
    );
};

export default GatewayFlowExpression;
