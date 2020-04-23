import seedrandom from "seedrandom";
import { sortBy, range, chunk, zip } from "lodash";

export const FreeSquareCell = Symbol("FreeSquare");
const DEFAULT_SHEET_SIZE = 5;
const DEFAULT_GAME_RANGE: GameNumberRange = [1, 75];

type SheetCell = number | typeof FreeSquareCell;
export type Sheet = SheetCell[][];
type Game = number[];
type GameNumberRange = readonly [number, number];
type GameWinnings = {
  singleWinningRow: boolean;
  threeWinningRows: boolean;
  fullHouse: boolean;
};

export function generateSquareSheetWithFreeSquare(userId: number, game = 1, sheetSize = DEFAULT_SHEET_SIZE, numberRange = DEFAULT_GAME_RANGE): Sheet {
  const randomSequence = seedShuffledRangeInclusive(`${userId}-${game}`, numberRange);
  const numberCount = (sheetSize * sheetSize) - 1; // 1 = free square
  const sheet = sortBy(randomSequence.slice(0, numberCount));
  sheet.splice(numberCount/2, 0, FreeSquareCell);
  return chunk(sheet, sheetSize);
}

export function generateGame(game, entropy = "game", numberRange: GameNumberRange = DEFAULT_GAME_RANGE): Game {
  return seedShuffledRangeInclusive(`${entropy}-${game}`, numberRange);
}

export function pickSquareSheetWithFreeSquareWinningsForUser(userId: number, game: number, pickedNumbers: number[], sheetSize = DEFAULT_SHEET_SIZE, numberRange = DEFAULT_GAME_RANGE) {
  return pickSquareSheetWithFreeSquareWinnings(generateSquareSheetWithFreeSquare(userId, game, sheetSize, numberRange), pickedNumbers, sheetSize);
}

export function pickSquareSheetWithFreeSquareWinnings(sheet: Sheet, pickedNumbers: number[], sheetSize: number): GameWinnings | null {
  // For a square sheet, there are three types of rows: vertical, horizontal, diagonal
  const sheetBinary = sheet.map(row => row.map(number => number === FreeSquareCell || pickedNumbers.includes(number)));
  const horizontalRows = sheetBinary.map(isWinningRow);
  const verticalRows = zip(...sheetBinary).map(isWinningRow);
  const southEastDiagonal = isWinningRow(pickDiagonalFromSheet(sheetBinary));
  const southWestDiagonal = isWinningRow(pickDiagonalFromSheet(sheetBinary.map(row => row.slice().reverse())));
  const winningRowCount = [...horizontalRows, ...verticalRows, southEastDiagonal, southWestDiagonal].filter(a => a).length;

  const winnings = {
    rows: {
      horizontalRows,
      verticalRows,
      southEastDiagonal,
      southWestDiagonal,
    },
    singleWinningRow: winningRowCount >= 1,
    threeWinningRows: winningRowCount >= 3,
    fullHouse: sheetBinary.every(isWinningRow),
  };

  if (winnings.singleWinningRow || winnings.threeWinningRows || winnings.fullHouse) {
    return winnings;
  } else {
    return null;
  }
}

function isWinningRow(row: boolean[]): boolean {
  return row.every(a => a);
}

function pickDiagonalFromSheet(sheet: boolean[][]): boolean[] {
  return sheet[0].map((row, i) => sheet[i][i]);
}

function seedShuffledRangeInclusive(seed: string, numberRange: GameNumberRange): number[] {
  return seedShuffle(seed, range(numberRange[0], numberRange[1] + 1));
}

function seedShuffle<T>(seed: any, array: T[]): T[] {
  const rng = seedrandom(seed);

  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.floor(rng() * array.length);
    const temporaryValue = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = temporaryValue;
  }

  return array;
}
