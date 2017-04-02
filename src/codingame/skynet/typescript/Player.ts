/**
 * This code, i.e. the output JS, is meant to be copied into the codingame editor
 * for the Skynet (Medium) puzzle.
 * https://www.codingame.com/training/medium/skynet-revolution-episode-1
 *
 * The namespace gets transpiled into a simple IIFE.
 * It's used to prevent global namespace pollution.
 * It's also needed to avoid naming conflicts with things defined in the global scope.
 * For example, we would not be able to use names such as 'Node' and 'print'
 * without a namespace because they are already defined in the global scope.
 */
namespace Codingame {

  const DEBUG_OUTPUT_ENABLED: boolean = false;

  const FUNCTION: string = 'function';

  const RUNNING_IN_CODINGAME_EDITOR: boolean =
    typeof readline === FUNCTION
    && typeof printErr === FUNCTION;

  function output(message: string): void {
    console.log(message);
  }

  function debug(message: string): void {
    if (!DEBUG_OUTPUT_ENABLED) {
      return;
    }

    if (RUNNING_IN_CODINGAME_EDITOR) {
      printErr(message);
    } else {
      console.warn(message);
    }
  }


  type comparatorFunc<T> = (a: T, b: T) => number;
  class Comparator {

    static compareAscending<T>(selectorFunc: (item: T) => number): comparatorFunc<T> {
      return (a: T, b: T) => {
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
      return (a: T, b: T) => compareAscending(b, a);
    }
  }

  /**
   * A utility class to read and parse space and newline separated input.
   * Input is parsed left to right and top to bottom.
   * If input on the current row is exhausted, then the scanner moves to the next row.
   */
  class Scanner {
    private rowIterator: Iterator<string>;
    private columnIterator: Iterator<string>;

    constructor() {
      this.rowIterator = RUNNING_IN_CODINGAME_EDITOR
        ? Scanner.createInputIterator()
        : Scanner.createFileIterator();
    }

    /**
     * An ES6 generator function. This is basically a factory method for an iterator
     * that will read a new line each iteration.
     */
    private static *createInputIterator(): Iterator<string> {
      let line: string;
      do {
        line = readline();
        yield line;
      } while (line);
    }

    /**
     * Creates an iterator to traverse through a file line by line.
     */
    private static createFileIterator(): Iterator<string> {
      // The __dirname variable is not available to codingame, so we have to hide it in this method.
      // It's safe here because codingame does not enter this method.
      const INPUT_DIR: string = `${__dirname}/../input.txt`;
      const ENCODING: string = 'utf8';
      // It would be better to use an ES6 import statement to import the 'fs' module,
      // but import statements must occur at the top of the file...and that would crash
      // codingame because codingame/SpiderMonkey doesn't support ES6 imports yet.
      // We'll just have to settle for an old CommonJS require statement.
      const fs: any = require('fs');
      return fs.readFileSync(INPUT_DIR, ENCODING).split(/\n/)[Symbol.iterator]();
    }

    nextInt(): number {
      return parseInt(this.next());
    }

    next(): string {
      // if the columnIterator is undefined, then move to the initial row
      if (!this.columnIterator) {
        this.moveToNextRow();
      }

      // get the next value on the current row
      let columnResult: IteratorResult<string> = this.columnIterator.next();
      // if the current row is exhausted, then move to the next row
      if (columnResult.done) {
        if (this.moveToNextRow()) {
          columnResult = this.columnIterator.next();
        }
      }

      return columnResult.value || '';
    }

    /**
     * Moves the scanner to the next row.
     *
     * @returns {boolean} true if the move to the next row was successful
     */
    moveToNextRow(): boolean {
      const rowResult: IteratorResult<string> = this.rowIterator.next();
      // if a next row was not found, then exit
      if (rowResult.done) {
        return false;
      }

      const row: string = rowResult.value;
      debug(row);
      this.columnIterator = row.split(' ')[Symbol.iterator]();
      return true;
    }
  }

  class Node {
    isExitNode: boolean;

    private connections: Set<Node>;

    constructor(readonly id: number) {
      // Everything, even primitives such as numbers and booleans,
      // default to undefined if not initialized with a value.
      this.isExitNode = false;
      this.connections = new Set<Node>();
    }

    addConnectionWith(node: Node): void {
      this.connections.add(node);
      node.connections.add(this);
    }

    removeConnectionWith(node: Node): void {
      this.connections.delete(node);
      node.connections.delete(this);
    }

    get connectionCount(): number {
      return this.connections.size;
    }

    [Symbol.iterator](): Iterator<Node> {
      return this.connections[Symbol.iterator]();
    }

    toString(): string {
      return JSON.stringify({
        id: this.id,
        isExitNode: this.isExitNode,
        connectionCount: this.connections.size,
      });
    }
  }

  class Link {
    private nodeA: Node;
    private nodeB: Node;

    constructor(nodeA: Node, nodeB: Node) {
      this.nodeA = nodeA;
      this.nodeB = nodeB;
    }

    get importance(): number {
      // links between nodes with few connections are more important because
      // severing them is more likely to result in dead-ends.
      return 100 / (this.nodeA.connectionCount + this.nodeB.connectionCount);
    }

    sever(): void {
      this.nodeA.removeConnectionWith(this.nodeB);

      output(`${this.nodeA.id} ${this.nodeB.id}`);
    }
  }

  class Path {
    private links: Link[];

    constructor(nodes: Node[]) {
      this.links = [];

      let headNode: Node;
      nodes.forEach((node: Node) => {
        if (headNode) {
          const link: Link = new Link(headNode, node);
          this.links.push(link);
        }

        headNode = node;
      });
    }

    get length(): number {
      return this.links.length;
    }

    sever(): void {
      if (!this.links.length) {
        return;
      }

      const mostImportantLink: Link = this.links
        .sort(Comparator.compareDescending<Link>(link => link.importance))[0];

      mostImportantLink.sever();
    }
  }

  class NodeLoader {
    nodeRegistry: Map<number, Node>;

    constructor(private scanner: Scanner) {
      this.nodeRegistry = new Map<number, Node>();
    }

    loadInitialNodes(): void {
      // the total number of nodes in the level, including the gateways
      const nodeCount: number = this.scanner.nextInt();
      // the number of links
      const linkCount: number = this.scanner.nextInt();
      // the number of exit gateways
      const exitNodeCount: number = this.scanner.nextInt();

      for (let i: number = 0; i < linkCount; i += 1) {
        // nodeA and nodeB defines a link between these nodes
        const idA: number = this.scanner.nextInt();
        const idB: number = this.scanner.nextInt();
        const nodeA: Node = this.loadNode(idA);
        const nodeB: Node = this.loadNode(idB);
        nodeA.addConnectionWith(nodeB);
      }

      for (let i: number = 0; i < exitNodeCount; i += 1) {
        // the index of a gateway node
        const exitId: number = this.scanner.nextInt();
        const exitNode: Node = this.loadNode(exitId);
        exitNode.isExitNode = true;
      }
    }

    loadNode(nodeId: number): Node {
      if (!this.nodeRegistry.has(nodeId)) {
        this.nodeRegistry.set(nodeId, new Node(nodeId));
      }

      return this.nodeRegistry.get(nodeId);
    }
  }

  export class Game {
    private scanner: Scanner;
    private nodeLoader: NodeLoader;

    constructor() {
      this.scanner = new Scanner();
      this.nodeLoader = new NodeLoader(this.scanner);

      this.nodeLoader.loadInitialNodes();
    }

    start(): void {
      // game loop
      let exitGame: boolean = false;
      while (!exitGame) {
        // the index of the node on which the agent is positioned this turn
        const agentId: number = this.scanner.nextInt();
        const agentNode: Node = this.nodeLoader.loadNode(agentId);
        const exitPaths: Path[] = [];
        this.populateExitPaths(exitPaths, agentNode);
        exitGame = !exitPaths.length;
        if (!exitGame) {
          // sever the shortest exit path
          exitPaths
            .sort(Comparator.compareAscending<Path>(path => path.length))[0]
            .sever();
        }
      }
    }

    private populateExitPaths(exitPaths: Path[], ...previouslyVisitedNodes: Node[]): void {
      const currentNode: Node = previouslyVisitedNodes[previouslyVisitedNodes.length - 1];

      // Prior to Firefox 51, using the for...of loop construct with the const keyword
      // threw a SyntaxError ("missing = in const declaration").
      // Apparently the version of the SpiderMonkey JS engine that codingame uses doesn't
      // get updated regularly. Using let instead of const throws a tslint error that we
      // can disable so that our code can run in codingame without getting the
      // ("missing = in const declaration") error.
      // tslint:disable-next-line:prefer-const
      for (let connection of currentNode) {
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
          this.populateExitPaths(exitPaths, ...visitedNodes);
        }
      }
    }
  }
}

// Entry point
new Codingame.Game().start();
