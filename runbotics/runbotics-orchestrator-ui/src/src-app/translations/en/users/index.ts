import usersActionsTranslations from './actions';
import usersBrowseTranslations from './browse';
import usersListTranslations from './list';
import usersRegistrationTranslations from './registration';

const usersTranslations = {
    ...usersBrowseTranslations,
    ...usersListTranslations,
    ...usersRegistrationTranslations,
    ...usersActionsTranslations,
};

export default usersTranslations;
