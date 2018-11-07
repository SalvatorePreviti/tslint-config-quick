const fs = require('fs')
const getRootPath = require('./getRootPath')

/** @type {boolean?} */
let hasPrettierCache

/**
 * Check wether prettier is present in the main package.json
 *
 * @returns {boolean} True if prettier is present in the main package.json
 */
function hasPrettier() {
  if (hasPrettierCache === true || hasPrettierCache === false) {
    return hasPrettierCache
  }
  hasPrettierCache = false
  try {
    const requireOptions = { paths: [getRootPath()] }
    const manifestPath = require.resolve('./package.json', requireOptions)
    const manifest = JSON.parse(fs.readFileSync(manifestPath).toString())
    if ((manifest.devDependencies && manifest.devDependencies.prettier) || (manifest.dependencies && manifest.dependencies.prettier)) {
      if (require.resolve('prettier', requireOptions)) {
        hasPrettierCache = true
      }
    }
  } catch (e) {
    // Ignore error
  }
  return hasPrettierCache
}

module.exports = hasPrettier
