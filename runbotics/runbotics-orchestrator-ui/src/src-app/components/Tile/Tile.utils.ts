export const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

export const getAvatarText = (name: string) => {
    const containsWhiteSpace = name.includes(' ');
    if (containsWhiteSpace) {
        const splittedName = name.split(' ');
        return splittedName[0].charAt(0).toUpperCase() + splittedName[1].charAt(0).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};
