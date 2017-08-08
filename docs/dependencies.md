# Dependency Manifest
This document lists and explains the dependencies defined in package.json. Hopefully this will make it easier to identify and remove obsolete dependencies in the future.

## Dev Dependencies
This section lists dependencies needed only during development to help developers lint, test, transpile, obfuscate, bundle, build, etc.

### Type Definitions
The project depends on a handful of third-party type definitions to improve the development experience.

* @types/jest
* @types/react
* @types/react-dom

### Babel
Babel is used to transpile new versions of JavaScript to older versions with better cross browser compatibility. Support for bleeding edge JavaScript can be configured via plugins and presets. Presets are simply groupings of plugins so that the plugins don't need to be referenced individually. 

#### babel-preset-es2015
Babel preset for all ES2015/ES6 plugins.

#### babel-preset-stage-2
Babel preset for JavaScript features which are not yet officially part of the specification. Stage 2 features are still in the draft stages but are fairly finalized. An eventual inclusion of the feature in the standard is likely.

This preset is needed because TypeScript is an early adopter of Stage 2 features. At the time of adding, this preset was needed to support class property initialization.

#### babili
An ES6+ aware minifier based on the Babel toolchain. Tools to minify/obfuscate/mangle code only work if they can understand the code.

The project uses this to reduce file sizes so that pages load faster.

### Jest
The project uses Jest as its JavaScript unit testing framework. Jest has out-of-the-box support for React, headless DOM testing, and code coverage reporting. It also has a watch mode feature which will run relevant unit tests as code changes are made.

#### jest
The core Jest dependency.

#### ts-jest
A preprocessor with sourcemap support to help use TypeScript with Jest.

### React
A JavaScript library for building user interfaces.

React makes it possible to build simple/stateless user interfaces that can be efficiently "re-rendered" anytime something changes. React uses a state of the art diffing algorithm to determine the minimal set of batched DOM operations needed to get from state A to state B.

#### react
Core React dependency needed in order to define React components.

#### react-dom
React dependency for rendering to the DOM.

This dependency includes functions such as: ReactDOM.render, ReactDOM.unmountComponentAtNode, and ReactDOM.findDOMNode

### Rollup
Next-generation ES6 module bundler. 

Rollup is used to bundle multiple JavaScript files into a single file. Rollup supports ES6 import/export statements natively and can support CommonJS require statements through plugins. 

Rollup is all about small file sizes. Rollup uses a technique called tree-shaking to remove unused code from the output bundle. 

Rollup is minimalistic. Output is easy to read because Rollup adds very few helper methods to the output bundle.

#### rollup-plugin-babili
Rollup plugin for Babili, which is used to obfuscate ES6 code.

#### rollup-plugin-multi-entry
Rollup plugin that adds support for multiple entry points. The plugin allows patterns and wild cards to be used in file paths so that multiple files can be matched.

### TS Lint
A linting tool for TypeScript. Linting tools aid developers in writing code that adheres to code style rules. Rules can be inherited from other dependencies. Rules can also be added, removed, and modified via config files.

#### tslint
The core TSLint dependency.

#### tslint-config-airbnb
Configures TSLint rules to mimic the Airbnb JavaScript Style Guide.

https://github.com/airbnb/javascript

#### tslint-microsoft-contrib
Adds additional TSLint rules so that code style can configured in more detail. 

#### tsutils
This dependency is needed by other TSLint dependencies. It has utility functions for working with TypeScript's AST.

### TypeScript
Typescript is a typed superset of JavaScript that compiles to plain JavaScript.

#### typescript
The core TypeScript dependency.

## Optional Global Dependencies
This section is for random and optional dependencies that may be installed globally. These dependencies should not be installed as app or dev dependencies because they don't add value to the project.

### Updating Dependencies
To update a single dependency to the latest version, simply change the dependency's version to * and run

```
npm install --save-dev <dependency_name>
```

The npm-check-updates dependency can be used to update each dependency in package.json to latest version. Note that this is risky and should not be done once the project has shipped to customers.

```
npm install -g npm-check-updates
ncu -u
npm install
```

https://www.npmjs.com/package/npm-check-updates

### Alphabetizing Dependencies
The npm-sort dependency can be used to sort package.json dependencies in alphabetical order.

```
npm install npm-sort -g
npm-sort
```

https://www.npmjs.com/package/npm-sort
