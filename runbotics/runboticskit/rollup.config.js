import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

const projectPath = '/runboticskit';

const entryFilePath = `./src/index.tsx`;

const packageJson = require('./package.json');
const typeScriptPluginOptions = { useTsconfigDeclarationDir: true };

typeScriptPluginOptions.tsconfigOverride = {
    files: [ entryFilePath ],
    include: [ `${projectPath}/*.ts`, `${projectPath}/src/**/*.ts`, `${projectPath}/src/**/*.tsx` ],
    exclude: [],
};

export default {
    input: 'src/index.tsx',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript(typeScriptPluginOptions),
        postcss(),
        copy({
            targets: [
                {
                    src: 'src/variables.scss',
                    dest: 'build',
                    rename: 'variables.scss',
                },
                {
                    src: 'src/typography.scss',
                    dest: 'build',
                    rename: 'typography.scss',
                },
            ],
        }),
    ],
};
