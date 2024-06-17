const lightTheme = {
    fabButton: {
        backgroundColor: 'rgb(255, 105, 0)',
        hoverBackgroundColor: 'rgb(224, 92, 0)',
        pressedBackgroundColor: 'rgb(194, 80, 0)',
        right: 40,
        bottom: 40,
        iconColor: 'white',
        // shadowColor,
    },
    tooltip: {
        textColor: 'black',
        backgroundColor: 'white',
        // shadowColor,
    },
    chatWindow: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: '#8b8b8b',
        // shadowColor,
        scrollbarColor: 'inherit',
    },
    chatWindowHeader: {
        textColor: 'rgb(85, 85, 85)',
        backgroundColor: 'rgb(255, 237, 224)',
        iconColor: 'rgb(0, 0, 0)',
    },
    chatWindowBotMessage: {
        backgroundColor: 'rgb(255, 246, 240)',
        textColor: 'black',
        dateColor: 'gray',
        loaderBackgroundColor: 'rgb(255, 246, 240)',
        loaderColor: '#FF6900',
    },
    chatWindowUserMessage: {
        backgroundColor: 'rgb(240, 240, 240)',
        textColor: 'black',
        dateColor: 'gray',
    },
    chatWindowTextInput: {
        borderColor: 'black',
        textColor: 'black',
        backgroundColor: 'rgb(255, 255, 255)',
        sendButtonColor: 'rgb(255, 246, 240)',
        sendButtonIconColor: 'rgb(255, 105, 0)',
    },
};

const darkTheme = {
    fabButton: {
        backgroundColor: '#121212',
        hoverBackgroundColor: '#1a1625',
        pressedBackgroundColor: '#2f2b3a',
        right: 40,
        bottom: 40,
        iconColor: '#FF6900',
        // shadowColor,
    },
    tooltip: {
        textColor: '#f9faef',
        backgroundColor: '#282828',
        // shadowColor,
    },
    chatWindow: {
        backgroundColor: '#282828',
        borderColor: '#8b8b8b',
        // shadowColor,
        scrollbarColor: '#8b8b8b #575757',
    },
    chatWindowHeader: {
        textColor: '#ededed',
        backgroundColor: '#121212',
        iconColor: '#FF6900',
    },
    chatWindowBotMessage: {
        backgroundColor: '#575757',
        textColor: '#f9faef',
        dateColor: '#8b8b8b',
        loaderBackgroundColor: '#575757',
        loaderColor: '#FF6900',
    },
    chatWindowUserMessage: {
        backgroundColor: '#5e5a66',
        textColor: '#f9faef',
        dateColor: '#8b8b8b',
    },
    chatWindowTextInput: {
        borderColor: '#8b8b8b',
        textColor: '#ededed',
        backgroundColor: '#121212',
        sendButtonColor: '#8b8b8b',
        sendButtonIconColor: '#FF6900',
    },
};

export const mockedThemes = {
    lightTheme,
    darkTheme,
};
