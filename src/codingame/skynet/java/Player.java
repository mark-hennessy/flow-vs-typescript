package codingame.skynet.java;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.Set;
import java.util.Stack;
import java.util.function.Predicate;

/**
 * This code is meant to be copied into the codingame editor for the Skynet (Medium) puzzle.
 * https://www.codingame.com/training/medium/skynet-revolution-episode-1
 *
 * The class must be called Player and may not have an access modifier,
 * otherwise codingame will not recognize it.
 *
 * IMPORTANT: You will need to delete the package declaration because codingame does not support packages.
 */
class Player {

  public static void main(String args[]) {

    new Game().start();
  }

  public static class Node {
    private int id;
    private boolean exitNode;

    private Set<Node> linkedNodes;
    private Iterator<Node> nodeIterator;

    public Node(int id) {
      this.id = id;

      linkedNodes = new HashSet<>();
    }

    public int getId() {
      return id;
    }

    public boolean isExitNode() {
      return exitNode;
    }

    public void makeExitNode() {
      this.exitNode = true;
    }

    public void addLinkWith(Node node) {
      linkedNodes.add(node);
      node.linkedNodes.add(this);
    }

    public void removeLinkWith(Node node) {
      linkedNodes.remove(node);
      node.linkedNodes.remove(this);
    }

    public int linkedNodeCount() {
      return linkedNodes.size();
    }

    public Node next(Predicate<Node> predicate) {
      Node next = null;
      Iterator<Node> nodeIterator = getNodeIterator();
      while (next == null && nodeIterator.hasNext()) {
        Node candidate = nodeIterator.next();
        if (predicate.test(candidate)) {
          next = candidate;
        }
      }
      return next;
    }

    public void resetNodeIterator() {
      nodeIterator = null;
    }

    private Iterator<Node> getNodeIterator() {
      if (nodeIterator == null) {
        nodeIterator = linkedNodes.iterator();
      }
      return nodeIterator;
    }

    @Override
    public String toString() {
      return "Node{" +
        "id=" + id +
        ", isExitNode=" + isExitNode() +
        ", linkedNodeCount=" + linkedNodeCount() +
        '}';
    }
  }

  public static class Link {
    private Node nodeA;
    private Node nodeB;

    public Link(Node nodeA, Node nodeB) {
      this.nodeA = nodeA;
      this.nodeB = nodeB;
    }

    public int weight() {
      return 100 / (nodeA.linkedNodeCount() + nodeB.linkedNodeCount());
    }

    public void sever() {
      nodeA.removeLinkWith(nodeB);

      System.out.println(nodeA.getId() + " " + nodeB.getId());
    }

    @Override
    public String toString() {
      return "Link{" +
        "nodeA=" + nodeA +
        ", nodeB=" + nodeB +
        '}';
    }
  }

  public static class Path {
    private List<Link> links;
    private Node headNode;

    public Path() {
      links = new ArrayList<>();
    }

    public void addNode(Node node) {
      if (headNode != null) {
        Link link = new Link(headNode, node);
        links.add(link);
      }
      headNode = node;
    }

    public int linkCount() {
      return links.size();
    }

    public Optional<Link> mostImportantLink() {
      return links.stream()
        .sorted(Comparator.comparing(Link::weight).reversed())
        .findFirst();
    }

    @Override
    public String toString() {
      return "Path{" +
        "links=" + links +
        '}';
    }
  }

  public static class PathBuilder {
    private Stack<Node> nodes;

    public PathBuilder() {
      nodes = new Stack<>();
    }

    public void push(Node node) {
      nodes.push(node);
    }

    public Node pop() {
      return nodes.pop();
    }

    public Node peek() {
      return nodes.peek();
    }

    public boolean contains(Node node) {
      return nodes.contains(node);
    }

    public boolean hasNodes() {
      return !nodes.isEmpty();
    }

    public Path build() {
      Path path = new Path();
      nodes.forEach(path::addNode);
      return path;
    }
  }

  public static class Game {
    private Scanner scanner;
    private Map<Integer, Node> nodeMap;

    public Game() {
      scanner = new Scanner(System.in);
      nodeMap = new HashMap<>();

      loadGameData();
    }

    private void loadGameData() {
      // the total number of nodes in the level, including the gateways
      int nodeCount = scanner.nextInt();
      // the number of links
      int linkCount = scanner.nextInt();
      // the number of exit gateways
      int exitNodeCount = scanner.nextInt();

      for (int i = 0; i < linkCount; i++) {
        // nodeA and nodeB defines a link between these nodes
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        Node nodeA = loadNode(a);
        Node nodeB = loadNode(b);
        nodeA.addLinkWith(nodeB);
      }

      for (int i = 0; i < exitNodeCount; i++) {
        // the index of a gateway node
        int exitId = scanner.nextInt();
        Node exitNode = nodeMap.get(exitId);
        exitNode.makeExitNode();
      }
    }

    private Node loadNode(int nodeId) {
      if (!nodeMap.containsKey(nodeId)) {
        nodeMap.put(nodeId, new Node(nodeId));
      }
      return nodeMap.get(nodeId);
    }

    public void start() {
      // game loop
      while (true) {
        // the index of the node on which the agent is positioned this turn
        int agentId = scanner.nextInt();
        Node agentNode = loadNode(agentId);
        List<Path> exitPaths = findExitPaths(agentNode);
        severShortestPath(exitPaths);
      }
    }

    public List<Path> findExitPaths(Node originNode) {
      List<Path> paths = new ArrayList<>();
      PathBuilder pathBuilder = new PathBuilder();
      pathBuilder.push(originNode);
      while (pathBuilder.hasNodes()) {
        Node nextNode = pathBuilder.peek().next(node -> !pathBuilder.contains(node));
        if (nextNode != null) {
          pathBuilder.push(nextNode);
          if (nextNode.isExitNode()) {
            paths.add(pathBuilder.build());
            nextNode = null;
          }
        }
        if (nextNode == null) {
          pathBuilder.pop().resetNodeIterator();
        }
      }
      return paths;
    }

    public void severShortestPath(List<Path> paths) {
      paths.stream()
        .sorted(Comparator.comparing(Path::linkCount))
        .findFirst()
        .ifPresent(this::severPath);
    }

    public void severPath(Path path) {
      path.mostImportantLink().ifPresent(Link::sever);
    }
  }
}
