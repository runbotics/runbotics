import usersActionsTranslations from './actions';
import usersBrowseTranslations from './browse';
import usersViewTranslations from './register';

const usersTranslations = {
    ...usersBrowseTranslations,
    ...usersViewTranslations,
    ...usersActionsTranslations,
};

export default usersTranslations;
