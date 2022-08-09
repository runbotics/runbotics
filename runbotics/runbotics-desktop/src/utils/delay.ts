export const SECOND = 1000;

export const MINUTE = 60 * SECOND;

export const delay = (timer: any) => {
    return new Promise<void>((resolve) => {
        setTimeout(function () {
            resolve();
        }, timer);
    });
};
