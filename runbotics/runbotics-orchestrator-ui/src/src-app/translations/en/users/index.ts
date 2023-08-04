import usersActionsTranslations from './actions';
import usersBrowseTranslations from './browse';
import usersRegistrationTranslations from './registration';

const usersTranslations = {
    ...usersBrowseTranslations,
    ...usersRegistrationTranslations,
    ...usersActionsTranslations,
};

export default usersTranslations;
