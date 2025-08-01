// test-utils/renderWithTheme.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { mockTheme } from './theme-testing';

export const renderWithTestTheme = (children: React.ReactElement, options = {}) =>
    render(<ThemeProvider theme={mockTheme}>{children}</ThemeProvider>, options);
