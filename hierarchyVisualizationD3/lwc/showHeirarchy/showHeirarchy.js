// hierarchyTreeChart.js
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/d3js';

// Import your Apex methods for fetching hierarchy data
import getHierarchyData from '@salesforce/apex/HierarchyController.getHierarchyData';
export default class ShowHeirarchy extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api width = 960;
    @api height = 600;
    @api nodeRadius = 10;
    @api maxLevels = 5;

    hierarchyData = null;
    isLoading = true;
    error = null;

    d3Initialized = false;
    svg = null;
    treeLayout = null;
    root = null;

    async connectedCallback() {
        try {
            await this.loadD3();
            if (this.recordId) {
                await this.loadHierarchyData();
            }
        } catch (error) {
            this.handleError('Error initializing component: ' + error.message);
        }
    }

    async loadD3() {
        try {
            await loadScript(this, D3 + '/d3.v7.min.js');
            this.d3Initialized = true;
            console.log('D3 loaded successfully');
        } catch (error) {
            this.handleError('Error loading D3: ' + error.message);
        }
    }

    async loadHierarchyData() {
        if (!this.recordId) return;

        this.isLoading = true;
        try {
            const result = await getHierarchyData({
                recordId: this.recordId,
                currObj: this.objectApiName,
                maxLevels: this.maxLevels
            });

            this.hierarchyData = result;
            this.error = null;
        } catch (error) {
            this.handleError('Error loading hierarchy data: ' + error.body.message);
        } finally {
            this.isLoading = false;
        }
    }

   renderedCallback() {
        // Only render once per data load
        if (this.d3Initialized && this.hierarchyData && !this.svg) {
            this.renderChart();
        }
    }

    renderChart() {
        const container = this.template.querySelector('.chart-container');
        if (!container) return;

        // Clear previous chart
        container.innerHTML = '';

        // Set up dimensions and margins
        const margin = { top: 20, right: 90, bottom: 30, left: 50 };
        const width = this.width - margin.left - margin.right;
        const height = this.height - margin.top - margin.bottom;

        // Create SVG
        this.svg = d3.select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        const g = this.svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create tree layout
        this.treeLayout = d3.tree().size([height, width]);

        // Convert hierarchy data to d3 hierarchy
        this.root = d3.hierarchy(this.hierarchyData, d => d.children);
        this.root.x0 = height / 2;
        this.root.y0 = 0;

        // Collapse all nodes initially except root
        this.root.children.forEach(this.collapse);

        this.update(this.root, g);
    }

    collapse = (d) => {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(this.collapse);
            d.children = null;
        }
    }

    update(source, g) {
        const treeData = this.treeLayout(this.root);
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);

        // Normalize for fixed-depth - increase spacing between levels
        nodes.forEach(d => { d.y = d.depth * 220; }); // Increased from 180 to 220 for more spacing

        // Update nodes
        const node = g.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this.nodeId || 0));

        // Enter new nodes
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', (event, d) => this.click(event, d, g));

        // Add circles for nodes
        nodeEnter.append('circle')
            .attr('class', 'node-circle')
            .attr('r', 1e-6)
            .style('fill', d => d._children ? '#ff6b6b' : '#4ecdc4')
            .style('stroke', '#333')
            .style('stroke-width', '2px')
            .style('cursor', 'pointer');

        // Add labels
        nodeEnter.append('text')
            .attr('class', d => d.depth === 0 ? 'node-text root-node' : 'node-text')
            .attr('dy', '.35em')
            .attr('x', d => {
                if (d.depth === 0) {
                    // Root node: always place text to the right
                    return 15;
                } else {
                    // Other nodes: left for parent nodes, right for leaf nodes
                    return d.children || d._children ? -15 : 15;
                }
            })
            .attr('text-anchor', d => {
                if (d.depth === 0) {
                    return 'start'; // Root node text starts from the node
                } else {
                    return d.children || d._children ? 'end' : 'start';
                }
            })
            .text(d => {
                const name = this.getNodeLabel(d.data);
                // Truncate very long names but show more characters for root node
                const maxLength = d.depth === 0 ? 25 : 20;
                return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
            })
            .style('fill-opacity', 1e-6)
            .style('font-size', d => d.depth === 0 ? '14px' : '12px')
            .style('font-family', 'Salesforce Sans, Arial, sans-serif')
            .style('font-weight', d => d.depth === 0 ? '600' : '500');

        // Add object type badge
        nodeEnter.append('text')
            .attr('class', d => d.depth === 0 ? 'node-type root-node' : 'node-type')
            .attr('dy', '1.5em')
            .attr('x', d => {
                if (d.depth === 0) {
                    return 15;
                } else {
                    return d.children || d._children ? -15 : 15;
                }
            })
            .attr('text-anchor', d => {
                if (d.depth === 0) {
                    return 'start';
                } else {
                    return d.children || d._children ? 'end' : 'start';
                }
            })
            .text(d => d.data.currObj || '')
            .style('fill', d => d.depth === 0 ? '#0176d3' : '#666')
            .style('font-size', d => d.depth === 0 ? '12px' : '10px')
            .style('font-family', 'Salesforce Sans, Arial, sans-serif')
            .style('font-weight', d => d.depth === 0 ? '500' : 'normal')
            .style('fill-opacity', 1e-6);

        // Transition nodes to their new position
        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(750)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle.node-circle')
            .transition()
            .duration(750)
            .attr('r', this.nodeRadius)
            .style('fill', d => d._children ? '#ff6b6b' : '#4ecdc4');

        nodeUpdate.select('text.node-text')
            .transition()
            .duration(750)
            .attr('x', d => {
                if (d.depth === 0) {
                    return 15;
                } else {
                    return d.children || d._children ? -15 : 15;
                }
            })
            .attr('text-anchor', d => {
                if (d.depth === 0) {
                    return 'start';
                } else {
                    return d.children || d._children ? 'end' : 'start';
                }
            })
            .style('fill-opacity', 1);

        nodeUpdate.select('text.node-type')
            .transition()
            .duration(750)
            .attr('x', d => {
                if (d.depth === 0) {
                    return 15;
                } else {
                    return d.children || d._children ? -15 : 15;
                }
            })
            .attr('text-anchor', d => {
                if (d.depth === 0) {
                    return 'start';
                } else {
                    return d.children || d._children ? 'end' : 'start';
                }
            })
            .style('fill-opacity', 1);

        // Remove exiting nodes
        const nodeExit = node.exit().transition()
            .duration(750)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // Update links
        const link = g.selectAll('path.link')
            .data(links, d => d.id);

        // Enter new links
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .style('fill', 'none')
            .style('stroke', '#ccc')
            .style('stroke-width', '2px')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.diagonal(o, o);
            });

        // Transition links to their new position
        const linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
            .duration(750)
            .attr('d', d => this.diagonal(d, d.parent));

        // Remove exiting links
        link.exit().transition()
            .duration(750)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .remove();

        // Store the old positions for transition
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }

    click(event, d, g) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update(d, g);
    }

    getNodeLabel(data) {
        // Customize this based on your data structure
        return data.name || data.label || data.id || 'Unknown';
    }

    handleError(message) {
        this.error = message;
        this.isLoading = false;
        console.error(message);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: message,
                variant: 'error'
            })
        );
    }

    refreshChart() {
        // Reset chart so renderedCallback will run again
        this.hierarchyData = null;
        this.svg = null;
        this.loadHierarchyData();
    }

    // Method to export chart as SVG
    exportAsSVG() {
        if (!this.svg) return null;

        const svgElement = this.template.querySelector('svg');
        if (svgElement) {
            return new XMLSerializer().serializeToString(svgElement);
        }
        return null;
    }

    // Additional methods for the component
    get chartContainerStyle() {
        return `min-height: ${this.height}px; width: 100%;`;
    }

    handleExport() {
        const svgContent = this.exportAsSVG();
        if (svgContent) {
            // Create blob and download
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hierarchy-${this.recordId}-${new Date().getTime()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Chart exported successfully',
                    variant: 'success'
                })
            );
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Unable to export chart',
                    variant: 'error'
                })
            );
        }
    }

    // Handle node selection events
    handleNodeSelect(nodeData) {
        // Dispatch custom event with selected node data
        const selectEvent = new CustomEvent('nodeselect', {
            detail: {
                nodeId: nodeData.id,
                nodeName: nodeData.name,
                currObj: nodeData.currObj,
                data: nodeData.data
            }
        });
        this.dispatchEvent(selectEvent);
    }

    // Method to programmatically expand/collapse nodes
    expandNode(nodeId) {
        if (!this.root) return;

        const targetNode = this.findNodeById(this.root, nodeId);
        if (targetNode && targetNode._children) {
            targetNode.children = targetNode._children;
            targetNode._children = null;
            const g = this.svg.select('g');
            this.update(targetNode, g);
        }
    }

    collapseNode(nodeId) {
        if (!this.root) return;

        const targetNode = this.findNodeById(this.root, nodeId);
        if (targetNode && targetNode.children) {
            targetNode._children = targetNode.children;
            targetNode.children = null;
            const g = this.svg.select('g');
            this.update(targetNode, g);
        }
    }

    expandAll() {
        if (!this.root) return;

        this.expandAllNodes(this.root);
        const g = this.svg.select('g');
        this.update(this.root, g);
    }

    collapseAll() {
        if (!this.root) return;

        this.collapseAllNodes(this.root);
        const g = this.svg.select('g');
        this.update(this.root, g);
    }

    findNodeById(node, nodeId) {
        if (node.data && node.data.id === nodeId) {
            return node;
        }

        if (node.children) {
            for (let child of node.children) {
                const found = this.findNodeById(child, nodeId);
                if (found) return found;
            }
        }

        if (node._children) {
            for (let child of node._children) {
                const found = this.findNodeById(child, nodeId);
                if (found) return found;
            }
        }

        return null;
    }

    expandAllNodes(node) {
        if (node._children) {
            node.children = node._children;
            node._children = null;
        }

        if (node.children) {
            node.children.forEach(child => this.expandAllNodes(child));
        }
    }

    collapseAllNodes(node) {
        if (node.children) {
            node._children = node.children;
            node.children = null;
        }

        if (node._children) {
            node._children.forEach(child => this.collapseAllNodes(child));
        }
    }
}