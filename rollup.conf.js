import { join } from 'path';

import util from 'gulp-util';

import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss';
import comment from 'postcss-comment';
import modules from 'postcss-modules';
import cssnext from 'postcss-cssnext';
import rucksack from 'rucksack-css';
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

let cssExportMap = {};
export const APP_CONFIG = [
  html({
    htmlMinifierOptions: {
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true
    }
  }),
  postcss({
    parser: comment,
    plugins: [
      cssnext({
        warnForDuplicates: false
      }),
      rucksack({
        fallbacks: false,
        autoprefixer: true
      }),
      modules({
        getJSON(id, tokens) {
          cssExportMap[id] = tokens;
        }
      }),
      cssnano()
    ],
    getExport(id) {
      return cssExportMap[id];
    }
  }),
  image(),
  json(),
  globals(),
  builtins(),
  resolve({
    jsnext: true, browser: true
  }),
  commonjs(),
  babel({
    presets: [['latest', { 'es2015': { 'modules': false } }]],
    plugins: ['external-helpers'],
    exclude: 'node_modules/**',
    babelrc: false
  }),
  (util.env.type === 'prod' ? uglify() : util.noop())
];

export const VENDOR_CONFIG = {
  entry: join(__dirname, 'src', 'vendor.js'),
  context: 'window',
  plugins: [
    postcss({ plugins: [cssnano()] }),
    globals(),
    builtins(),
    resolve({ jsnext: true, browser: true }),
    commonjs(),
    replace({ eval: '[eval][0]' }),
    uglify()
  ]
};

export const POLYFILLS_CONFIG = {
  entry: join(__dirname, 'src', 'polyfills.js'),
  context: 'window',
  plugins: [
    globals(),
    builtins(),
    resolve({ jsnext: true, browser: true }),
    commonjs(),
    uglify()
  ]
};
