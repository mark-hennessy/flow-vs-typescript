/**
 * Function declarations for SpiderMonkey, i.e. Mozilla's JavaScript engine,
 * which is what codingame uses to run JavaScript.
 * These functions will be globally available in the codingame editor, but we need
 * declarations so that our code compiles in IDEs such as IntelliJ.
 */
declare function readline(): string;
declare function print(message: string): void;
declare function printErr(error: string): void;
