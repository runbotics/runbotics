import moddleOptions from 'camunda-bpmn-moddle/resources/camunda';
import * as lodash from 'lodash';

export default {
    extension: Camunda,
    moddleOptions,
};

export function Camunda(activity, processEnvironment) {
    const jexlPattern = /#{(.+?)}/g;
    const { broker, environment, type, behaviour } = activity;

    return {
        type: 'camunda:extension',
        extensions: { camundaExtension },
        activate,
        deactivate,
    };

    function activate() {
        camundaExtension();
    }

    function deactivate() {
        broker.cancel('_camunda_form');
        broker.cancel('_camunda_io');
    }

    function camundaExtension() {
        if (activity.behaviour.extensionElements) {
            for (const extension of activity.behaviour.extensionElements.values) {
                switch (extension.$type) {
                    case 'camunda:FormData':
                        formFormatting(extension);
                        break;
                    case 'camunda:InputOutput':
                        ioFormatting(extension);
                        break;
                }
            }
        }

        if (activity.behaviour.expression) {
            activity.behaviour.Service = ServiceExpression;
        }

        // debugger;
        // TODO not needed as we fill implementation field
        // if (!activity.behaviour.implementation) {
        //     activity.behaviour.implementation = activity.behaviour.kind;
        //     // behaviour.Service = ServiceImplementation
        // }
        if (activity.type === 'bpmn:ServiceTask') {
            const disabled = activity.behaviour.disabled;
            const credentialType = activity.behaviour.credentialType;
            activity.environment.runbotic = {
                disabled,
                ...(!disabled && credentialType && { credentialType }),
                ...(!disabled && { processOutput: activity.behaviour.processOutput })
            };
        } else if (activity.type === 'bpmn:BoundaryEvent') {
            // do nothing when boundary event as it clears service task assigned state
        } else {
            activity.environment.runbotic = {};
        }
        if (activity.behaviour.resultVariable) {
            activity.on('end', (api) => {
                activity.environment.output[ activity.behaviour.resultVariable ] = api.content.output;
            });
        }
        // stores output variables in the scope of a single process
        if (processEnvironment.output) {
            environment.output = { ...processEnvironment.output };
        }
    }

    function ServiceExpression() {
        const expression = behaviour.expression;
        const stype = `${type}:expression`;
        return {
            type: stype,
            expression,
            execute,
        };

        function execute(executionMessage, callback) {
            const serviceFn = environment.resolveExpression(expression, executionMessage);
            serviceFn.call(activity, executionMessage, (err, result) => {
                callback(err, result);
            });
        }
    }

    function formFormatting(formData) {
        broker.subscribeTmp(
            'event',
            'activity.enter',
            (_, message) => {
                const form = {
                    fields: {},
                };
                formData.fields.forEach((field) => {
                    form.fields[ field.id ] = { ...field };
                    form.fields[ field.id ].defaultValue = environment.resolveExpression(
                        form.fields[ field.id ].defaultValue,
                        message,
                    );
                });
                broker.publish('format', 'run.form', { form });
            },
            { noAck: true, consumerTag: '_camunda_form' },
        );
    }

    function resolve(writeTo, data, message) {
        if (data.definition) {
            if (data.definition.$type === 'camunda:Map') {
                writeTo[ data.name ] = {};
                if (data.definition.entries) {
                    data.definition.entries.forEach((entry) => {
                        let key = data.name + '.' + entry.key;

                        const valueKey = jexlPattern.exec(entry.value);

                        if (data.name === 'functionParams' && valueKey !== null && entry.value !== '#{iterator}') {
                            entry.value = '${environment.variables.' + valueKey[1] + '}';
                        }
                        let value = environment.resolveExpression(entry.value, message);
                        lodash.setWith(writeTo, key, value);
                    });
                }
            } else if (data.definition.$type === 'camunda:List') {
                writeTo[ data.name ] = [];
                data.definition.items &&
                    data.definition.items.forEach((item) => {
                        writeTo[ data.name ].push(environment.resolveExpression(item.value, message));
                    });
            }
        } else {
            writeTo[ data.name ] = environment.resolveExpression(data.value, message);
        }
    }

    function ioFormatting(ioData) {
        if (ioData.inputParameters) {
            broker.subscribeTmp(
                'event',
                'activity.enter',
                (_, message) => {
                    const input = ioData.inputParameters.reduce((result, data) => {
                        resolve(result, data, message);
                        return result;
                    }, {});
                    broker.publish('format', 'run.input', { input });
                },
                { noAck: true },
            );
        }
        if (ioData.outputParameters) {
            broker.subscribeTmp(
                'event',
                'activity.end',
                (_, message) => {
                    if (!environment.runbotic?.disabled) {
                        ioData.outputParameters.forEach((data) => {
                            resolve(environment.output, data, message);
                        });
                        processEnvironment.output = { ...processEnvironment.output, ...environment.output };
                    }
                },
                { noAck: true, consumerTag: '_camunda_io' },
            );
        }
    }
}
