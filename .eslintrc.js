const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
  'extends': [
    'airbnb',
    'plugin:jest/recommended',
    'plugin:flowtype/recommended',
  ],
  'plugins': [
    'jest',
    'flowtype',
  ],
  'env': {
    'jest': true,
  },
  'rules': {
    'radix': OFF,
    'no-trailing-spaces': OFF,
    'no-underscore-dangle': OFF,
    'flowtype/require-parameter-type': ERROR,
    'flowtype/require-return-type': ERROR,
    // These jsx rules were needed to mute an eslint error coming from
    // the latest version of the eslint-plugin-jsx-a11y dependency.
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': ['warn', { 'aspects': ['invalidHref'] }],
    'valid-typeof': [
      ERROR,
      {
        'requireStringLiterals': false,
      },
    ],
    'flowtype/require-return-type': [
      ERROR,
      {
        'excludeArrowFunctions': true,
      },
    ],
    'no-constant-condition': [
      ERROR,
      {
        'checkLoops': false,
      },
    ],
  },
};
