import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle(
    ({ theme }) => `
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        scroll-behavior: smooth;
        width: 100%;
    }

    html,
    body,
    body > div:first-child,
    div#__next,
    div#__next > div {
        height: 100%;
    }

    body {
        height: 100%;
        width: 100%;
    }
    
    #root {
        height: 100%;
        width: 100%;
    }

    *::-webkit-scrollbar {
        width: 1rem;
    }
    
    *::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
    }
    
    *::-webkit-scrollbar-thumb {
        background-clip: content-box;
        background-color: ${theme.palette.action.focus};
        border: 0.25rem solid rgba(0,0,0,0);
        border-radius: 0.5rem;
        transition: background-color .2s linear;
        
        :hover {
            background-color: ${theme.palette.action.disabled};
        }
    }
`,
);

export default GlobalStyles;
