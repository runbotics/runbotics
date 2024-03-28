import { ActionRegex } from 'runbotics-common';

export const isFilePathAbsolute = (path: string) => {
    const windowsAbsPathBegining = new RegExp (ActionRegex.WINDOWS_ABSOLUTE_PATH);
    const linuxAbsPathBegining = new RegExp (ActionRegex.LINUX_ABOSLUTE_PATH);

    if (windowsAbsPathBegining.test(path) || linuxAbsPathBegining.test(path)) {
        return true;
    }

    return false;
};