import babel from 'rollup-plugin-babel'
// import fs from 'fs'
import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';


const vendors = []
  // Make all external dependencies to be exclude from rollup
  .concat(
    Object.keys(pkg.dependencies),
    //Object.keys(pkg.peerDependencies),
    // 'rxjs/operators',
    // 'rocketjump-core/utils',
  )


const nonUmdConfig =  [
   'cjs', 'esm'
  ].map(format => ({
  input: {
    'index': 'src/index.js',
  },
  output: [
    {
      dir: 'lib',
      entryFileNames: '[name].[format].js',
      exports: 'named',
      name: 'raw',
      format
    }
  ],
  external: vendors,
  
  plugins: [
    resolve(),
    commonjs(),
    json(),  
    babel({ exclude: [
      'node_modules/**'
    ] }),
    
  ],
}))

const umdConfig = {
  input: {
    'index': 'src/index.js',
  },
  output: [
    {
      dir: 'lib',
      entryFileNames: '[name].[format].js',
      exports: 'named',
      name: 'raw',
      format: 'umd',
    }
  ],
  
  plugins: [
    resolve(),
    commonjs(),
    json(),  
    babel({ exclude: [
      'node_modules/**'
    ] }),
    
  ],
}

export default nonUmdConfig.concat(umdConfig)