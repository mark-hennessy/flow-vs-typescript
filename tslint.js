module.exports = {
  extends: 'tslint-config-airbnb',
  rules: {
    typedef: [
      true,
      'call-signature',
      'parameter',
      'property-declaration',
      'member-variable-declaration',
      'object-destructuring',
      'array-destructuring',
    ],
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
    radix: false,
    'function-name': false,
    'no-increment-decrement': false,
  },
};
