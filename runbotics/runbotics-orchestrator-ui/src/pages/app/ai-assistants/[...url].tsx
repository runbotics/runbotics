import { GetServerSideProps } from 'next';

import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import AIAssistantDetailsView from '#src-app/views/AIAssistantDetailsView/AIAssistantDetailsView';

interface AIAssistantDetailsPageProps {
    assistantUrl: string;
}

const AIAssistantDetailsPage = ({ assistantUrl }: AIAssistantDetailsPageProps) => (
    <AIAssistantDetailsView assistantUrl={assistantUrl} />
);

export const getServerSideProps: GetServerSideProps = (context) => {
    const originalUrl = context.resolvedUrl.replace('/app/ai-assistants', '');
    const cleanUrl = originalUrl.startsWith('/') ? originalUrl.slice(1) : originalUrl;
    
    return Promise.resolve({
        props: {
            assistantUrl: cleanUrl,
        },
    });
};

export default withAuthGuard({
    Component: AIAssistantDetailsPage,
    featureKeys: [FeatureKey.AI_ASSISTANTS_ACCESS],
});
