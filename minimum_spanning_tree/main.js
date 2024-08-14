document.addEventListener("DOMContentLoaded", () => {
    class DSU {
        constructor(size) {
            this.parent = Array(size + 1).fill(null).map((_, i) => i);
            this.groupSize = Array(size + 1).fill(1);
            this.noOfNodes = size;
        }

        isNodeFound(node) {
            return node > 0 && node <= this.noOfNodes;
        }

        getGroupSize(node) {
            if (!this.isNodeFound(node)) return null;
            return this.groupSize[this.findParent(node)];
        }

        findParent(node) {
            if (!this.isNodeFound(node)) return null;

            if (this.parent[node] !== node) {
                this.parent[node] = this.findParent(this.parent[node]);
            }
            return this.parent[node];
        }

        inSameSet(node1, node2) {
            if (!(this.isNodeFound(node1) && this.isNodeFound(node2))) return false;
            return this.findParent(node1) === this.findParent(node2);
        }

        union(node1, node2) {
            if (!(this.isNodeFound(node1) && this.isNodeFound(node2))) return;

            let node1Parent = this.findParent(node1);
            let node2Parent = this.findParent(node2);

            if (node1Parent === node2Parent) return;

            const [largerGroup, smallerGroup] = this.groupSize[node1Parent] >= this.groupSize[node2Parent]
                ? [node1Parent, node2Parent] : [node2Parent, node1Parent];

            this.parent[smallerGroup] = largerGroup;
            this.groupSize[largerGroup] += this.groupSize[smallerGroup];
        }
    }

    class kthMSTs {
        constructor(edges) {
            this.edges = edges;
            this.noOfVertices = this.getVerticesNumberInGraph();
        }

        getAllMST() {
            let minimumSpanningTrees = [];
            let checkedMSTs = new Set();
            let queue = [];

            let initialMST = this.MST();

            queue.push({ mst: initialMST.spanningTree, totalCost: initialMST.totalCost });
            checkedMSTs.add(this.getMSTKey(initialMST.spanningTree));

            while (queue.length > 0) {
                let { mst: currentMST, totalCost } = queue.shift();

                minimumSpanningTrees.push({ currentMST, totalCost });

                this.generateNewMST(currentMST, queue, checkedMSTs);
            }

            return minimumSpanningTrees.sort((mst1, mst2) => mst1.totalCost - mst2.totalCost);
        }

        generateNewMST(currentMST, queue, checkedMSTs) {
            let currentMSTKey = this.getMSTKey(currentMST);

            currentMST.forEach(edgeFromMST => {
                this.edges.forEach(edgeFromAll => {
                    if (!currentMST.includes(edgeFromAll) &&
                        this.isValidEdgeReplacement(currentMST, edgeFromMST, edgeFromAll)) {

                        let newMST = currentMST.slice();
                        this.removeEdgeFromArray(newMST, edgeFromMST);
                        newMST.push(edgeFromAll);

                        let newMSTKey = this.getMSTKey(newMST);
                        if (!checkedMSTs.has(newMSTKey)) {
                            queue.push({ mst: newMST, totalCost: newMST.reduce((sum, edge) => sum + edge.weight, 0) });
                            checkedMSTs.add(newMSTKey);
                        }
                    }
                });
            });
        }

        getMSTKey(mst) {
            return mst.map(edge => [edge.vertex1, edge.vertex2].sort().toString()).sort().join(';');
        }

        MST() {
            this.edges.sort((edge1, edge2) => edge1.weight - edge2.weight);
            let dsuEdges = new DSU(this.noOfVertices);
            let spanningTree = [];
            let totalCost = 0;

            for (const edge of this.edges) {

                if (!dsuEdges.inSameSet(edge.vertex1, edge.vertex2)) {
                    spanningTree.push(edge);
                    totalCost += edge.weight;
                    dsuEdges.union(edge.vertex1, edge.vertex2);
                }

                if (spanningTree.length === this.noOfVertices - 1)
                    break;
            }

            return { spanningTree, totalCost };
        }

        getVerticesNumberInGraph() {
            if (!this.edges) return 0;

            const vertices = new Set();
            this.edges.forEach(edge => {
                vertices.add(edge.vertex1);
                vertices.add(edge.vertex2);
            });

            // in case user input has non-sequential order
            return Math.max(...vertices);
        }

        removeEdgeFromArray(array, edgeToRemove) {
            let removeIndex = array.findIndex(edge =>
                edge.vertex1 === edgeToRemove.vertex1 && edge.vertex2 === edgeToRemove.vertex2
            );

            if (removeIndex !== -1) {
                array.splice(removeIndex, 1);
            }
        }

        isSpanningTreeCycles(spanningTree) {
            let dsu = new DSU(this.noOfVertices);

            for (let edge of spanningTree) {
                if (dsu.inSameSet(edge.vertex1, edge.vertex2)) return false; // there is a cycle

                dsu.union(edge.vertex1, edge.vertex2);
            }

            return true;
        }

        isValidEdgeReplacement(currentMST, edgeToRemove, edgeToAdd) {
            let newMST = currentMST.slice();
            this.removeEdgeFromArray(newMST, edgeToRemove);
            newMST.push(edgeToAdd);
            return this.isSpanningTreeCycles(newMST);
        }
    }

    let edges = [
        { vertex1: 1, vertex2: 2, weight: 1 },
        { vertex1: 2, vertex2: 3, weight: 2 },
        { vertex1: 3, vertex2: 4, weight: 4 },
        { vertex1: 4, vertex2: 1, weight: 3 },
        { vertex1: 1, vertex2: 3, weight: 2 },
        { vertex1: 2, vertex2: 4, weight: 3 }
    ];

    let MSTs = new kthMSTs(edges);

    console.log(MSTs.getAllMST());
});

//https://www.geeksforgeeks.org/spanning-tree/
