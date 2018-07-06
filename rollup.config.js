import babel from 'rollup-plugin-babel';

export default [
  {
    input: './index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],

    output: {
      file: 'lib/index.js',
      format: 'cjs',
    },
  },
  {
    input: './index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],

    output: {
      file: 'lib/index.es.js',
      format: 'es',
    },
  },
];
