import gulp from 'gulp';
import { env, noop } from 'gulp-util';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import rev from 'gulp-rev';

import { DIST_ROOT } from '../constants';
import { POLYFILLS_CONFIG } from '../config/rollup.config';
import { CompileError } from '../utils';

gulp.task('polyfills', () => {
  return rollup(POLYFILLS_CONFIG)
    .on('error', CompileError.handle)
    .pipe(source('polyfills.js'))
    .pipe(buffer())
    .pipe(env.mode === 'prod' ? rev() : noop())
    .pipe(gulp.dest(DIST_ROOT))
});
