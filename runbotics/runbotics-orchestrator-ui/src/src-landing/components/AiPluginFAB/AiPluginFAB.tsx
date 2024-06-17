import React, { useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Script from 'next/script';

import {
    getChatAccessToken,
    setChatAccessTokenRefresher,
} from '#src-app/store/slices/Auth/Auth.thunks';

import {
    ChatThemeContext,
    ThemeType,
} from '../Header/ChatThemeToggle/ChatThemeProvider';
import { mockedThemes } from '../Header/ChatThemeToggle/mockedThemes';

export const AiPluginFAB = ({ children }: { children: React.ReactNode }) => {
    const { currThemeType } = useContext(ChatThemeContext);
    const router = useRouter();

    useEffect(() => {
        if (!window.AiChatExtension) return;

        if (currThemeType === ThemeType.DARK) {
            window.AiChatExtension.updateTheme(mockedThemes.darkTheme);
            return;
        }
        window.AiChatExtension.updateTheme(mockedThemes.lightTheme);
    }, [currThemeType]);

    useEffect(() => {
        const isAiChatScriptAttached =
            !!document.getElementById('AiChatScript');
        const isAiChatExtensionAttached =
            !!document.getElementById('AiChatExtension');

        if (isAiChatScriptAttached && !isAiChatExtensionAttached) router.reload();

        return () => {
            const AiChatExtension = document.getElementById('AiChatExtension');
            AiChatExtension.remove();
        };
    }, []);

    return (
        <>
            <Script
                id='AiChatScript'
                src="ai-plugin/ai-plugin.js"
                strategy="lazyOnload"
                onLoad={async () => {
                    const token = await getChatAccessToken();
                    window.AiChatExtension.init(
                        'https://crq0fd1c-9000.euw.devtunnels.ms',
                        {
                            token,
                            theme: mockedThemes.lightTheme,
                        }
                    );

                    setChatAccessTokenRefresher(token, (newToken: string) =>
                        window.AiChatExtension.updateToken(newToken)
                    );

                    console.log('AI Plugin loaded successfully');
                }}
            />
            {children}
        </>
    );
};
