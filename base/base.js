// @ts-nocheck
/* tslint:disable */

const tslintConfig = require('./tslint.json')
const hasPrettier = require('../hasPrettier')()

function getPrettierRules() {
  return {
    align: [false, 'arguments', 'parameters'],
    'array-bracket-spacing': [false, 'never'],
    'arrow-parens': false,
    'block-spacing': [false, 'always'],
    'brace-style': [false, '1tbs', { allowSingleLine: true }],
    'conditional-expression-parens': false,
    eofline: false,
    'import-destructuring-spacing': false,
    'import-spacing': false,
    indent: [false, 'spaces', 2],
    'jsx-alignment': false,
    'jsx-attribute-spacing': [false, 'never'],
    'jsx-curly-spacing': [false, 'never'],
    'jsx-equals-spacing': [false, 'never'],
    'jsx-no-multiline-js': false,
    'jsx-wrap-multiline': false,
    'linebreak-style': [false, 'LF'],
    'literal-spacing': [false, { array: ['never'], object: ['never'], import: ['never'] }],
    'max-line-length': [false, 140],
    'multiline-arrow': false,
    'new-parens': false,
    'newline-per-chained-call': false,
    'no-consecutive-blank-lines': [false, 1],
    'no-empty-line-after-opening-brace': false,
    'no-irregular-whitespace': false,
    'no-multi-spaces': [false, { ignoreEOLComments: false, exceptions: {} }],
    'no-semicolon-interface': false,
    'no-trailing-whitespace': false,
    'no-unnecessary-parens-for-arrow-function-arguments': false,
    'no-unnecessary-semicolons': false,
    'number-literal-format': false,
    'object-curly-spacing': false,
    'object-literal-key-quotes': false,
    'one-line': [false, 'check-open-brace', 'check-whitespace', 'check-else', 'check-catch', 'check-finally'],
    quotemark: [false, 'single', 'avoid-template', 'avoid-escape'],
    'react-tsx-curly-spacing': false,
    semicolon: [false, 'never', 'strict-bound-class-methods'],
    'space-before-function-paren': [
      false,
      { anonymous: 'never', named: 'never', asyncArrow: 'always', method: 'never', constructor: 'never' }
    ],
    'space-in-parens': false,
    'space-within-parens': false,
    'ter-arrow-parens': false,
    'ter-arrow-spacing': false,
    'ter-computed-property-spacing': false,
    'ter-func-call-spacing': false,
    'ter-indent': false,
    'ter-max-len': false,
    'ter-no-irregular-whitespace': false,
    'ter-no-tabs': false,
    'ter-padded-blocks': false,
    'trailing-comma': false,
    'typedef-whitespace': false,
    whitespace: false
  }
}

function moduleExists(moduleName) {
  try {
    return !!require.resolve(moduleName)
  } catch (e) {
    return false
  }
}

function getConfig() {
  const tsRules = hasPrettier
    ? {
        ...tslintConfig.rules,
        ...getPrettierRules()
      }
    : tslintConfig.rules

  const tslintModules = ['tslint:latest']

  if (moduleExists('tslint-react')) {
    tslintModules.push('tslint-react')
  }

  if (moduleExists('tslint-microsoft-contrib')) {
    tslintModules.push('tslint-microsoft-contrib')
  }

  if (moduleExists('tslint-eslint-rules')) {
    tslintModules.push('tslint-eslint-rules')
    if (!hasPrettier) {
      tsRules['no-extra-semi'] = true
    }
  }

  return {
    extends: tslintModules,
    rules: tsRules,
    jsRules: {
      ...tsRules,
      ...tslintConfig.jsRules
    }
  }
}

module.exports = getConfig()
