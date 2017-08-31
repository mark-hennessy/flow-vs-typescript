# IntelliJ Setup
The following IntelliJ setup is recommended. It's possible to setup the project in other IDEs,
but some IDEs may lack support for Java.

## Project Import
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
which may lead to the "src" folder not showing up in IntelliJ's Project view.

3. Select 1.8 as the Project SDK
4. Next > Finish

## IntelliJ Plugin Installation
Preferences > Plugins

### Required plugins:
* EditorConfig
* tslint

### Optional plugins:
* NodeJS
  * Click the "Install JetBrains plugin..." button and find it in the menu

## Java Setup
Java setup is necessary because this project contains some Java 8 code for reference.

### Set Source Directory
Right click the "src" folder > "Mark Directory as" > "Sources Root"

### Project Structure
Project Settings > Project
* Project SDK: 1.8
* Project language level: 8

## JavaScript Setup
IntelliJ supports JavaScript natively, but there is some light setup needed.

### Flow
Preferences > Languages & Frameworks > JavaScript

* JavaScript language version: Flow
* Flow executable: absolute path to node_modules/.bin/flow

In the "Use Flow server for" section
* Type checking: checked
* Navigation, code completion, and type hinting: checked
* Code highlighting and built-in inspections: unchecked
  * This is unchecked for performance reasons

### ESLint
Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
* Enable: checked

## TypeScript Setup
TypeScript setup is as simple as checking that the TypeScript compiler and TSLint are enabled.

### Compiler
Preferences > Languages & Frameworks > TypeScript
* Enable TypeScript Compiler: checked
  * Track changes: checked

### TSLint
Preferences > Languages & Frameworks > TypeScript > TSLint
* Enabled: checked

## Code Style
IntelliJ code style needs to be configured so that auto-formatting does not conflict with linters.

### EditorConfig
Preferences > Editor > Code Style

In the "EditorConfig" section
* Enable EditorConfig support: checked

### Spacing
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

### Trailing Spaces
The following IntelliJ settings work well with an ESLint rule that warns about trailing whitespace 
on blank lines.

Preferences > Editor > General

In the "Other" section
* Strip trailing spaces on Save: Modified lines
  * Always keep trailing spaces on caret line: checked

## Custom JavaScript Auto-Formatting Rules
Preferences > Editor > Code Style > JavaScript

On the "Spaces" tab

In the "Within" section
* Object literal braces: checked
* ES6 import/export braces: checked

## NPM Scripts - IntelliJ
NPM scripts can be executed from within IntelliJ if the NodeJS plugin is installed.

Steps:
1. Right click on or within the package.json file
2. Select "Show npm Scripts"
3. Select any script in the "npm" view to run it

Note that many scripts are optional since IntelliJ already has integrations for 
linting tools, unit testing tools, flow, typescript compilation etc.
