import React from 'react';

import { translate } from 'src/hooks/useTranslations';

interface IErrorBoundaryProps {
    readonly children: JSX.Element | JSX.Element[];
}

interface IErrorBoundaryState {
    readonly error: any;
    readonly errorInfo: any;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props) {
        super(props);
        this.state = { error: undefined, errorInfo: undefined };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
        });
    }

    render() {
        const { error, errorInfo } = this.state;
        if (errorInfo) {
            const errorDetails = process.env.NODE_ENV === 'development' ? (
                <details className="preserve-space">
                    {error && error.toString()}
                    <br />
                    {errorInfo.componentStack}
                </details>
            ) : undefined;
            return (
                <div>
                    <h2 className="error">{translate('Common.Errors.UnexpectedError')}</h2>
                    {errorDetails}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
