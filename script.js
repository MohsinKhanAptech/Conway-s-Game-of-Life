//
// global variables
//

let width = 800;
let height = 800;

let cellSize = 5;
let cellRadius = 0;

let intervalDelay = 100;

let rowsCount = width / cellSize;
let columnsCount = height / cellSize;

let cellsCount = rowsCount * columnsCount;

let activeCellsCount = 0;
let inactiveCellsCount = cellsCount - activeCellsCount;

let rows = [];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//
function main() {
  drawBackground();

  populateTable();

  drawTable();

  setInterval(progressGeneration, intervalDelay);
}

main();

//
function drawBackground() {
  ctx.reset();
  ctx.fillStyle = "rgba(0,0,0,0.0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
}

//
function drawCell(x, y, size = cellSize, radius = cellRadius) {
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, radius);
  ctx.fill();
}

//
function drawTable() {
  rows.forEach((row, rowIndex) => {
    row.forEach((column, colIndex) => {
      if (column) {
        activeCellsCount++;
        drawCell(colIndex * cellSize, rowIndex * cellSize);
      }
    });
  });
  inactiveCellsCount = cellsCount - activeCellsCount;
}

//
function populateTable() {
  rows = [];
  for (let i = 0; i < rowsCount; i++) {
    let columns = [];
    for (let j = 0; j < columnsCount; j++) {
      // the chance of cell being alive is 50/2/2 = 12.5%
      if (getRandomCellState() && getRandomCellState()) {
        columns.push(getRandomCellState());
      } else {
        columns.push(0);
      }
    }
    rows.push(columns);
  }
}

//
function progressGeneration() {
  rows.forEach((row, rowIndex) => {
    row.forEach((_column, colIndex) => {
      let nearingActiveCells = 0;
      let cellStatus = rows[rowIndex][colIndex];

      // [1][2][3]
      // [4][x][5]
      // [6][7][8]

      if (rowIndex !== 0) {
        if (rows[rowIndex - 1][colIndex - 1])
          nearingActiveCells += rows[rowIndex - 1][colIndex - 1];
        if (rows[rowIndex - 1][colIndex - 0])
          nearingActiveCells += rows[rowIndex - 1][colIndex - 0];
        if (rows[rowIndex - 1][colIndex + 1])
          nearingActiveCells += rows[rowIndex - 1][colIndex + 1];
      }

      if (rows[rowIndex - 0][colIndex - 1])
        nearingActiveCells += rows[rowIndex - 0][colIndex - 1];
      if (rows[rowIndex - 0][colIndex + 1])
        nearingActiveCells += rows[rowIndex - 0][colIndex + 1];

      if (rowIndex !== rowsCount - 1) {
        if (rows[rowIndex + 1][colIndex - 1])
          nearingActiveCells += rows[rowIndex + 1][colIndex - 1];
        if (rows[rowIndex + 1][colIndex - 0])
          nearingActiveCells += rows[rowIndex + 1][colIndex - 0];
        if (rows[rowIndex + 1][colIndex + 1])
          nearingActiveCells += rows[rowIndex + 1][colIndex + 1];
      }

      if (cellStatus) {
        if (nearingActiveCells < 2 || nearingActiveCells > 3) {
          // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          rows[rowIndex][colIndex] = 0;
          activeCellsCount--;
        } else if (cellStatus && nearingActiveCells > 3) {
          // Any live cell with more than three live neighbours dies, as if by overpopulation.
          rows[rowIndex][colIndex] = 0;
          activeCellsCount--;
        } else if (nearingActiveCells === 2 || nearingActiveCells === 3) {
          // Any live cell with two or three live neighbours lives on to the next generation.
          rows[rowIndex][colIndex] = 1;
          activeCellsCount++;
        }
      } else {
        if (nearingActiveCells === 3) {
          // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          rows[rowIndex][colIndex] = 1;
          activeCellsCount++;
        } else {
          rows[rowIndex][colIndex] = 0;
          activeCellsCount--;
        }
      }
    });
  });

  inactiveCellsCount = cellsCount - activeCellsCount;

  drawBackground();
  drawTable();
}

//
// Utility functions
//

function getRandomCellState() {
  return Math.round(Math.random());
}
