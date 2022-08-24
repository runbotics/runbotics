// import { browser } from 'webextension-polyfill-ts';

export class FieldResolver {
    public static resolveAsyncFields = async (
        object: Record<string, any | Promise<any>>,
    ): Promise<Record<string, any>> => {
        const cloned = { ...object };
        for (let [key, value] of Object.entries(object)) {
            if (value && value instanceof Promise) {
                cloned[key] = await value;
            }
        }

        return cloned;
    };

    public static resolveFields = async (object: Record<string, any | Promise<any>>): Promise<Record<string, any>> => {
        let cloned = await FieldResolver.resolveAsyncFields(object);
        // for (let [key, value] of Object.entries(object)) {
        //     if(value && value.type === 'secret') {
        //         const result = await browser.storage.local.get(value.key)
        //         cloned[key] = result[value.key]
        //     } else if(value && value.type === 'storage') {
        //         const result = await browser.storage.local.get(value.key)
        //         cloned[key] = result[value.key]
        //     }
        // }

        return cloned;
    };
}
