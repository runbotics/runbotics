import { OptionsWithInfo } from './DraftJSWidget.types';

export const isInfoTooltip = (
    options: OptionsWithInfo | {}
): options is OptionsWithInfo => typeof (options as OptionsWithInfo).info === 'string';
