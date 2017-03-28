package codingame.skynet.java;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Scanner;
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

  public static void main(String args[])
    throws IOException {
    
    Scanner scanner;
    if (args.length > 0) {
      scanner = new Scanner(Paths.get(args[0]));
    } else {
      scanner = new Scanner(System.in);
    }

    Game game = new Game(scanner);
    game.loadGameData();
    game.start();
  }

  public static class Node {
    private int id;
    private boolean exitNode;
    private List<Node> nodes;
    private Iterator<Node> nodeIterator;

    public Node(int id) {
      this.id = id;

      nodes = new ArrayList<>();
    }

    public int getId() {
      return id;
    }

    public boolean isExitNode() {
      return exitNode;
    }

    public void setExitNode(boolean exitNode) {
      this.exitNode = exitNode;
    }

    public void addNode(Node node) {
      nodes.add(node);
    }

    public void removeNode(Node node) {
      nodes.remove(node);
    }

    public int nodeCount() {
      return nodes.size();
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
        nodeIterator = nodes.iterator();
      }
      return nodeIterator;
    }

    @Override
    public String toString() {
      return "Node{" +
        "id=" + id +
        ", exitNode=" + exitNode +
        ", nodesSize=" + nodes.size() +
        '}';
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }
      Node node = (Node) o;
      return id == node.id &&
        exitNode == node.exitNode &&
        Objects.equals(nodes, node.nodes) &&
        Objects.equals(nodeIterator, node.nodeIterator);
    }

    @Override
    public int hashCode() {
      return Objects.hash(id, exitNode, nodes, nodeIterator);
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
      return 100 / (nodeA.nodeCount() + nodeB.nodeCount());
    }

    public void sever() {
      nodeA.removeNode(nodeB);
      nodeB.removeNode(nodeA);
      System.out.println(nodeA.getId() + " " + nodeB.getId());
    }

    @Override
    public String toString() {
      return "Link{" +
        "nodeA=" + nodeA +
        ", nodeB=" + nodeB +
        '}';
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }
      Link link = (Link) o;
      return Objects.equals(nodeA, link.nodeA) &&
        Objects.equals(nodeB, link.nodeB);
    }

    @Override
    public int hashCode() {
      return Objects.hash(nodeA, nodeB);
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

    public Game(Scanner scanner) {
      this.scanner = scanner;

      nodeMap = new HashMap<>();
    }

    public void loadGameData() {
      // the total number of nodes in the level, including the gateways
      int nodes = scanner.nextInt();
      // the number of links
      int links = scanner.nextInt();
      // the number of exit gateways
      int exits = scanner.nextInt();

      for (int i = 0; i < links; i++) {
        // nodeA and nodeB defines a link between these nodes
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        Node nodeA = loadNode(a);
        Node nodeB = loadNode(b);
        nodeA.addNode(nodeB);
        nodeB.addNode(nodeA);
      }

      List<Node> exitNodes = new ArrayList<>();
      for (int i = 0; i < exits; i++) {
        // the index of a gateway node
        int exitId = scanner.nextInt();
        Node exitNode = nodeMap.get(exitId);
        exitNode.setExitNode(true);
        exitNodes.add(exitNode);
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
