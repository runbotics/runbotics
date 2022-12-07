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
    },

    @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local(''),
        url('/fonts/roboto/roboto-v30-latin-300.woff2') format('woff2'), 
        url('/fonts/roboto/roboto-v30-latin-300.woff') format('woff');
    }

    @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local(''),
        url('/fonts/roboto/roboto-v30-latin-regular.woff2') format('woff2'), 
        url('/fonts/roboto/roboto-v30-latin-regular.woff') format('woff');
    }
    
    @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: local(''),
        url('/fonts/roboto/roboto-v30-latin-500.woff2') format('woff2'), 
        url('/fonts/roboto/roboto-v30-latin-500.woff') format('woff');
    }

    @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    src: local(''),
        url('/fonts/roboto/roboto-v30-latin-700.woff2') format('woff2'), 
        url('/fonts/roboto/roboto-v30-latin-700.woff') format('woff');
    }

    @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    src: local(''),
        url('/fonts/roboto/roboto-v30-latin-900.woff2') format('woff2'), 
        url('/fonts/roboto/roboto-v30-latin-900.woff') format('woff');
    }

    @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    src: local(''),
        url('/fonts/montserrat/montserrat-v25-latin-regular.woff2') format('woff2'), 
        url('/fonts/montserrat/montserrat-v25-latin-regular.woff') format('woff');
    }

    @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    src: local(''),
        url('/fonts/montserrat/montserrat-v25-latin-500.woff2') format('woff2'), 
        url('/fonts/montserrat/montserrat-v25-latin-500.woff') format('woff');
    }

    @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    src: local(''),
        url('/fonts/montserrat/montserrat-v25-latin-600.woff2') format('woff2'), 
        url('/fonts/montserrat/montserrat-v25-latin-600.woff') format('woff');
    }

    @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 700;
    src: local(''),
        url('/fonts/montserrat/montserrat-v25-latin-700.woff2') format('woff2'), 
        url('/fonts/montserrat/montserrat-v25-latin-700.woff') format('woff');
`,
);

export default GlobalStyles;
