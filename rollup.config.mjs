import typescript from '@rollup/plugin-typescript';
import externals from 'rollup-plugin-node-externals';
import execute from 'rollup-plugin-shell';

/**
 * @type {Array<import('rollup').RollupOptions>}
 */
const config = [
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/index.cjs',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: './dist/index.mjs',
        format: 'esm',
        exports: 'named'
      }
    ],
    plugins: [
      typescript(),
      externals({
        deps: true,
        devDeps: true,
        optDeps: true,
        peerDeps: true
      }),
      execute({
        hook: 'closeBundle',
        commands: ['yarn run generate:dts']
      })
    ]
  }
];

export default config;
