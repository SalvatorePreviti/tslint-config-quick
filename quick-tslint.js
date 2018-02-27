#!/usr/bin/env node

/* eslint no-console: 0 */
/* eslint global-require: 0 */

const chalk = require('chalk').default

const spawn = require('child_process').spawn
const appRootPath = require('./lib/appRootPath')
const path = require('path')

class TSLintError extends Error {
  constructor(elapsed) {
    const message = `tslint failed (${elapsed}ms)`
    super(message)
    this.name = this.constructor.name
    this.stack = message
  }
}

const defaultOptions = {
  path: appRootPath,
  stdio: 'inherit',
  formatter: null,
  arguments: [],
  Promise
}

function tslint(options = tslint.defaultOptions, callback = null) {
  let hrtime = process.hrtime()

  if (typeof options !== 'object') {
    if (typeof options === 'function')
      callback = options
    options = tslint.defaultOptions
  }

  if (typeof callback !== 'function') {
    return new options.Promise((resolve, reject) => {
      tslint(options, (error) => (error ? reject(error) : resolve()))
    })
  }

  options = Object.assign({}, tslint.defaultOptions, options)

  const args = [
    require.resolve('tslint/lib/tslint-cli.js'),
    '--project', path.join(appRootPath, 'tsconfig.json'),
    ...options.arguments
  ]

  if (options.stdio === 'inherit') {
    if (chalk.enabled && !options.formatter && args.indexOf('--format') < 0 && args.indexOf('-f') < 0)
      options.formatter = 'stylish'

    console.info(`${chalk.gray('TSLint running...')}\n`)
  }

  if (options.formatter) {
    args.push('-t')
    args.push(options.formatter)
  }

  const child = spawn('node', args, {
    stdio: options.stdio,
    cwd: options.path
  })

  child.on('exit', error => {
    hrtime = process.hrtime(hrtime)
    const elapsed = ((hrtime[0] * 1000) + (hrtime[1] / 1000000)).toFixed(3)
    if (error) {

      if (!(error instanceof Error))
        error = new TSLintError(elapsed)

      if (options.stdio === 'inherit')
        console.error(`${
          chalk.redBright.underline.bold(error.name)}${
          chalk.redBright(':')} ${
          chalk.redBright(error.message)}\n`)

      callback(error)
    } else {
      if (options.stdio === 'inherit')
        console.info(`${chalk.green('TSLint OK')} ${chalk.gray(`(${elapsed}ms)`)}\n`)
      callback(null, elapsed)
    }
  })

  return undefined
}

tslint.TSLintError = TSLintError
tslint.defaultOptions = defaultOptions

if (require.main === module) {
  tslint({
    arguments: [...defaultOptions.arguments, ...process.argv.slice(2)]
  }, (error) => {
    if (error) {
      process.exit(1)
    }
  })
}

module.exports = tslint
