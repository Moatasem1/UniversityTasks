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

    function getVerticesNumberInGraph(edges) {
        if (!edges) return 0;

        const vertices = new Set();
        edges.forEach(edge => {
            vertices.add(edge.vertex1);
            vertices.add(edge.vertex2);
        });

        //in case user input have in non sequentail order
        return Math.max(...vertices);
    }

    function MST(edges, skipEgde = null) {

        edges.sort((edge1, edge2) => edge1.weight - edge2.weight);
        let noOfVertces = getVerticesNumberInGraph(edges);
        let dsuEdges = new DSU(noOfVertces);
        let spanningTree = [];
        let totalCost = 0;

        for (const edge of edges) {

            if (edge === skipEgde) {
                continue;
            }

            if (!dsuEdges.inSameSet(edge.vertex1, edge.vertex2)) {
                spanningTree.push(edge);
                totalCost += edge.weight;
                dsuEdges.union(edge.vertex1, edge.vertex2);
            }


            if (spanningTree.length == noOfVertces - 1)
                break;
        }

        return { spanningTree, totalCost };
    }

    function getAllMST(edges) {
        let minimumSpanningTrees = [];
        let checkedMSTs = new Set();
        let queue = [];

        let noOfVertices = getVerticesNumberInGraph(edges);
        let initialMST = MST(edges);

        queue.push({ mst: initialMST.spanningTree, totalCost: initialMST.totalCost });
        checkedMSTs.add(getMSTKey(initialMST.spanningTree));

        while (queue.length > 0) {
            let { mst: currenMST, totalCost } = queue.shift();

            minimumSpanningTrees.push({ currenMST, totalCost });

            // Generate new MST and add it to queue
            generateNewMST(edges, noOfVertices, currenMST, queue, checkedMSTs);
        }

        return minimumSpanningTrees.sort((mst1, mst2) => mst1.totalCost - mst2.totalCost);
    }

    function generateNewMST(edges, noOfVertices, currenMST, queue, checkedMSTs) {
        let currenMSTKey = getMSTKey(currenMST);

        currenMST.forEach(edgeFromMST => {
            edges.forEach(edgeFromAll => {
                if (!currenMST.includes(edgeFromAll) &&
                    isValidEdgeReplacement(noOfVertices, currenMST, edgeFromMST, edgeFromAll)) {

                    let newMST = currenMST.slice();
                    removeEdgeFromArray(newMST, edgeFromMST);
                    newMST.push(edgeFromAll);

                    let newMSTKey = getMSTKey(newMST);
                    if (!checkedMSTs.has(newMSTKey)) {
                        queue.push({ mst: newMST, totalCost: newMST.reduce((sum, edge) => sum + edge.weight, 0) });
                        checkedMSTs.add(newMSTKey);
                    }
                }
            });
        });
    }

    function getMSTKey(mst) {
        return mst.map(edge => [edge.vertex1, edge.vertex2].sort().toString()).sort().join(';');
    }

    function removeEdgeFromArray(array, edgeToRemove) {
        let removeIndex = array.findIndex(edge =>
            edge.vertex1 === edgeToRemove.vertex1 && edge.vertex2 === edgeToRemove.vertex2
        );

        if (removeIndex !== -1) {
            array.splice(removeIndex, 1);
        }
    }

    function isSpanningTreeHasCyle(noOfVertces, spanningTree) {

        let dsu = new DSU(noOfVertces);

        for (let edge of spanningTree) {

            if (dsu.inSameSet(edge.vertex1, edge.vertex2)) return false;// there is a cyle

            dsu.union(edge.vertex1, edge.vertex2);
        }

        return true;
    }

    function isValidEdgeReplacement(noOfVertces, currenMST, edgeToRemove, edgeToAdd) {

        let newMST = currenMST.slice();

        removeEdgeFromArray(newMST, edgeToRemove);

        newMST.push(edgeToAdd);

        return isSpanningTreeHasCyle(noOfVertces, newMST);
    }

    let edges = [
        { vertex1: 1, vertex2: 2, weight: 1 },
        { vertex1: 1, vertex2: 3, weight: 3 },
        { vertex1: 1, vertex2: 7, weight: 2 },
        { vertex1: 2, vertex2: 3, weight: 4 }
    ];

    console.log(getAllMST(edges));
});
