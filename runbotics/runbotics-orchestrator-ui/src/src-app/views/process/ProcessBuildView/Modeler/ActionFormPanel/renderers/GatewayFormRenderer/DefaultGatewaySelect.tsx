import { FC, ChangeEvent, FocusEvent } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import BpmnModelerType from 'bpmn-js/lib/Modeler';

import useTranslations from '#src-app/hooks/useTranslations';

import { BpmnConnectionFactory, IBpmnConnection, IBpmnGateway } from '../../../helpers/elementParameters';

interface DefaultGatewaySelectProps {
    gateway: IBpmnGateway;
    defaultFlow: string;
    setDefaultFlow: React.Dispatch<React.SetStateAction<string>>;
    handleOnFocus: (event: FocusEvent<HTMLInputElement>) => void;
    handleOnBlur: (event: FocusEvent<HTMLInputElement>) => void;
    filteredGatewayConnections: IBpmnConnection[];
    modeler: BpmnModelerType;
    expressions: { [key: string]: any };
    validateFlows: () => void;
}

const DefaultGatewaySelect: FC<DefaultGatewaySelectProps> = ({
    gateway,
    defaultFlow,
    setDefaultFlow,
    handleOnFocus,
    handleOnBlur,
    filteredGatewayConnections,
    modeler,
    expressions,
    validateFlows
}) => {
    const { translate } = useTranslations();
    const noDefaultFlowTranslation = translate('Process.Details.Modeler.ActionPanel.Form.Gateway.DefaultFlow');

    const setDefaultConnection = (outgoing: IBpmnConnection | null) => {
        if (!outgoing) {
            gateway.businessObject.default = null;
            setDefaultFlow(noDefaultFlowTranslation);
        } else {
            setDefaultFlow(outgoing.id);
        }
        BpmnConnectionFactory.from(modeler).setDefaultConnection(outgoing, gateway);
        validateFlows();
    };

    const handleDefaultFlowChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === noDefaultFlowTranslation) {
            setDefaultConnection(null);
            return;
        }
        gateway.outgoing.forEach(outgoing => {
            if (event.target.value === outgoing.id && expressions) {
                setDefaultConnection(outgoing);
                BpmnConnectionFactory.from(modeler).setConditionExpression(outgoing, expressions[outgoing.id]);
            }
        });
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="default-flow-select-input-label">
                {translate('Process.Details.Modeler.ActionPanel.Form.Gateway.DefaultFlow')}
            </InputLabel>
            <Select
                labelId="default-flow-select-input-label"
                label={translate('Process.Details.Modeler.ActionPanel.Form.Gateway.DefaultFlow')}
                id="default-flow-select"
                value={defaultFlow}
                onChange={handleDefaultFlowChange}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
            >
                <MenuItem key="flow-menu-item-none" value={noDefaultFlowTranslation}>
                    {translate('Process.Details.Modeler.ActionPanel.Form.Gateway.NoDefaultFlow')}
                </MenuItem>
                {filteredGatewayConnections.map(outgoing => (
                    <MenuItem key={'flow-menu-item-' + outgoing.id} value={outgoing.id}>
                        {outgoing.businessObject.name ? String(outgoing.businessObject.name) : outgoing.id}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DefaultGatewaySelect;
