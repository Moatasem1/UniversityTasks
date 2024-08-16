import { DSU, kthMSTs } from './kruskal.js';

document.addEventListener("DOMContentLoaded", () => {

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

    function drawAllGraphs(MSTs) {
        let coutner = 1;
        MSTs.forEach(mst => {
            createGraphContainerEl(coutner);
            drawGraph(coutner, mst.currentMST);
            coutner++;
        });
    }

    function createGraphContainerEl(id) {
        let graphContainerEl = document.createElement('div');

        graphContainerEl.innerHTML = `<div class="mt-5">
                                            <h3 class="fw-semibold">Spanning Tree ${id}</h3>
                                            <div class="rounded graph-wrapper" id="${id}"></div>
                                        </div>`;

        document.getElementById("graphsWrapper").appendChild(graphContainerEl);
    }

    let generateMSTBtn = document.getElementById("generateMSTBtn");
    let graphsWrapper = document.getElementById("graphsWrapper");
    let graphInput = document.getElementById("graphInput");

    generateMSTBtn.addEventListener("click", () => {

        let edges = getTextAreaInputAsEdges(graphInput.value);
        graphsWrapper.classList.remove("d-none");
        graphsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        drawGraph("orginalGraph", edges);
        let MSTs = new kthMSTs(edges);
        drawAllGraphs(MSTs.getAllMST());
    });

});