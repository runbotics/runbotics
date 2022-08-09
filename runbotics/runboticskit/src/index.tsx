import * as React from 'react';
interface Props {
    text: string;
}
export const ExampleComponent = ({ text }: Props) => {
    return <div>Example Component: {text}</div>;
};

export * from './ReactHookFormJsonSchema';
export * from './form';
