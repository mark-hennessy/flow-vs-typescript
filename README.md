# Flow vs. Typescript
This is a sandbox app created to experiment with various JavaScript technologies. 

The main goal was to compare ES6/Flow and Typescript.

The secondary goals were to experiment with:

* Build tools
* NPM dependency management
* Linting tools
* Unit testing frameworks
* Code coverage tools
* Generating javadoc style documentation for JavaScript
* IDE integration

## Dependencies
NPM dependencies are documented [here](docs/dependencies.md)

## Notable NPM Scripts
* `eslint` Runs ESLint against all '.js' files in the project
* `tslint` Runs TSLinting against all '.ts' files in the project
* `test` Runs unit tests
* `test:cov` Runs unit tests and generates code coverage reports
* `docs:js` Generates a "javadoc style" website for JavaScript files
* `docs:ts` Generates a "javadoc style" website for TypeScript files
* `babel` Uses Babel to transpile ES6 to ES5
* `webpack:es5` Uses Webpack to bundle the app into a single file
  * Configuration is set to use Babel to remove Flow type annotations
  * Configuration is set to use Babel to transpile ES6 to ES5
* `webpack:es5:binary` Uses Webpack to bundle the app into a single file
  * Configuration is set to use Babel to remove Flow type annotations
  * Configuration is set to use Babel to transpile ES6 to ES5
  * Configuration is set to use UglifyJS to minify and obfuscate output
* `webpack:es6` Uses Webpack to bundle the app into a single file
  * Configuration is set to remove Flow type annotations without using Babel
  * Configuration is set to preserve ES6 syntax by not using Babel
* `rollup:es5` Uses Rollup to bundle the app into a single file 
  * Configuration is set to use Babel to remove Flow type annotations
  * Configuration is set to use Babel to transpile ES6 to ES5
* `rollup:es5:binary` Uses Rollup to bundle the app into a single file
  * Configuration is set to use Babel to remove Flow type annotations
  * Configuration is set to use Babel to transpile ES6 to ES5
  * Configuration is set to use UglifyJS to minify and obfuscate output
* `rollup:es6` Uses Rollup to bundle the app into a single file
  * Configuration is set to remove Flow type annotations without using Babel
  * Configuration is set to preserve ES6 syntax by not using Babel

## IntelliJ Setup
IntelliJ setup instructions are documented [here](docs/intellijSetup.md)

## License & copyright
© Mark Hennessy

Licensed under the [MIT License](LICENSE)
