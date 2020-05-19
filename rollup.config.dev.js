import json from 'rollup-plugin-json';
import liverealod from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: `dist/index.min.js`,
            format: 'umd',
            name: 'TechnologyChart',
        },
        {
            file: `preview/technology-chart.min.js`,
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
        }),
        serve('preview'),
        liverealod({
            watch: 'preview',
            verbose: true
        })
    ],
}
