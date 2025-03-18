//
// global variables
//

let width = 800;
let height = 800;

let cellSize = 20;
let cellRadius = 0;

let intervalDelay = 1000;

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
}

setInterval(main, intervalDelay);
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
function populateTable() {
  rows = [];
  for (let i = 0; i < rowsCount; i++) {
    let columns = [];
    for (let j = 0; j < columnsCount; j++) {
      columns.push(getRandomCellState());
    }
    rows.push(columns);
  }
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
// Utility functions
//

function getRandomCellState() {
  return Math.round(Math.random());
}
