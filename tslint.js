/* eslint-disable jsx-a11y/href-no-hash */
module.exports = {
  // https://www.npmjs.com/package/tslint-config-airbnb
  extends: 'tslint-config-airbnb',
  rules: {
    // Configure when type definitions are required and when not.
    typedef: [
      true,
      'call-signature',
      'parameter',
      'property-declaration',
      'member-variable-declaration',
      'object-destructuring',
      'array-destructuring',
    ],
    // Enforce that there should be no space to the left of a colon and exactly 1 space after.
    'typedef-whitespace': [
      true,
      {
        'call-signature': 'nospace',
        'index-signature': 'nospace',
        parameter: 'nospace',
        'property-declaration': 'nospace',
        'variable-declaration': 'nospace',
      },
      {
        'call-signature': 'onespace',
        'index-signature': 'onespace',
        parameter: 'onespace',
        'property-declaration': 'onespace',
        'variable-declaration': 'onespace',
      },
    ],
    // Checks variable names for various errors.
    'variable-name': [
      true,
      'ban-keywords',
      'check-format',
      'allow-pascal-case',
    ],
    // Requires the radix parameter to be specified when calling parseInt.
    // This is disabled because a radix isn't always needed.
    radix: false,
    // Applies a naming convention to function names and method names.
    // This is disabled because it warns about signatures in type definition files.
    'function-name': false,
    // Allow i++ and i--
    'no-increment-decrement': false,
  },
};
