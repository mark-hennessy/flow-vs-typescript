package comparisons.codingame.skynet.java;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

/**
 * This code is meant to be copied into the codingame editor for the Skynet (Medium) puzzle.
 * https://www.codingame.com/training/medium/skynet-revolution-episode-1
 * <p>
 * The class must be called Player and may not have an access modifier,
 * otherwise codingame will not recognize it.
 * <p>
 * IMPORTANT: You will need to delete the package declaration because codingame does not support packages.
 */
class Player {

  public static void main(String args[]) {
    new Game().start();
  }

  public static class Node implements Iterable<Node> {
    private int id;
    private boolean exitNode;

    private Set<Node> connections;

    public Node(int id) {
      this.id = id;

      connections = new HashSet<>();
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

    public void addConnectionWith(Node node) {
      connections.add(node);
      node.connections.add(this);
    }

    public void removeConnectionWith(Node node) {
      connections.remove(node);
      node.connections.remove(this);
    }

    public int getConnectionCount() {
      return connections.size();
    }

    @Override
    public Iterator<Node> iterator() {
      return connections.iterator();
    }

    @Override
    public String toString() {
      return "Node{" +
        "id=" + id +
        ", isExitNode=" + isExitNode() +
        ", connectionCount=" + getConnectionCount() +
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

    public int calculateImportance() {
      // links between nodes with few connections are more important because
      // severing them is more likely to result in dead-ends.
      return 100 / (nodeA.getConnectionCount() + nodeB.getConnectionCount());
    }

    public void sever() {
      nodeA.removeConnectionWith(nodeB);

      System.out.println(nodeA.getId() + " " + nodeB.getId());
    }
  }

  public static class Path {
    private List<Link> links;

    public Path(List<Node> nodes) {
      links = new ArrayList<>();

      Node headNode = null;
      for (Node node : nodes) {
        if (headNode != null) {
          Link link = new Link(headNode, node);
          links.add(link);
        }
        headNode = node;
      }
    }

    public int getLength() {
      return links.size();
    }

    public void sever() {
      if (links.isEmpty()) {
        return;
      }

      links.stream()
        .sorted(Comparator.comparing(Link::calculateImportance).reversed())
        .findFirst()
        .get()
        .sever();
    }
  }

  public static class NodeLoader {
    private Scanner scanner;
    private Map<Integer, Node> nodeRegistry;

    public NodeLoader(Scanner scanner) {
      this.scanner = scanner;
      nodeRegistry = new HashMap<>();
    }

    public void loadInitialNodes() {
      // the total number of nodes in the level, including the gateways
      int nodeCount = scanner.nextInt();
      // the number of links
      int linkCount = scanner.nextInt();
      // the number of exit gateways
      int exitNodeCount = scanner.nextInt();

      for (int i = 0; i < linkCount; i++) {
        // nodeA and nodeB defines a link between these nodes
        int idA = scanner.nextInt();
        int idB = scanner.nextInt();
        Node nodeA = loadNode(idA);
        Node nodeB = loadNode(idB);
        nodeA.addConnectionWith(nodeB);
      }

      for (int i = 0; i < exitNodeCount; i++) {
        // the index of a gateway node
        int exitId = scanner.nextInt();
        Node exitNode = nodeRegistry.get(exitId);
        exitNode.makeExitNode();
      }
    }

    public Node loadNode(int nodeId) {
      if (!nodeRegistry.containsKey(nodeId)) {
        nodeRegistry.put(nodeId, new Node(nodeId));
      }
      return nodeRegistry.get(nodeId);
    }
  }

  public static class Game {
    private Scanner scanner;
    private NodeLoader nodeLoader;

    public Game() {
      scanner = new Scanner(System.in);
      nodeLoader = new NodeLoader(scanner);

      nodeLoader.loadInitialNodes();
    }

    public void start() {
      // game loop
      while (true) {
        // the index of the node on which the agent is positioned this turn
        int agentId = scanner.nextInt();
        Node agentNode = nodeLoader.loadNode(agentId);

        List<Path> exitPaths = new ArrayList<>();
        List<Node> previouslyVisitedNodes = new ArrayList<>();
        previouslyVisitedNodes.add(agentNode);
        populateExitPaths(exitPaths, previouslyVisitedNodes);
        if (exitPaths.isEmpty()) {
          return;
        }

        // sever the shortest exit path
        exitPaths.stream()
          .sorted(Comparator.comparing(Path::getLength))
          .findFirst()
          .get()
          .sever();
      }
    }

    private void populateExitPaths(List<Path> exitPaths, List<Node> previouslyVisitedNodes) {
      Node currentNode = previouslyVisitedNodes.get(previouslyVisitedNodes.size() - 1);

      for (Node connection : currentNode) {
        boolean alreadyVisited = previouslyVisitedNodes.contains(connection);
        if (!alreadyVisited) {
          List<Node> visitedNodes = new ArrayList<>(previouslyVisitedNodes);
          visitedNodes.add(connection);

          if (connection.isExitNode()) {
            exitPaths.add(new Path(visitedNodes));
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
          this.populateExitPaths(exitPaths, visitedNodes);
        }
      }
    }
  }
}
