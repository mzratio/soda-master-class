const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

const gulp = require('gulp')
const gutil = require('gulp-util')
const babel = require('gulp-babel')
const debug = require('gulp-debug')
const del = require('del')

const owner = process.env.OWNER
const stage = process.env.STAGE || 'dev'
const accountid = process.env.ACCOUNTID
const serviceName = process.env.SERVICE_NAME

const sourceFiles = ['./src/**/*.js', './src/**/*.json']
const nodeModules = './node_modules'
const serverlessFiles = './src/*.yml'
const distFolder = './dist'

gutil.log('build settings:')
gutil.log('owner ', owner)
gutil.log('stage ', stage)
gutil.log('accountid ', accountid)
gutil.log('serviceName ', serviceName)

gulp.task('transpile', ['clean'], () => {
  return gulp.src(sourceFiles)
    .pipe(debug({ title: 'source files:' }))
    .pipe(babel())
    .pipe(gulp.dest(distFolder))
})

gulp.task('copy-package-json', ['transpile'], () => {
  return gulp.src('./package.json')
    .pipe(gulp.dest(distFolder))
})

gulp.task('copy-serverless-config', ['transpile'], () => {
  return gulp.src(serverlessFiles)
    .pipe(gulp.dest(distFolder))
})

// allow symlinked dependencies to be copied (eases testing of 'npm link'ed libraries)
gulp.task('copy-node-modules', ['transpile'], (cb) => {
  fse.copy(nodeModules, `${distFolder}/node_modules`, {
    dereference: true,
    filter: (filename) => {
      return (filename.indexOf('/.bin/') === -1)
    }
  }, (err) => {
    if (err) { return cb(err) }
    cb()
  })
})

gulp.task('clean', () => {
  return del.sync(distFolder)
})

gulp.task('default', ['build'])
gulp.task('build', ['clean', 'transpile', 'copy-package-json', 'copy-serverless-config', 'copy-node-modules'])
