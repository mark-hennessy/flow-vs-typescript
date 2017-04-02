const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
  'extends': [
    'airbnb',
    'plugin:jest/recommended',
    'plugin:flowtype/recommended'
  ],
  'plugins': [
    'jest',
    'flowtype'
  ],
  'env': {
    'jest': true
  },
  'rules': {
    'radix': OFF,
    'no-trailing-spaces': OFF,
    'no-underscore-dangle': OFF,
    'flowtype/require-parameter-type': ERROR,
    'flowtype/require-return-type': ERROR,
    'valid-typeof': [
      ERROR,
      {
        'requireStringLiterals': false
      }
    ],
    'flowtype/require-return-type': [
      ERROR,
      {
        'excludeArrowFunctions': true
      }
    ]
  }
}
