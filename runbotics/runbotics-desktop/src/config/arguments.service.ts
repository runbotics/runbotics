import { Injectable } from '@nestjs/common';

type Argument = string;

interface Flag {
    name: string;
    value?: string;
}

const sortArguments = (args: Argument[]): Flag[] => {
    const flags: Flag[] = args.reduce((acc, arg) => {
        const isFlag = arg.startsWith('-');
        if (!isFlag) return [...acc];

        const trimmed = arg.replace(/^-+/, '');
        const [name, value] = trimmed.split('=');

        return [...acc, { name, value }];
    }, []);

    return flags;
};

@Injectable()
export class ArgumentsService {
    private readonly args: Argument[];
    private readonly flags: Flag[];

    constructor() {
        this.args = this.getArgs();
        this.flags = sortArguments(this.args);
    }

    getArgs(): Argument[] {
        const argv = process.argv;
        const args: Argument[] = argv.slice(2);
        return args;
    }

    getFlags(): Flag[] {
        return this.flags;
    }

    getFlag(name: string): Flag | undefined {
        return this.flags.find(flag => flag.name === name);
    }

    getFlagValue(name: string): string | undefined {
        const flag = this.getFlag(name);
        return flag?.value;
    }
}