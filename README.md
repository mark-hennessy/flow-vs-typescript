# Flow vs. Typescript
This is just a sandbox app that I used to experiment with various JavaScript technologies. 

My main goal was to compare ES6/Flow and Typescript.

My secondary goals were to experiment with:

* Build tools
* NPM dependency management
* Linting tools
* Unit testing frameworks
* Code coverage tools
* Generating javadoc style documentation for JavaScript
* IDE integration

## General Setup
General setup needed to get the project up and running in the terminal and in IDEs.

### NodeJS
NodeJS is needed to run JS outside of the browser, interact with the OS and filesystem, and manage dependencies.

Install NodeJS from nodejs.org.
This will also install the npm command, which is needed to install and manage dependencies.

### Yarn
Yarn is a popular alternative to the npm command because it's faster and has better default behavior.
Using Yarn is optional but highly recommended.

Installation instructions can be found online at yarnpkg.com.

### Dependencies
Open your terminal, change to the root project directory, and run the following command:
```
yarn install
```
This is equivalent to the slower and less preferred
```
npm install
```
Either of these commands will install the project's dependencies as defined in the package.json file.

## IntelliJ Setup
The following IntelliJ setup is recommended. It's possible to setup the project in other IDEs,
but some IDEs may lack support for Java.

### Plugins
Required plugins:
* EditorConfig
* tslint

Optional plugins:
* NodeJS, found in the "Install JetBrains plugin..." menu

### Java Setup
Java setup is necessary because this project contains some Java 8 code for reference.

#### Set Source Directory
Right click the "src" folder > "Mark Directory as" > "Sources Root"

#### Project Structure
Project Settings > Project
* Project SDK: 1.8
* Project language level: 8
* Project compiler output: flow-vs-typescript/out

### JavaScript Setup
#### Flow
Preferences > Languages & Frameworks > JavaScript
JavaScript language version: Flow

Use Flow server for:
* Type checking: checked
* Navigation, code completion, and type hinting: checked
* Code highlighting and built-in inspections: unchecked
  * This is unchecked because it slows down IntelliJ

#### Type Declarations
Preferences > Languages & Frameworks > JavaScript > Libraries
* SpiderMonkey should already be in the list and enabled because
the project contains a file called SpiderMonkey.d.ts

#### ESLint
Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
* Enable: checked

### TypeScript Setup
#### Compiler
Preferences > Languages & Frameworks > TypeScript
* Enable TypeScript Compiler: checked
  * Track changes: checked

#### TSLint
Preferences > Languages & Frameworks > TypeScript > TSLint
* Enabled: checked

### Code Style
#### Spacing
Indentation should be set to 2 spaces since this is recommended by the airbnb style guide.
https://github.com/airbnb/javascript#whitespace

Spacing should automatically be configured by the EditorConfig plugin, 
which will read settings from the .editorconfig file.

#### Trailing Spaces
There is an eslint rule that warns about trailing whitespace even on blank lines. 
I recommend the following IntelliJ settings to complement the eslint rule:

Preferences > Editor > General > Other
* Strip trailing spaces on Save: Modified lines
  * Always keep trailing spaces on caret line: checked

### Custom JavaScript Auto-Formatting Rules
Preferences > Editor > Code Style > JavaScript > Spaces > Within
* Object literal braces
* ES6 import/export braces

## Build
All of the project's build scripts as defined in the package.json file as npm scripts.

Most scripts are optional since IntelliJ already has integrations for linting tools, unit testing tools, 
flow, typescript compilation etc.

Notable scripts that IntelliJ won't execute for you are:
* `test:cov`: Generates code coverage reports
* `babel`: Uses Babel to transpile ES6 to ES5
* `webpack`: Uses Webpack to bundle the app into a single file
* `docs:js`: Generates a javadoc style website for JavaScript files
* `docs:ts`: Generates a javadoc style website for TypeScript files

Scripts can be executed from within IntelliJ by double clicking tasks in the "npm" view.
Note that this may require the NodeJS plugin for IntelliJ.

Scripts can also be executed in the terminal using
```
yarn run taskName
```
or alternatively
```
npm run taskName
```

## License & copyright
© Mark Hennessy

Licensed under the [MIT License](LICENSE).
