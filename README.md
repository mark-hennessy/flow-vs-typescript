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

## IntelliJ Setup

### Plugins
Required plugins:
* EditorConfig
* tslint

Optional plugins:
* NodeJS, found in the "Install JetBrains plugin..." menu

### Java Setup
Java setup is necessary because this project contains some Java8 code for reference.

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

## License & copyright
© Mark Hennessy

Licensed under the [MIT License](LICENSE).
