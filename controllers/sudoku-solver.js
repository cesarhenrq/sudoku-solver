class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }

    const regex = /^[1-9\.]{81}$/;
    if (!regex.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return { error: null };
  }

  checkRowPlacement(grid, row, column, value) {
    const rowValues = grid[row];
    return !rowValues.includes(value.toString());
  }

  checkColPlacement(grid, row, column, value) {
    const colValues = grid.map((row) => row[column]);
    return !colValues.includes(value.toString());
  }

  checkRegionPlacement(grid, row, col, value) {
    const regionStartRow = Math.floor(row / 3) * 3;
    const regionStartCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[regionStartRow + i][regionStartCol + j] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const { error } = this.validate(puzzleString);
    if (error) {
      return { error };
    }
    const grid = this.puzzleToGrid(puzzleString);
    const solvedGrid = this.solveGrid(grid);

    return {
      solution: solvedGrid ? this.gridToString(solvedGrid) : null,
      error: null,
    };
  }

  puzzleToGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      const row = puzzleString.slice(i * 9, (i + 1) * 9).split("");
      grid.push(row);
    }
    return grid;
  }

  solveGrid(grid) {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) {
      return grid;
    }

    const { row, col } = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (this.isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num.toString();
        const result = this.solveGrid(grid);
        if (result) {
          return result;
        }

        grid[row][col] = ".";
      }
    }

    return null;
  }

  isValidPlacement(grid, row, col, num) {
    return (
      this.checkRowPlacement(grid, row, col, num) &&
      this.checkColPlacement(grid, row, col, num) &&
      this.checkRegionPlacement(grid, row, col, num)
    );
  }

  findEmptyCell(grid) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === ".") {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }

  gridToString(grid) {
    return grid.map((row) => row.join("")).join("");
  }

  isAlreadyPlaced(grid, row, col, num) {
    return grid[row][col] === num.toString();
  }
}

module.exports = SudokuSolver;
