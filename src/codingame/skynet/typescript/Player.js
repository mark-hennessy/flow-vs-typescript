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
var Codingame;
(function (Codingame) {
    const FUNCTION = 'function';
    const UNDEFINED = 'undefined';
    const RUNNING_IN_CODINGAME_EDITOR = typeof readline === FUNCTION
        && typeof printErr === FUNCTION;
    function output(message) {
        console.log(message);
    }
    function debug(message) {
        if (RUNNING_IN_CODINGAME_EDITOR) {
            printErr(message);
        }
        else {
            console.warn(message);
        }
    }
    class Comparator {
        static compareAscending(selectorFunc) {
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
        static compareDescending(selectorFunc) {
            const compareAscending = Comparator.compareAscending(selectorFunc);
            return (a, b) => compareAscending(b, a);
        }
    }
    /**
     * A utility class to read and parse space and newline separated input.
     * Input is parsed left to right and top to bottom.
     * If input on the current row is exhausted, then the scanner moves to the next row.
     */
    class Scanner {
        constructor() {
            this.rowIterator = RUNNING_IN_CODINGAME_EDITOR
                ? Scanner.createInputIterator()
                : Scanner.createFileIterator();
        }
        /**
         * An ES6 generator function. This is basically a factory method for an iterator
         * that will read a new line each iteration.
         */
        static *createInputIterator() {
            let line;
            do {
                line = readline();
                yield line;
            } while (line);
        }
        /**
         * Creates an iterator to traverse through a file line by line.
         */
        static createFileIterator() {
            // The __dirname variable is not available to codingame, so we have to hide it in this method.
            // It's safe here because codingame does not enter this method.
            const INPUT_DIR = `${__dirname}/../input.txt`;
            const ENCODING = 'utf8';
            // It would be better to use an ES6 import statement to import the 'fs' module,
            // but import statements must occur at the top of the file...and that would crash
            // codingame because codingame/SpiderMonkey doesn't support ES6 imports yet.
            // We'll just have to settle for an old CommonJS require statement.
            const fs = require('fs');
            return fs.readFileSync(INPUT_DIR, ENCODING).split(/\n/)[Symbol.iterator]();
        }
        nextInt() {
            return parseInt(this.next());
        }
        next() {
            // if the columnIterator is undefined, then move to the initial row
            if (!this.columnIterator) {
                this.moveToNextRow();
            }
            // get the next value on the current row
            let columnResult = this.columnIterator.next();
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
        moveToNextRow() {
            const rowResult = this.rowIterator.next();
            // if a next row was not found, then exit
            if (rowResult.done) {
                return false;
            }
            const row = rowResult.value;
            debug(row);
            this.columnIterator = row.split(' ')[Symbol.iterator]();
            return true;
        }
    }
    class Node {
        constructor(id) {
            this.id = id;
            // Everything, even primitives such as numbers and booleans,
            // default to undefined if not initialized with a value.
            this.isExitNode = false;
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
        linkCount() {
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
            return 100 / (this.nodeA.linkCount() + this.nodeB.linkCount());
        }
        sever() {
            this.nodeA.removeLinkWith(this.nodeB);
            output(`${this.nodeA.id} ${this.nodeB.id}`);
        }
        toString() {
            return JSON.stringify({
                nodeA: JSON.parse(this.nodeA.toString()),
                nodeB: JSON.parse(this.nodeB.toString()),
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
        length() {
            return this.links.length;
        }
        sever() {
            const link = this.mostImportantLink();
            if (link) {
                link.sever();
            }
        }
        mostImportantLink() {
            if (!this.links.length) {
                return;
            }
            return this.links
                .sort(Comparator.compareDescending(link => link.weight()))[0];
        }
        toString() {
            return this.links.toString();
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
            return !!this.nodes.length;
        }
        build() {
            const path = new Path();
            this.nodes.forEach(path.addNode.bind(path));
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
                const idA = this.scanner.nextInt();
                const idB = this.scanner.nextInt();
                const nodeA = this.loadNode(idA);
                const nodeB = this.loadNode(idB);
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
                if (!exitPaths.length) {
                    break;
                }
                this.severShortestPath(exitPaths);
            }
        }
        findExitPaths(originNode) {
            const pathBuilder = new PathBuilder();
            pathBuilder.push(originNode);
            const notAlreadyVisitedNode = node => !pathBuilder.contains(node);
            const paths = [];
            while (pathBuilder.hasNodes()) {
                let nextNode = pathBuilder
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
        severShortestPath(paths) {
            if (!paths.length) {
                return;
            }
            paths
                .sort(Comparator.compareAscending(path => path.length()))[0]
                .sever();
        }
    }
    Codingame.Game = Game;
})(Codingame || (Codingame = {}));
// Entry point
new Codingame.Game().start();
//# sourceMappingURL=Player.js.map