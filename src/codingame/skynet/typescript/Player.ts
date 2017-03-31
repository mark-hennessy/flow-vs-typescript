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
  const FUNCTION = 'function';
  const UNDEFINED = 'undefined';
  const ENCODING = 'utf8';
  const RUNNING_IN_CODINGAME_EDITOR = typeof readline === FUNCTION && typeof printErr === FUNCTION;

  function out(message: string): void {
    console.log(message);
  }

  function debug(message: string): void {
    if (RUNNING_IN_CODINGAME_EDITOR) {
      printErr(message);
    } else {
      console.warn(message);
    }
  }

  class Comparator {
    static comparing<T>(selectorFunc: (item: T) => number): (a: T, b: T) => number {
      return (a, b) => {
        const valueA = selectorFunc(a);
        const valueB = selectorFunc(b);
        if (valueA < valueB) {
          return -1;
        } else if (valueA > valueB) {
          return 1;
        } else {
          return 0;
        }
      };
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
        ? this.createInputIterator()
        : this.createFileIterator();
    }

    /**
     * An ES6 generator function. This is basically a factory method for an iterator
     * that will read a new line each iteration.
     */
    private *createInputIterator(): Iterator<string> {
      let line: string;
      do {
        line = readline();
        yield line;
      } while (line);
    }

    /**
     * Creates an iterator to traverse through a file line by line.
     */
    private createFileIterator(): Iterator<string> {
      // The __dirname variable is not available to codingame, so we have to hide it in this method.
      // It's safe here because codingame does not enter this method.
      const INPUT_DIR = `${__dirname}/../input.txt`;
      // It would be better to use an ES6 import statement to import the 'fs' module,
      // but import statements must occur at the top of the file...and that would crash
      // codingame because codingame/SpiderMonkey doesn't support ES6 imports yet.
      // We'll just have to settle for an old CommonJS require statement.
      const fs = require('fs');
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

      return columnResult.value;
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

    private linkedNodes: Set<Node>;
    private nodeIterator: Iterator<Node>;

    constructor(readonly id: number) {
      this.linkedNodes = new Set<Node>();
    }

    addLinkWith(node: Node) : void {
      this.linkedNodes.add(node);
      node.linkedNodes.add(this);
    }

    removeLinkWith(node: Node): void {
      this.linkedNodes.delete(node);
      node.linkedNodes.delete(this);
    }

    linkCount(): number {
      return this.linkedNodes.size;
    }

    next(predicate: (node: Node) => boolean): Node {
      const nodeIterator: Iterator<Node> = this.getNodeIterator();
      while (true) {
        const result: IteratorResult<Node> = nodeIterator.next();
        if (result.done) {
          return null;
        }

        const node: Node = result.value;
        if (predicate(node)) {
          return node;
        }
      }
    }

    resetNodeIterator(): void {
      this.nodeIterator = null;
    }

    private getNodeIterator(): Iterator<Node> {
      if (!this.nodeIterator) {
        this.nodeIterator = this.linkedNodes[Symbol.iterator]();
      }
      return this.nodeIterator;
    }

    toString(): String {
      return JSON.stringify({
        id: this.id,
        isExitNode: this.isExitNode,
        linkedNodesCount: this.linkedNodes.size,
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

    weight(): number {
      return 100 / (this.nodeA.linkCount() + this.nodeB.linkCount());
    }

    sever(): void {
      this.nodeA.removeLinkWith(this.nodeB);

      out(`${this.nodeA.id} ${this.nodeB.id}`);
    }

    toString(): string {
      return JSON.stringify({
        nodeA: this.nodeA,
        nodeB: this.nodeB,
      });
    }
  }

  class Path {
    private links: Link[];
    private headNode: Node;

    constructor() {
      this.links = [];
    }

    addNode(node: Node): void {
      if (this.headNode) {
        const link: Link = new Link(this.headNode, node);
        this.links.push(link);
      }
      this.headNode = node;
    }

    linkCount(): number {
      return this.links.length;
    }

    mostImportantLink(): Link {
      const sortedLinks = this.links
        .sort(Comparator.comparing<Link>(link => link.weight()))
        .reverse();
      return sortedLinks.length > 0 ? sortedLinks[0] : null;
    }

    toString(): string {
      return JSON.stringify({
        links: this.links,
      });
    }
  }

  class PathBuilder {
    private nodes: Node[];

    constructor() {
      this.nodes = [];
    }

    push(node: Node): void {
      this.nodes.push(node);
    }

    pop(): Node {
      return this.nodes.pop();
    }

    peek(): Node {
      return this.nodes[this.nodes.length - 1];
    }

    contains(node: Node): boolean {
      return this.nodes.indexOf(node) !== -1;
    }

    hasNodes(): boolean {
      return this.nodes.length > 0;
    }

    build(): Path {
      const path: Path = new Path();
      this.nodes.forEach(path.addNode.bind(path));
      return path;
    }
  }

  export class Game {
    private scanner: Scanner;
    private nodeMap: Map<number, Node>;

    constructor() {
      this.scanner = new Scanner();
      this.nodeMap = new Map<number, Node>();

      this.loadGameData();
    }

    private loadGameData(): void {
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
        nodeA.addLinkWith(nodeB);
      }

      for (let i: number = 0; i < exitNodeCount; i += 1) {
        // the index of a gateway node
        const exitId: number = this.scanner.nextInt();
        const exitNode: Node = this.nodeMap.get(exitId);
        exitNode.isExitNode = true;
      }
    }

    private loadNode(nodeId: number): Node {
      if (!this.nodeMap.has(nodeId)) {
        this.nodeMap.set(nodeId, new Node(nodeId));
      }

      return this.nodeMap.get(nodeId);
    }

    start(): void {
      // game loop
      while (true) {
        // the index of the node on which the agent is positioned this turn
        const agentId: number = this.scanner.nextInt();
        const agentNode: Node = this.loadNode(agentId);
        const exitPaths: Path[] = this.findExitPaths(agentNode);
        if (!exitPaths.length) {
          break;
        }

        this.severShortestPath(exitPaths);
      }
    }

    findExitPaths(originNode: Node): Path[] {
      const pathBuilder: PathBuilder = new PathBuilder();
      pathBuilder.push(originNode);

      const notAlreadyVisitedNode: (node: Node) => boolean =
        node => !pathBuilder.contains(node);

      const paths: Path[] = [];

      while (pathBuilder.hasNodes()) {
        let nextNode: Node = pathBuilder
          .peek()
          .next(notAlreadyVisitedNode);

        if (nextNode) {
          pathBuilder.push(nextNode);
          if (nextNode.isExitNode) {
            paths.push(pathBuilder.build());
            nextNode = null;
          }
        }

        if (!nextNode) {
          pathBuilder.pop().resetNodeIterator();
        }
      }

      return paths;
    }

    severShortestPath(paths: Path[]): void {
      const sortedPaths = paths.sort(Comparator.comparing<Path>(path => path.linkCount()));
      if (sortedPaths.length > 0) {
        this.severPath(sortedPaths[0]);
      }
    }

    severPath(path: Path): void {
      const link = path.mostImportantLink();
      if (link) {
        link.sever();
      }
    }
  }
}

// Entry point
new Codingame.Game().start();
