// @flow
/* eslint-disable no-undef,no-console */

/**
 * This code, i.e. the output JS, is meant to be copied into the codingame editor
 * for the Skynet (Medium) puzzle.
 * https://www.codingame.com/training/medium/skynet-revolution-episode-1
 */

const DEBUG_OUTPUT_ENABLED: boolean = false;

const FUNCTION: string = 'function';

const RUNNING_IN_CODINGAME_EDITOR: boolean =
  // Suppress "Flow: identifier 'readline'. Could not resolve name"
  // $FlowFixMe
  typeof readline === FUNCTION
  // Suppress "Flow: identifier 'printErr'. Could not resolve name"
  // $FlowFixMe
  && typeof printErr === FUNCTION;

function output(message: string) {
  console.log(message);
}

function debug(message: string) {
  if (!DEBUG_OUTPUT_ENABLED) {
    return;
  }

  if (RUNNING_IN_CODINGAME_EDITOR) {
    // Suppress "Flow: identifier 'printErr'. Could not resolve name"
    // $FlowFixMe
    printErr(message);
  } else {
    console.warn(message);
  }
}

type comparatorFunc<T> = (a: T, b: T) => number;
class Comparator {

  static compareAscending<T>(selectorFunc: (item: T) => number): comparatorFunc<T> {
    return (a: T, b: T): number => {
      const valueA: number = selectorFunc(a);
      const valueB: number = selectorFunc(b);
      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      }
      return 0;
    };
  }

  static compareDescending<T>(selectorFunc: (item: T) => number): comparatorFunc<T> {
    const compareAscending: comparatorFunc<T> = Comparator.compareAscending(selectorFunc);
    return (a: T, b: T): number => compareAscending(b, a);
  }
}

/**
 * A utility class to read and parse space and newline separated input.
 * Input is parsed left to right and top to bottom.
 * If input on the current row is exhausted, then the scanner moves to the next row.
 */
class Scanner {
  _rowIterator: Iterator<string>;
  _columnIterator: Iterator<string>;

  constructor() {
    this._rowIterator = RUNNING_IN_CODINGAME_EDITOR
      ? Scanner._createOldSchoolInputIterator()
      : Scanner._createFileIterator();
  }

  /**
   * An ES6 generator function. This is basically a factory method for an iterator
   * that will read a new line each iteration.
   *
   * This is commented out because it causes Babel to call helper functions
   * which are only available when bundling babel-polyfill with a tool
   * such as webpack. Having this commented out allows us to copy/paste
   * the Bable output JS file directly into the codingame editor
   * without relying on a bundler such as webpack.
   */
  // static* _createInputIterator(): Iterator<string> {
  //   while (true) {
  //     yield readline();
  //   }
  // }

  // Suppress "Flow: property `@@iterator` of $Iterator. Property not found in object literal
  // $FlowFixMe
  static _createOldSchoolInputIterator(): Iterator<string> {
    return {
      next: () => ({ value: readline(), done: false }),
    };
  }

  /**
   * Creates an iterator to traverse through a file line by line.
   */
  static _createFileIterator(): Iterator<string> {
    // The __dirname variable is not available to codingame, so we have to hide it in this method.
    // It's safe here because codingame does not enter this method.
    const INPUT_DIR: string = `${__dirname}/../input.txt`;
    const ENCODING: string = 'utf8';
    // It would be better to use an ES6 import statement to import the 'fs' module,
    // but import statements must occur at the top of the file...and that would crash
    // codingame because codingame/SpiderMonkey doesn't support ES6 imports yet.
    // We'll just have to settle for an old CommonJS require statement.
    // eslint-disable-next-line global-require
    const fs: any = require('fs');
    return fs.readFileSync(INPUT_DIR, ENCODING).split(/\n/)[Symbol.iterator]();
  }

  nextInt(): number {
    return parseInt(this.next());
  }

  next(): string {
    // if the columnIterator is undefined, then move to the initial row
    if (!this._columnIterator) {
      this.moveToNextRow();
    }

    // get the next value on the current row
    let columnResult: IteratorResult<string, void> = this._columnIterator.next();
    // if the current row is exhausted, then move to the next row
    if (columnResult.done) {
      if (this.moveToNextRow()) {
        columnResult = this._columnIterator.next();
      }
    }

    return columnResult.value || '';
  }

  /**
   * Moves the scanner to the next row.
   *
   * @returns true if the move to the next row was successful
   */
  moveToNextRow(): boolean {
    const rowResult: IteratorResult<string, void> = this._rowIterator.next();
    // if a next row was not found, then exit
    if (rowResult.done) {
      return false;
    }

    const row: string = rowResult.value;
    debug(row);
    // Suppress "Flow: computed property. Element cannot be called with string"
    // $FlowFixMe
    this._columnIterator = row.split(' ')[Symbol.iterator]();
    return true;
  }
}

class Node {
  id: number;
  isExitNode: boolean;

  _connections: Set<Node>;

  constructor(id: number) {
    this.id = id;
    // Everything, even primitives such as numbers and booleans,
    // default to undefined if not initialized with a value.
    this.isExitNode = false;
    this._connections = new Set();
  }

  addConnectionWith(node: Node) {
    this._connections.add(node);
    node._connections.add(this);
  }

  removeConnectionWith(node: Node) {
    this._connections.delete(node);
    node._connections.delete(this);
  }

  get connectionCount(): number {
    return this._connections.size;
  }

  iterator(): Iterator<Node> {
    // Suppress "Flow: call of computed property. Computed property/element cannot be called on Set"
    // $FlowFixMe
    return this._connections[Symbol.iterator]();
  }

  toString(): string {
    return JSON.stringify({
      id: this.id,
      isExitNode: this.isExitNode,
      connectionCount: this._connections.size,
    });
  }
}

class Link {
  _nodeA: Node;
  _nodeB: Node;

  constructor(nodeA: Node, nodeB: Node) {
    this._nodeA = nodeA;
    this._nodeB = nodeB;
  }

  get importance(): number {
    // links between nodes with few connections are more important because
    // severing them is more likely to result in dead-ends.
    return 100 / (this._nodeA.connectionCount + this._nodeB.connectionCount);
  }

  sever() {
    this._nodeA.removeConnectionWith(this._nodeB);

    output(`${this._nodeA.id} ${this._nodeB.id}`);
  }
}

class Path {
  _links: Link[];

  constructor(nodes: Node[]) {
    this._links = [];

    let headNode: Node;
    nodes.forEach((node: Node) => {
      if (headNode) {
        const link: Link = new Link(headNode, node);
        this._links.push(link);
      }

      headNode = node;
    });
  }

  get length(): number {
    return this._links.length;
  }

  sever() {
    if (!this._links.length) {
      return;
    }

    const mostImportantLink: Link = this._links
      .sort(Comparator.compareDescending((link: Link) => link.importance))[0];

    mostImportantLink.sever();
  }
}

class NodeLoader {
  _scanner: Scanner;
  nodeRegistry: Map<number, Node>;

  constructor(scanner: Scanner) {
    this._scanner = scanner;
    this.nodeRegistry = new Map();
  }

  loadInitialNodes() {
    // the total number of nodes in the level, including the gateways
    // eslint-disable-next-line no-unused-vars
    const nodeCount: number = this._scanner.nextInt();
    // the number of links
    const linkCount: number = this._scanner.nextInt();
    // the number of exit gateways
    const exitNodeCount: number = this._scanner.nextInt();

    for (let i: number = 0; i < linkCount; i += 1) {
      // nodeA and nodeB defines a link between these nodes
      const idA: number = this._scanner.nextInt();
      const idB: number = this._scanner.nextInt();
      const nodeA: Node = this.loadNode(idA);
      const nodeB: Node = this.loadNode(idB);
      nodeA.addConnectionWith(nodeB);
    }

    for (let i: number = 0; i < exitNodeCount; i += 1) {
      // the index of a gateway node
      const exitId: number = this._scanner.nextInt();
      const exitNode: Node = this.loadNode(exitId);
      exitNode.isExitNode = true;
    }
  }

  loadNode(nodeId: number): Node {
    let node: ?Node = this.nodeRegistry.get(nodeId);
    if (!node) {
      node = new Node(nodeId);
      this.nodeRegistry.set(nodeId, node);
    }

    return node;
  }
}

class Game {
  _scanner: Scanner;
  _nodeLoader: NodeLoader;

  constructor() {
    this._scanner = new Scanner();
    this._nodeLoader = new NodeLoader(this._scanner);

    this._nodeLoader.loadInitialNodes();
  }

  start() {
    // game loop
    while (true) {
      // the index of the node on which the agent is positioned this turn
      const agentId: number = this._scanner.nextInt();
      const agentNode: Node = this._nodeLoader.loadNode(agentId);
      const exitPaths: Path[] = [];
      this._populateExitPaths(exitPaths, agentNode);
      if (!exitPaths.length) {
        return;
      }

      // sever the shortest exit path
      exitPaths
        .sort(Comparator.compareAscending((path: Path) => path.length))[0]
        .sever();
    }
  }

  _populateExitPaths(exitPaths: Path[], ...previouslyVisitedNodes: Node[]) {
    const currentNode: Node = previouslyVisitedNodes[previouslyVisitedNodes.length - 1];

    // Prior to Firefox 51, using the for...of loop construct with the const keyword
    // threw a SyntaxError ("missing = in const declaration").
    // Apparently the version of the SpiderMonkey JS engine that codingame uses doesn't
    // get updated regularly. Using let instead of const throws a tslint error that we
    // can disable so that our code can run in codingame without getting the
    // ("missing = in const declaration") error.
    // eslint-disable-next-line no-restricted-syntax,prefer-const
    for (let connection of currentNode.iterator()) {
      const alreadyVisited: boolean = previouslyVisitedNodes.indexOf(connection) !== -1;
      if (!alreadyVisited) {
        const visitedNodes: Node[] = [...previouslyVisitedNodes, connection];

        if (connection.isExitNode) {
          exitPaths.push(new Path(visitedNodes));
          // Use 'return' instead of 'continue' as a performance optimization.
          // Without this we would occasionally fail the 'Triple star' test case with
          // the following error: 'Timeout: your program did not provide an input in due time.'
          // It's safe to assume that a node will only connect to 0 or 1 exit nodes.
          // We can assert that if this node is an exit node, then none of its siblings are.
          // Some siblings may have indirect paths to exit nodes which our algorithm will skip.
          // This is acceptable because any indirect paths that siblings may have are
          // not relevant to us because our goal is to sever the shortest exit path for each
          // round of the game and indirect sibling paths are guaranteed to be longer than the
          // exit path that we found.
          return;
        }

        // recursive call
        this._populateExitPaths(exitPaths, ...visitedNodes);
      }
    }
  }
}

// Entry point
new Game().start();
