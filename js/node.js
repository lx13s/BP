function print(str) {
	var output = document.getElementById('output');
	output.innerHTML = str;
}

function distance(left, right) {
	return Math.sqrt(left.map(function(e, i) {
  	return e - right[i];
  }).map(function(e) {
  	return e * e;
  }).reduce(function(current, e) {
  	return current + e;
  }));
}

class Node {
	constructor(id, position) {
  	this.id = id;
    this.position = position;
  	this.connections = [];
  }

  connect(otherNode) {
  	var cost = distance(this.position, otherNode.position);
  	this.connections.push({ node: otherNode, cost: cost });
    otherNode.connections.push({ node: this, cost: cost });
  }

  toString() {
  	return `Node #${this.id}`;
  }
}

var nodes = [
	new Node(0, [1, 0, 2]),
  new Node(1, [2, 0, 4]),
  new Node(2, [5, 0, -2]),
  new Node(3, [1, 0, 10]),
  new Node(4, [5, 0, 9])
];

nodes[0].connect(nodes[1]);
nodes[0].connect(nodes[2]);
nodes[1].connect(nodes[3]);
nodes[2].connect(nodes[4]);

print(nodes[0].connections[0].node.toString());
