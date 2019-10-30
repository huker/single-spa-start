import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/single-spa.js',
    output: {
        file: './lib/umd/single-spa.js',
        format: 'umd',
        name: 'singleSpaStart',
        sourcemap: true
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({ exclude: 'node_modules/**' }),
        // 相当于webpack里的devserver
        // 环境变量里有的时候才启动这个插件
        process.env.SERVE ? serve({
            open: true,
            contentBase: '',
            openPage: '/toutrial/index.html',
            host: 'localhost',
            port: '3001'
        }) : null
    ]
}