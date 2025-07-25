"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    const { error } = solver.validate(puzzle);
    if (error) {
      return res.json({ error });
    }

    let row = coordinate.split("");
    const col = row.pop();
    row = row.join("");

    const mapRowToNumber = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
    };

    if (Number(col) < 1 || Number(col) > 9) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (isNaN(value) || value < 1 || value > 9) {
      return res.json({ error: "Invalid value" });
    }

    if (mapRowToNumber[row] === undefined) {
      return res.json({ error: "Invalid coordinate" });
    }

    const grid = solver.puzzleToGrid(puzzle);

    if (solver.isAlreadyPlaced(grid, mapRowToNumber[row], col - 1, value)) {
      return res.json({ valid: true, conflict: [] });
    }

    const conflicts = [];

    if (!solver.checkRowPlacement(grid, mapRowToNumber[row], col - 1, value)) {
      conflicts.push("row");
    }

    if (!solver.checkColPlacement(grid, mapRowToNumber[row], col - 1, value)) {
      conflicts.push("column");
    }

    if (
      !solver.checkRegionPlacement(grid, mapRowToNumber[row], col - 1, value)
    ) {
      conflicts.push("region");
    }

    res.json({ valid: conflicts.length === 0, conflict: conflicts });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    const { error, solution } = solver.solve(puzzle);

    if (error) {
      return res.json({ error });
    }

    if (solution === null) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    return res.json({ solution });
  });
};
