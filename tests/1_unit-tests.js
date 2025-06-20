const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");

let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.validate(validPuzzle);
    assert.equal(result.error, null);
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    const invalidPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926c14.37.";
    const result = solver.validate(invalidPuzzle);
    assert.equal(result.error, "Invalid characters in puzzle");
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    const invalidPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.372.";
    const result = solver.validate(invalidPuzzle);
    assert.equal(result.error, "Expected puzzle to be 81 characters long");
  });

  test("Logic handles a valid row placement", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const grid = solver.puzzleToGrid(validPuzzle);
    const result = solver.checkRowPlacement(grid, 0, 1, 3);
    assert.equal(result, true);
  });

  test("Logic handles an invalid row placement", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const grid = solver.puzzleToGrid(validPuzzle);
    const result = solver.checkRowPlacement(grid, 0, 1, 1);
    assert.equal(result, false);
  });

  test("Logic handles a valid column placement", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const grid = solver.puzzleToGrid(validPuzzle);
    const result = solver.checkColPlacement(grid, 0, 0, 5);
    assert.equal(result, true);
  });

  test("Logic handles an invalid column placement", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const grid = solver.puzzleToGrid(validPuzzle);
    const result = solver.checkColPlacement(grid, 0, 0, 1);
    assert.equal(result, false);
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const grid = solver.puzzleToGrid(validPuzzle);
    const result = solver.checkRegionPlacement(grid, 0, 0, 3);
    assert.equal(result, true);
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const grid = solver.puzzleToGrid(validPuzzle);
    const result = solver.checkRegionPlacement(grid, 0, 0, 1);
    assert.equal(result, false);
  });

  test("Valid puzzle strings pass the solver", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.solve(validPuzzle);
    assert.equal(result.error, null);
  });

  test("Invalid puzzle strings fail the solver", () => {
    const invalidPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.372.";
    const result = solver.solve(invalidPuzzle);
    assert.equal(result.error, "Expected puzzle to be 81 characters long");
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.solve(validPuzzle);
    assert.equal(result.solution, puzzlesAndSolutions[0][1]);
  });
});
