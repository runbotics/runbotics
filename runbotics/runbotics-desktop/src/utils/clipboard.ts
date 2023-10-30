'use strict';
import execa from 'execa';
import arch from 'arch';
import { cwd } from 'process';

// Binaries from: https://github.com/sindresorhus/win-clipboard
const winBinaryPath = arch() === 'x64' ?
    `${cwd()}/win-clipboard/clipboard_x86_64-pc-windows.exe` :
    `${cwd()}/win-clipboard/clipboard_i686-pc-windows.exe`;

const clipboardActions = {
    copy: async (options: unknown) => execa(winBinaryPath, ['--copy'], options),
    paste: async (options: unknown) => execa.stdout(winBinaryPath, ['--paste'], options),
    copySync: (options: unknown) => execa.sync(winBinaryPath, ['--copy'], options),
    pasteSync: (options: unknown) => execa.sync(winBinaryPath, ['--paste'], options)
};

const write = async (text: string) => {
    if (typeof text !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof text}`);
    }

    await clipboardActions.copy({input: text});
};

const read = async () => clipboardActions.paste({stripEof: false});

const writeSync = (text: string) => {
    if (typeof text !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof text}`);
    }

    clipboardActions.copySync({input: text});
};

const readSync = () => clipboardActions.pasteSync({stripEof: false}).stdout;

export default {
    write,
    read,
    writeSync,
    readSync,
};
