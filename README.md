# Flow vs. Typescript
This is a sandbox app that I used to experiment with various JavaScript technologies. 

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

### Project Import
There are a couple options for importing the project into IntelliJ.

Option A:
1. Select "Open"
2. Find and select the project directory
3. Manually mark the "src" directory as the "Sources Root" as described in the Java Setup section
4. Manually set the Project SDK and language level to Java 8 as described in the Java Setup section

Option B:
1. Import/Create a new project from existing sources
2. Keep the default settings and click Next 5 times

Note: Avoid clicking the Previous button as that can cause the wizard to skip the module import step, 
which would lead to the "src" folder not showing up in IntelliJ's Project view.

3. Select 1.8 as the Project SDK
4. Next > Finish

### IntelliJ Plugin Installation
Preferences > Plugins

Required plugins:
* EditorConfig
* tslint

Optional plugins:
* NodeJS
  * Click the "Install JetBrains plugin..." button and find it in the menu

### Java Setup
Java setup is necessary because this project contains some Java 8 code for reference.

#### Set Source Directory
Right click the "src" folder > "Mark Directory as" > "Sources Root"

#### Project Structure
Project Settings > Project
* Project SDK: 1.8
* Project language level: 8

### JavaScript Setup
IntelliJ supports JavaScript natively, but there is some light setup needed for Flow and ESLint.

#### Flow
Preferences > Languages & Frameworks > JavaScript

* JavaScript language version: Flow
* Flow executable: absolute path to node_modules/.bin/flow

In the "Use Flow server for" section
* Type checking: checked
* Navigation, code completion, and type hinting: checked
* Code highlighting and built-in inspections: unchecked
  * This is unchecked for performance reasons

#### ESLint
Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
* Enable: checked

### TypeScript Setup
TypeScript setup is as simple as checking that the TypeScript compiler and TSLint are enabled.

#### Compiler
Preferences > Languages & Frameworks > TypeScript
* Enable TypeScript Compiler: checked
  * Track changes: checked

#### TSLint
Preferences > Languages & Frameworks > TypeScript > TSLint
* Enabled: checked

### Code Style
IntelliJ code style needs to be configured so that auto-formatting does not conflict with linters.

#### EditorConfig
Preferences > Editor > Code Style

In the "EditorConfig" section
* Enable EditorConfig support: checked

#### Spacing
Indentation should be set to 2 spaces since this is recommended by the airbnb style guide.
https://github.com/airbnb/javascript#whitespace

Spacing should be automatically configured by the EditorConfig plugin, 
which will read settings from the .editorconfig file.

Verify that IntelliJ is using the following settings for spacing:

Preferences > Editor > Code Style > JavaScript

On the "Tabs and Indents" tab

* Use tab character: unchecked
* Tab size: 2
* Indent: 2
* Continuation indent: 4

#### Trailing Spaces
There is an ESLint rule that warns about trailing whitespace even on blank lines. 
I recommend the following IntelliJ settings to complement the eslint rule:

Preferences > Editor > General

In the "Other" section
* Strip trailing spaces on Save: Modified lines
  * Always keep trailing spaces on caret line: checked

### Custom JavaScript Auto-Formatting Rules
Preferences > Editor > Code Style > JavaScript

On the "Spaces" tab

In the "Within" section
* Object literal braces: checked
* ES6 import/export braces: checked

## Build
All of the project's build scripts as defined in the package.json file as npm scripts.

Most scripts are optional since IntelliJ already has integrations for linting tools, unit testing tools, 
flow, typescript compilation etc.

Notable scripts that IntelliJ won't execute for you are:
* `babel`: Uses Babel to transpile ES6 to ES5
* `webpack`: Uses Webpack to bundle the app into a single file
* `test:cov`: Generates code coverage reports
* `docs:js`: Generates a javadoc style website for JavaScript files
* `docs:ts`: Generates a javadoc style website for TypeScript files

### Run Tasks in IntelliJ
Scripts can be executed from within IntelliJ if the NodeJS plugin is installed.

Steps:
1. Right click on or within the package.json file
2. Select "Show npm Scripts"
3. Select any task in the "npm" view to run it

### Run Tasks in Terminal
Scripts can be executed in the terminal using
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
