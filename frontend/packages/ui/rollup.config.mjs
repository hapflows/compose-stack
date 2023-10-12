import cleaner from 'rollup-plugin-cleaner';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// To visualize the bundle
import { visualizer } from 'rollup-plugin-visualizer';

// Libraries used that should not be bundled.
// These are installed with optionalDependencies.
const externals = [
  'focus-trap-react',
  'react',
  'react-dom',
  'react-select',
  'react-select/creatable',
  'react-transition-group',
];

const configuration = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    cleaner({
      targets: ['./build_stats'],
    }),
    peerDepsExternal(),
    resolve(),
    commonjs({
      exclude: 'src/**',
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    visualizer({ filename: './build_stats/bundle.html' }),
    terser(),
  ],
  // @babel/runtime has a long id, doing as
  // suggested in docs.
  external: (id) => id.includes('@babel/runtime') || externals.includes(id),
};

const typesConfiguration = {
  input: 'dist/esm/types/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'esm' }],
  external: [/\.css$/, /\.scss$/],
  plugins: [dts()],
};

export default [configuration, typesConfiguration];
