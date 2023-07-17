import mixpanel from 'mixpanel-browser';
mixpanel.init('d55b45fc7f313edf0d13fc66c6ca0e96');

// const isInProduction = process.env.NODE_ENV === 'production';
const isInProduction = true;

const actions = {
    identify: (id) => {
        if (isInProduction) mixpanel.identify(id);
    },
    alias: (id) => {
        if (isInProduction) mixpanel.alias(id);
    },
    track: (name, props) => {
        if (isInProduction) mixpanel.track(name, props);
    },
    people: {
        set: (props) => {
            if (isInProduction) mixpanel.people.set(props);
        },
    },
};

export const Mixpanel = actions;
