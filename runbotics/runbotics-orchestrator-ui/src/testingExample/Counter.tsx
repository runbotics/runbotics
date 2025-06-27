import React from 'react';

// Simple Counter component for testing
export const Counter = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <h1 data-testid="count-value">{count}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
    );
};
