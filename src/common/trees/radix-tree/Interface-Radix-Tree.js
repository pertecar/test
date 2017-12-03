/*
    Used to Radix Tree (Patricia Tree) a Buffer (CryptoWebDollarData)

    Radix Tree is an optimized Trie especially for very log texts

    Tutorials:

        https://en.wikipedia.org/wiki/Radix_tree

        https://www.cs.usfca.edu/~galles/visualization/RadixTree.html   - animated demo
 */

import WebDollarCryptoData from "common/crypto/Webdollar-Crypto-Data";

import InterfaceRadixTreeNode from "./Interface-Radix-Tree-Node"
import InterfaceRadixTreeEdge from "./Interface-Radix-Tree-Edge"

import InterfaceTree from "common/trees/Interface-Tree"

class InterfaceRadixTree extends InterfaceTree{

    constructor(){

        super();

        this.root = this.createNode(null,  [], null );
    }

    createNode(parent, edges, value, leaf){
        return new InterfaceRadixTreeNode(parent, edges, value, leaf);
    }

    createEdge(label, targetNode){
        return new InterfaceRadixTreeEdge(label, targetNode);
    }

    changedNode(node){
        //no changes in a simple radix tree
    }

    /**
     * Adding an input to the Radix Tree
     * @param element can be a Base String, Buffer or CryptoWebDollarData
     */
    add(input, value){

        input = WebDollarCryptoData.createWebDollarCryptoData(input)

        let nodeCurrent = this.root;

        // console.log("input.buffer", input.buffer)

        let i=0;
        while (i < input.buffer.length) {

            //searching for existence of input[i...] in nodeCurrent list

            let childFound = false;
            let match = null;

            let skipOptimization = true; // including multiple not-finished nodes
            while (skipOptimization && childFound === false && nodeCurrent !== null) { //

                let nodePrevious = nodeCurrent;

                for (let j = 0; j < nodeCurrent.edges.length; j++){

                    match = input.longestMatch(nodeCurrent.edges[j].label, i);

                    //console.log("match", match);

                    if (match !== null){   //we found  a match in the edge

                        //the match is smaller
                        if (match.buffer.length < nodeCurrent.edges[j].label.buffer.length){

                            let edge = nodeCurrent.edges[j];

                            // We remove edge j
                            nodeCurrent.edges.splice(j,1);

                            // Adding the new nodeMatch by edge Match
                            //console.log("nodeCurrent.parent", nodeCurrent.parent);

                            let nodeMatch = this.createNode( nodeCurrent,  [], null, false);
                            nodeCurrent.edges.push( this.createEdge( match, nodeMatch ));

                            // Adding the new nodeEdge to the nodeMatch
                            nodeMatch.edges.push( this.createEdge( edge.label.substr(match.buffer.length), edge.targetNode), )
                            edge.targetNode.parent = nodeMatch;

                            // Adding thew new nodeChild with current Value
                            let nodeChild = this.createNode( nodeMatch, [], value, true );
                            nodeMatch.edges.push( this.createEdge(input.substr(i+match.buffer.length), nodeChild));

                            nodeCurrent = nodeChild;

                            this.changedNode(nodeMatch)
                            this.changedNode(nodeChild)

                            // Marking that it is done
                            i = input.buffer.length+1;


                        } else {
                            i += nodeCurrent.edges[j].label.buffer.length;
                            nodeCurrent = nodeCurrent.edges[j].targetNode;
                        }
                        childFound = true;
                        break;

                    }
                }

                //in case it got stuck in the root
                if (nodePrevious !== nodeCurrent) skipOptimization = true;
                else skipOptimization = false;
            }

            if (!childFound) { //child not found, let's create a new Child with the remaining input [i...]

                // no more Children...
                let nodeChild = this.createNode(nodeCurrent, [], value, true );
                nodeCurrent.edges.push( this.createEdge( input.substr(i), nodeChild));
                nodeCurrent = nodeChild;

                this.changedNode(nodeChild)
                //console.log("input.substr", input.substr(i));

                break; //done
            }


        }

        //nodeCurrent will be the last child added in the list
        return nodeCurrent;

    }

    /**
     * Delete Node from the Radix Tree
     * @param input
     */
    delete(input){

        input = WebDollarCryptoData.createWebDollarCryptoData(input)

        let searchResult = this.search(input);

        //console.log("searchResult", searchResult)
        if (typeof searchResult.node === "undefined" || searchResult.node === null) return false;

        //it is the last element, we should delete it
        let finished = false;

        let node = searchResult.node;
        node.value = null;
        node.leaf = false;

        while ( !finished && node !== null){

            let nodeParent = node.parent;

            finished = true;

            //remove empty parent nodes
            if ( node !== null && !node.leaf && nodeParent !== null && node.edges.length === 0){

                //removing edge to child from parent

                //console.log("node simplu before", node, node.parent);

                for (let i=0; i<nodeParent.edges.length; i++)
                    if (nodeParent.edges[i].targetNode === node) {
                        nodeParent.edges.splice(i, 1);
                        break;
                    }

                // remove special kind of prefixes nodes
                if ( nodeParent.parent !== null && !nodeParent.leaf  && nodeParent.edges.length === 1 ){

                    let edge = nodeParent.edges[0];
                    node = nodeParent.edges[0].targetNode;
                    let grandParent = nodeParent.parent;

                    //console.log("grandParent", grandParent, node);

                    //replace grand parent edge child
                    for (let i=0; i<grandParent.edges.length; i++)
                        if (grandParent.edges[i].targetNode === nodeParent){

                            grandParent.edges[i].label = new WebDollarCryptoData.createWebDollarCryptoData( Buffer.concat( [ grandParent.edges[i].label.buffer, edge.label.buffer  ] ));
                            grandParent.edges[i].targetNode = node;

                            node.parent = grandParent;

                            // it is not necessary its parent
                            this.changedNode(node);

                            //console.log("grandParent deletion", node, nodeParent);
                            break;
                        }

                } else {
                    node = nodeParent;
                }

                finished = false;
                nodeParent = node.parent;

                this.changedNode(node)

                //console.log("node simplu after", node, node.parent);
            }


            //delete edges to empty codes
            if (node !== null && !node.leaf && node.edges.length > 0){

                //console.log("node..... ", nodeParent, node.value, node.edges)

                let bDeleted = false;
                for (let i=node.edges.length-1; i>=0; i--)
                    if (node.edges[i].targetNode.leaf === false && node.edges[i].targetNode.edges.length === 0 ) {
                        node.edges.splice(i, 1);
                        bDeleted = true;
                    }

                if (bDeleted){
                    this.changedNode(node)
                    finished = false;
                    //console.log("node deleted", node.value, node.edges)
                }
            }

            if (node !== null && nodeParent !== null && !node.leaf && node.edges.length === 0 && node !== this.root ){

                //console.log("node22..... ", node.value, node.edges)

                for (let i=nodeParent.edges.length-1; i>=0; i--)
                    if (nodeParent.edges[i].targetNode === node) {

                        nodeParent.edges.splice(i, 1);
                        finished = false;

                        node = node.parent;
                        nodeParent = node.parent;

                        this.changedNode(node);
                        break;
                    }
            }

        }

        return true;
    }


    /**
     * Searching an input in the Radix Tree
     * @param input
     */
    search(input){

        input = WebDollarCryptoData.createWebDollarCryptoData(input)

        let nodeCurrent = this.root;

        let i=0;
        while (i < input.buffer.length) {

            // searching for existence of input[i...] in nodeCurrent list

            let childFound = false;

            for (let j = 0; j < nodeCurrent.edges.length; j++){

                let match = input.longestMatch( nodeCurrent.edges[j].label, i );

                //console.log("matchFound", nodeCurrent.edges[j].label.toString(), " in ", input.toString(), " i= ",i, match === null ? "null" : match.toString() );

                if (match !== null && match.buffer.length === nodeCurrent.edges[j].label.buffer.length) {   //we found  a match in the edge

                    nodeCurrent = nodeCurrent.edges[j].targetNode;

                    i += match.buffer.length;

                    childFound = true;
                    break;
                }

            }

            if (!childFound) //child not found, we should search no more
                return {result: false }
        }

        return { result: (nodeCurrent.value !== null), node: nodeCurrent, value: nodeCurrent.value }
    }

}

export default InterfaceRadixTree