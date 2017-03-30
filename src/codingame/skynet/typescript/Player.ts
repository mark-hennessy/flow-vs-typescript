/**
 * This code is meant to be copied into the codingame editor for the Skynet (Medium) puzzle.
 * https://www.codingame.com/training/medium/skynet-revolution-episode-1
 *
 * The namespace gets transpiled into a simple IIFE.
 * It's used to prevent global namespace pollution.
 * It's also needed to avoid naming conflicts with things defined in the global scope.
 * For example, we would not be able to use names such as 'Node' and 'print'
 * without a namespace because they are already defined in the global scope.
 *
 * IMPORTANT: You will need to delete the SpiderMonkey method stubs
 * so that codingame can use the actual implementations.
 */
namespace Codingame {
  // SpiderMonkey method stubs
  const readline: () => string = () => '';
  const print: (str: string) => void = str => console.log(str);

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

  class Scanner {
    private currentLine: Iterator<string>;

    nextInt(): number {
      return parseInt(this.next());
    }

    next(): string {
      if (!this.currentLine) {
        this.moveToNextLine();
      }

      let next: IteratorResult<string> = this.currentLine.next();
      if (next.done) {
        this.moveToNextLine();
        next = this.currentLine.next();
      }

      return next.value;
    }

    moveToNextLine(): void {
      const line: string = readline();
      if (line) {
        this.currentLine = line.split(' ')[Symbol.iterator]();
      }
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

    linkedNodeCount(): number {
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
      return 100 / (this.nodeA.linkedNodeCount() + this.nodeB.linkedNodeCount());
    }

    sever(): void {
      this.nodeA.removeLinkWith(this.nodeB);

      print(`${this.nodeA.id} ${this.nodeB.id}`);
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
        const a: number = this.scanner.nextInt();
        const b: number = this.scanner.nextInt();
        const nodeA: Node = this.loadNode(a);
        const nodeB: Node = this.loadNode(b);
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
