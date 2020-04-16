import seedrandom from "seedrandom";

export function generateSheet(seed: any, sheetSize = 24, range = [1, 75]) {
  const rng = seedrandom(seed);
  const sheet = [];

  while (sheet.length <= sheetSize) {
    const number = range[0] + Math.round(rng() * (range[1] - range[0]));

    if (!sheet.includes(number)) {
      sheet.push(number);
    }
  }

  return sheet;
}