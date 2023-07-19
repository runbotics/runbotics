import mixpanel from 'mixpanel-browser';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const isProduction = process.env.NODE_ENV === 'production';
const token = publicRuntimeConfig.mixpanelAnalyticsToken;
const isAnalyticsEnabled = token && isProduction;

if(token) mixpanel.init(token);

const actions = {
    identify: (id) => {
        if (isAnalyticsEnabled) mixpanel.identify(id);
    },
    alias: (id) => {
        if (isAnalyticsEnabled) mixpanel.alias(id);
    },
    track: (name, props) => {
        if (isAnalyticsEnabled) mixpanel.track(name, props);
    },
    people: {
        set: (props) => {
            if (isAnalyticsEnabled) mixpanel.people.set(props);
        },
    },
};

export const Mixpanel = actions;
