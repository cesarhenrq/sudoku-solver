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

    const row = coordinate.split("")[0];
    const col = coordinate.split("")[1];

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

    if (col < 1 || col > 9) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (isNaN(value) || value < 1 || value > 9) {
      return res.json({ error: "Invalid value" });
    }

    if (mapRowToNumber[row - 1] === undefined) {
      return res.json({ error: "Invalid coordinate" });
    }

    const grid = solver.puzzleToGrid(puzzle);

    const conflicts = [];
    if (
      !solver.checkRowPlacement(grid, mapRowToNumber[row - 1], col - 1, value)
    ) {
      conflicts.push("row");
    }

    if (
      !solver.checkColPlacement(grid, mapRowToNumber[row - 1], col - 1, value)
    ) {
      conflicts.push("column");
    }

    if (
      !solver.checkRegionPlacement(
        grid,
        mapRowToNumber[row - 1],
        col - 1,
        value
      )
    ) {
      conflicts.push("region");
    }

    res.json({ valid: conflicts.length === 0, conflicts });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    const { error } = solver.validate(puzzle);
    if (error) {
      res.json({ error });
    } else {
      const solution = solver.solve(puzzle);
      res.json({ solution });
    }
  });
};
