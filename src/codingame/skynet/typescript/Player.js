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
var codingame;
(function (codingame) {
    // SpiderMonkey method stubs
    const readline = () => '';
    const print = str => console.log(str);
    // Entry point
    new Game().start();
    class Node {
        constructor(id) {
            this.id = id;
            this.linkedNodes = new Set();
        }
        addLinkWith(node) {
            this.linkedNodes.add(node);
            node.linkedNodes.add(this);
        }
        removeLinkWith(node) {
            this.linkedNodes.delete(node);
            node.linkedNodes.delete(this);
        }
        linkedNodeCount() {
            return this.linkedNodes.size;
        }
        next(predicate) {
            const nodeIterator = this.getNodeIterator();
            while (true) {
                const result = nodeIterator.next();
                if (result.done) {
                    return null;
                }
                const node = result.value;
                if (predicate(node)) {
                    return node;
                }
            }
        }
        resetNodeIterator() {
            this.nodeIterator = null;
        }
        getNodeIterator() {
            if (!this.nodeIterator) {
                this.nodeIterator = this.linkedNodes[Symbol.iterator]();
            }
            return this.nodeIterator;
        }
        toString() {
            return JSON.stringify({
                id: this.id,
                isExitNode: this.isExitNode,
                linkedNodesCount: this.linkedNodes.size,
            });
        }
    }
    class Link {
        constructor(nodeA, nodeB) {
            this.nodeA = nodeA;
            this.nodeB = nodeB;
        }
        weight() {
            return 100 / (this.nodeA.linkedNodeCount() + this.nodeB.linkedNodeCount());
        }
        sever() {
            this.nodeA.removeLinkWith(this.nodeB);
            print(`${this.nodeA.id} ${this.nodeB.id}`);
        }
        toString() {
            return JSON.stringify({
                nodeA: this.nodeA,
                nodeB: this.nodeB,
            });
        }
    }
    class Path {
        constructor() {
            this.links = [];
        }
        addNode(node) {
            if (this.headNode) {
                const link = new Link(this.headNode, node);
                this.links.push(link);
            }
            this.headNode = node;
        }
        linkCount() {
            return this.links.length;
        }
        mostImportantLink() {
            const sortedLinks = this.links
                .sort(Comparator.comparing(link => link.weight()))
                .reverse();
            return sortedLinks.length > 0 ? sortedLinks[0] : null;
        }
        toString() {
            return JSON.stringify({
                links: this.links,
            });
        }
    }
    class PathBuilder {
        constructor() {
            this.nodes = [];
        }
        push(node) {
            this.nodes.push(node);
        }
        pop() {
            return this.nodes.pop();
        }
        peek() {
            return this.nodes[this.nodes.length - 1];
        }
        contains(node) {
            return this.nodes.indexOf(node) !== -1;
        }
        hasNodes() {
            return this.nodes.length > 0;
        }
        build() {
            const path = new Path();
            this.nodes.forEach(path.addNode);
            return path;
        }
    }
    class Game {
        constructor() {
            this.scanner = new Scanner();
            this.nodeMap = new Map();
            this.loadGameData();
        }
        loadGameData() {
            // the total number of nodes in the level, including the gateways
            const nodeCount = this.scanner.nextInt();
            // the number of links
            const linkCount = this.scanner.nextInt();
            // the number of exit gateways
            const exitNodeCount = this.scanner.nextInt();
            for (let i = 0; i < linkCount; i += 1) {
                // nodeA and nodeB defines a link between these nodes
                const a = this.scanner.nextInt();
                const b = this.scanner.nextInt();
                const nodeA = this.loadNode(a);
                const nodeB = this.loadNode(b);
                nodeA.addLinkWith(nodeB);
            }
            for (let i = 0; i < exitNodeCount; i += 1) {
                // the index of a gateway node
                const exitId = this.scanner.nextInt();
                const exitNode = this.nodeMap.get(exitId);
                exitNode.isExitNode = true;
            }
        }
        loadNode(nodeId) {
            if (!this.nodeMap.has(nodeId)) {
                this.nodeMap.set(nodeId, new Node(nodeId));
            }
            return this.nodeMap.get(nodeId);
        }
        start() {
            // game loop
            while (true) {
                // the index of the node on which the agent is positioned this turn
                const agentId = this.scanner.nextInt();
                const agentNode = this.loadNode(agentId);
                const exitPaths = this.findExitPaths(agentNode);
                this.severShortestPath(exitPaths);
            }
        }
        findExitPaths(originNode) {
            const paths = [];
            const pathBuilder = new PathBuilder();
            pathBuilder.push(originNode);
            while (pathBuilder.hasNodes()) {
                let nextNode = pathBuilder
                    .peek()
                    .next(node => !pathBuilder.contains(node));
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
        severShortestPath(paths) {
            const sortedPaths = paths.sort(Comparator.comparing(path => path.linkCount()));
            if (sortedPaths.length > 0) {
                this.severPath(sortedPaths[0]);
            }
        }
        severPath(path) {
            const link = path.mostImportantLink();
            if (link) {
                link.sever();
            }
        }
    }
    class Scanner {
        nextInt() {
            return parseInt(this.next());
        }
        next() {
            if (!this.currentLine) {
                this.moveToNextLine();
            }
            let next = this.currentLine.next();
            if (next.done) {
                this.moveToNextLine();
                next = this.currentLine.next();
            }
            return next.value;
        }
        moveToNextLine() {
            const line = readline();
            if (line) {
                this.currentLine = line.split(' ')[Symbol.iterator]();
            }
        }
    }
    class Comparator {
        static comparing(selectorFunc) {
            return (a, b) => {
                const valueA = selectorFunc(a);
                const valueB = selectorFunc(b);
                if (valueA < valueB) {
                    return -1;
                }
                else if (valueA > valueB) {
                    return 1;
                }
                else {
                    return 0;
                }
            };
        }
    }
})(codingame || (codingame = {}));
