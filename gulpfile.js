const fse = require('fs-extra')

const gulp = require('gulp')
const gutil = require('gulp-util')
const babel = require('gulp-babel')
const debug = require('gulp-debug')
const del = require('del')
const gzip = require('gulp-zip')
const grelease = require('gulp-github-release')
const moment = require('moment')

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

/* ------ BUILD TASKS ------*/
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

/* ------ BUILD TASKS ------*/

/* ------ RELEASE MANAGEMENT TASKS ------ */
const ciBuildNum = process.env.CIRCLE_BUILD_NUM || 'DEV'
console.log('Build #: ', ciBuildNum)

const ciBranch = process.env.CIRCLE_BRANCH || 'dev'
console.log('Branch: ', ciBranch)

const release = '#' + ciBuildNum + '_' + ciBranch + '_' + (moment().utc().format('YYYYMMDDHHmm'))
console.log('Release: ' + release)

const releaseZipFilename = 'artifacts.zip'
console.log(releaseZipFilename)

gulp.task('zip-dist', () => {
  return gulp.src(['./dist/**'])
    .pipe(gzip(releaseZipFilename))
    .pipe(gulp.dest('./dist'))
})

gulp.task('release-github', ['zip-dist'], () => {
  return gulp.src(['./dist/*.zip'])
    .pipe(grelease({
      token: undefined,                    // or you can set an env var called GITHUB_TOKEN instead
      owner: undefined,                    // if missing, it will be extracted from manifest (the repository.url field)
      repo: undefined,                     // if missing, it will be extracted from manifest (the repository.url field)
      target_commitish: 'master',           // if missing, the default branch will be used
      tag: release,                        // if missing, the version will be extracted from manifest and prepended by a 'v'
      name: release,                       // if missing, it will be the same as the tag
      // notes: 'very good!',              // if missing it will be left undefined
      draft: false,                        // if missing it's false
      prerelease: true,                    // if missing it's false
      manifest: require('./package.json'), // package.json from which default values will be extracted if they're missing
      skipAssetChecks: true
    }))
})
gulp.task('release', ['zip-dist', 'release-github'])

/* ------ RELEASE MANAGEMENT TASKS ------ */
