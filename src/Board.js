import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.1 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let j = 0; j < nrows; j++) {
      let rows = [];
      for (let i = 0; i < ncols; i++) {
        rows.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(rows)
    }

    //create array-of-arrays of true/false values
    return initialBoard;
  }

  function hasWon() {
    return board.every(r => r.every(cell => !cell));
    // check the board in state to determine whether the player has won.
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }

      };

      const boardCopy = oldBoard.map(r => [...r])
      // Make a copy of the oldBoard

      flipCell(y, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      //in the copy, flip this cell and the cells around it

      return boardCopy;
      // return the copy
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div>
        <h1
          style={{
            backgroundColor: "Green",
            color: "white"
          }}>
          You Won!
        </h1>
      </div>
    )
  }

  // make table board

  let tableBoard = [];

  for (let y = 0; y < nrows; y++) {
    let tableRows = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`
      tableRows.push(
        <Cell
          flipCellsAroundMe={() => flipCellsAround(coord)}
          isLit={board[y][x]} />
      )
    }
    tableBoard.push(<tr>{tableRows}</tr>)
  }

  return (
    <table className="Board">
      <tbody>
        {tableBoard}
      </tbody>
    </table>
  )

}

export default Board;
