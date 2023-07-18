import mixpanel from 'mixpanel-browser';

// const isInProduction = true;
const isInProduction = process.env.NODE_ENV === 'production';
const token = process.env.NEXT_PUBLIC_MIXPANEL_ANALYTICS_TOKEN;
const isAnalyticsEnabled = token && isInProduction;

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
