document.addEventListener("DOMContentLoaded", () => {

    //Disjoint set union
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

    function getMSTEdgesUseKruskal(edges) {
        let mstEdges = [];

        if (!edges || edges.length === 0) return mstEdges;

        // Sort edges by weight in ascending order
        edges.sort((edge1, edge2) => edge1.weight - edge2.weight);

        const dsuEdges = new DSU(getVerticesNumberInGraph(edges));

        edges.forEach(edge => {
            if (!dsuEdges.inSameSet(edge.vertex1, edge.vertex2)) {
                mstEdges.push(edge);
                dsuEdges.union(edge.vertex1, edge.vertex2);
            }
        });

        console.log(mstEdges);
        return mstEdges;
    }

    function getEdgestAsCytoscapeData(edges) {
        let elements = [];

        edges.forEach(edge => {
            elements.push({ data: { id: edge.vertex1 } });
            elements.push({ data: { id: edge.vertex2 } });
        });
        edges.forEach(edge => {
            elements.push({ data: { source: edge.vertex1, target: edge.vertex2, weight: edge.weight } });
        });

        return elements;
    }

    function drawGraph(containerId, edges) {
        return cytoscape({
            container: document.getElementById(containerId),
            elements: getEdgestAsCytoscapeData(edges),
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#3d52a0',
                        'color': 'white',
                        'label': 'data(id)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': '14px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 1.6,
                        'line-color': '#8697c3',
                        'target-arrow-color': '#8697c3',
                        'target-arrow-shape': 'triangle',
                        'label': 'data(weight)',
                        'color': '#7191e6',
                        'font-size': '14px'
                    }
                }
            ]

            ,
            layout: {
                name: 'grid'
            }
        });
    }

    function getTextAreaInputAsEdges(textAreaInput) {
        let edges = [];
        let lines = textAreaInput.trim().split('\n');
        lines.forEach(line => {
            const [v1, v2, w] = line.trim().split(/\s+/);
            edges.push({ vertex1: v1, vertex2: v2, weight: w });
        });

        return edges;
    }

    let generateMSTBtn = document.getElementById("generateMSTBtn");
    let graphsWrapper = document.getElementById("graphsWrapper");
    let graphInput = document.getElementById("graphInput");

    generateMSTBtn.addEventListener("click", () => {
        let edges = getTextAreaInputAsEdges(graphInput.value);
        graphsWrapper.classList.remove("d-none");
        graphsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        drawGraph("orginalGraph", edges);
        drawGraph("mstGraph", getMSTEdgesUseKruskal(edges));
    });

});