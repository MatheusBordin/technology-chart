import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: `dist/index.min.js`,
            format: 'umd',
            name: 'TechnologyChart',
        },
    ],
    plugins: [
        resolve(),
        typescript({
            typescript: require('typescript'),
        }),
        json({
            preferConst: true,
            compact: true,
        })
    ],
}
