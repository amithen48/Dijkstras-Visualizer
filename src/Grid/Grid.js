import React, { useState, useEffect } from "react";

import Node from "../Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/Dijkstra";

import "./Grid.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 25;

const Grid = () => {
  const [pickState, setPickState] = useState({
    pickStart: false,
    pickFinish: false,
    pickWall: false,
  });

  const [wallNodes, setWallNodes] = useState({
    wallArray: [],
  });

  const [StartNode, setStartNode] = useState({
    col: START_NODE_COL,
    row: START_NODE_ROW,
  });

  const [FinishNode, setFinishNode] = useState({
    col: FINISH_NODE_COL,
    row: FINISH_NODE_ROW,
  });

  const getInitialGrid = () => {
    const grid = [];
    console.log(wallNodes.wallArray);
    for (let row = 0; row < 20; row++) {
      const currRow = [];
      for (let col = 0; col < 50; col++) {
        const currNode = {
          className: "node",
          col: col,
          row: row,
          isStart: row === StartNode.row && col === StartNode.col,
          isFinish: row === FinishNode.row && col === FinishNode.col,
          distance: Infinity,
          isVisited: false,
          isWall: wallNodes.wallArray.some(
            (e) => e.row === row && e.col === col
          ),
          previousNode: null,
        };
        currRow.push(currNode);
      }
      grid.push(currRow);
    }
    return grid;
  };

  const [grid, setNodes] = useState(() => getInitialGrid());

  useEffect(() => {
    setNodes(getInitialGrid());
  }, [StartNode, FinishNode, wallNodes]);

  const onClickNode = (node) => {
    if (pickState.pickStart) {
      setPickState({ pickStart: true, pickFinish: false, pickWall: false });
      setStartNode({
        row: node.row,
        col: node.col,
      });
    }

    if (pickState.pickFinish) {
      setPickState({ pickStart: false, pickFinish: true, pickWall: false });
      setFinishNode({
        row: node.row,
        col: node.col,
      });
    }

    if (pickState.pickWall) {
      setPickState({ pickStart: false, pickFinish: false, pickWall: true });
      const wallNode = { row: node.row, col: node.col };
      let array = [...wallNodes.wallArray];
      if (
        array.some((item) => item.row === node.row && item.col === node.col)
      ) {
        array = array.filter(
          (item) => item.row !== node.row || item.col !== node.col
        );
      } else {
        array.push(wallNode);
      }
      setWallNodes({
        wallArray: array,
      });
    }
  };
  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    const startNode = grid[StartNode.row][StartNode.col];
    const finishNode = grid[FinishNode.row][FinishNode.col];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  return (
    <div>
      <button className="button" onClick={() => visualizeDijkstra()}>
        Visualize Dijkstra's Algorithm
      </button>
      <button
        className="button"
        onClick={() =>
          setPickState({ pickStart: true, pickFinish: false, pickWall: false })
        }
      >
        Pick Start
      </button>
      <button
        className="button"
        onClick={() =>
          setPickState({ pickStart: false, pickFinish: true, pickWall: false })
        }
      >
        Pick Finish
      </button>
      <button
        className="button"
        onClick={() =>
          setPickState({ pickStart: false, pickFinish: false, pickWall: true })
        }
      >
        Pick Wall
      </button>
      <div className="grid">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex}>
              {row.map((node, nodeIndex) => {
                return (
                  <Node
                    className={node.className}
                    onClick={onClickNode}
                    key={nodeIndex}
                    isStart={node.isStart}
                    isFinish={node.isFinish}
                    col={node.col}
                    row={node.row}
                    distance={node.distance}
                    isVisited={node.isVisited}
                    isWall={node.isWall}
                    previousNode={node.previousNode}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
