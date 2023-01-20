import { ById } from '../../utils/dictionary';
import moment from 'moment';
import { WebDriver } from 'selenium-webdriver';

export const RunIndex = async (session: WebDriver, json: string) => {
    const result = await session.executeScript(
        async function ([json]) {
            return {};
        },
        [json],
    );

    return result['rows'];
};
