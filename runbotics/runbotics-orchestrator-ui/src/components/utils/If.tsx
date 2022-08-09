import React, { FunctionComponent, ReactNode } from 'react';

interface IfProps {
    condition: boolean | undefined;
    else?: ReactNode;
}

const If: FunctionComponent<IfProps> = (props) => (props.condition ? <>{props.children}</> : <>{props.else}</>);

export default If;
