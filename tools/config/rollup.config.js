import { join } from 'path';
import util from 'gulp-util';
import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss';
import comment from 'postcss-comment';
import postcssimport from 'postcss-import';
import cssnext from 'postcss-cssnext';
import rucksack from 'rucksack-css';
import modules from 'postcss-modules';
import cssnano from 'cssnano';
import image from 'rollup-plugin-image';
import json from 'rollup-plugin-json';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

import { SOURCE_ROOT } from '../constants';

const primaryPlugins = () => {
  const htmlplugin = () => {
    return html({
      htmlMinifierOptions: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    });
  };

  const cssplugin = () => {
    const cssExportMap = {};
    return postcss({
      parser: comment,
      plugins: [
        postcssimport(),
        cssnext({ warnForDuplicates: false }),
        rucksack({ autoprefixer: true }),
        modules({ getJSON(id, tokens) { cssExportMap[id] = tokens; } }),
        cssnano()
      ],
      getExport(id) { return cssExportMap[id]; }
    });
  };

  return [
    htmlplugin(),
    cssplugin(),
    image(),
    json(),
    globals(),
    builtins(),
    resolve({ jsnext: true, browser: true }),
    commonjs({
      include: [
        'node_modules/lodash-es/**',
        'node_modules/@reactivex/rxjs/dist/es6/**',
        'node_modules/redux/es/**',
        'node_modules/redux-observable/lib/**'
      ]
    }),
    babel({
      babelrc: false,
      presets: [['latest', { es2015: { modules: false } }]],
      plugins: ['external-helpers'],
      exclude: 'node_modules/**'
    }),
    (util.env.type === 'prod' ? uglify() : util.noop())
  ];
};

const secondaryPlugins = [
  postcss({ plugins: [cssnano()] }),
  globals(),
  builtins(),
  resolve({ jsnext: true, browser: true }),
  commonjs(),
  replace({ eval: '[eval][0]' }),
  uglify()
];

export const APP_CONFIG = {
  entry: join(SOURCE_ROOT, 'app.js'),
  format: 'iife',
  context: 'window',
  sourceMap: util.env.type === 'dev' && true,
  plugins: primaryPlugins()
};

export const TEST_CONFIG = {
  format: 'iife',
  context: 'window',
  sourceMap: 'inline',
  plugins: primaryPlugins()
};

export const VENDOR_CONFIG = {
  entry: join(SOURCE_ROOT, 'vendor.js'),
  context: 'window',
  plugins: secondaryPlugins
};

export const POLYFILLS_CONFIG = {
  entry: join(SOURCE_ROOT, 'polyfills.js'),
  context: 'window',
  plugins: secondaryPlugins
};