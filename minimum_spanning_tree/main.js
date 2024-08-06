document.addEventListener("DOMContentLoaded", () => {

    class Graph {

        #adjacencyList;
        constructor() {
            this.#adjacencyList = new Map();
        }

        #addVertex(vertex) {
            if (this.#adjacencyList.has(vertex))
                return;

            this.#adjacencyList.set(vertex, []);
        }

        addEdgeFromV1ToV2(vertex1, vertex2, weight) {
            this.#addVertex(vertex1);
            this.#addVertex(vertex2);

            let vertex1Neighbors = this.#adjacencyList.get(vertex1);
            vertex1Neighbors.push({ name: vertex2, weight: weight });
        }

        print() {
            let result = document.getElementById("result");
            this.#adjacencyList.forEach((neighbors, key) => {
                console.log(`key: ${key} => `);
                neighbors.forEach(neighbor => {
                    console.log(`(${neighbor.name} / ${neighbor.weight}), `);
                });
                console.log("\n");
            });
        }

        #getUniqueEdges() {
            let edges = new Set();//ensure each edge is unique

            this.#adjacencyList.forEach((neighbors, key) => {
                neighbors.forEach(neighbor => {

                    //enuser same edges have same attriube order
                    let edge = [key, neighbor.name];
                    edge.sort();

                    edges.add({ vertex1: edge[0], vertex2: edge[1], weight: neighbor.weight });
                });
            });

            return edges;
        }

        #IsV1AndV2InSameSet(sets, vertex1, vertex2) {
            sets.forEach(set => {
                if (set.includes(vertex1) && set.includes(vertex2)) {
                    return true;
                }
            });

            return false;
        }

        minimumSpanningTreeKruskal() {
            let sets = [];
            let edges = new Set();//ensure each edge is unique
            let finalSet = [];

            //put each vertix in set
            this.#adjacencyList.forEach(key => {
                sets.push([key]);
            });

            //sort edges by nondecreasing  weight
            edges = this.#getUniqueEdges();
            //negative value if first should come first, zero no change, (positive seconde first)
            edges.sort((edge1, edge2) => edge1.weight - edge2.weight);

            edges.forEach(edge => {
                let vertex1 = edge.vertex1;
                let vertex2 = edge.vertex2;
                if (!this.#IsV1AndV2InSameSet(sets, vertex1, vertex2)) {

                }

            });
        }
    }


    let graph = new Graph;

    graph.addEdgeFromV1ToV2(0, 1, 1);
    graph.addEdgeFromV1ToV2(0, 2, 2);
    graph.addEdgeFromV1ToV2(0, 3, 7);
    graph.addEdgeFromV1ToV2(1, 0, 1);
    graph.addEdgeFromV1ToV2(1, 2, 4);
    graph.addEdgeFromV1ToV2(2, 0, 2);
    graph.addEdgeFromV1ToV2(2, 1, 4);
    graph.addEdgeFromV1ToV2(3, 0, 7);

    graph.print();

});
