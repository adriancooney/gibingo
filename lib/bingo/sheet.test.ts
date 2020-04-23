import {
  pickSquareSheetWithFreeSquareWinnings,
  FreeSquareCell,
  Sheet,
} from "./sheet";

describe("sheet", () => {
  describe("pickSquareSheetWithFreeSquareWinnings", () => {
    it("should find no winning rows", () => {
      const sheet = [
        [1, 2, 3, 4, 5],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];

      const pickedNumbers = [1, 2, 3];

      expect(
        pickSquareSheetWithFreeSquareWinnings(sheet, pickedNumbers, 5)
      ).toEqual(null);
    });

    it("should find horizontal winning row", () => {
      const sheet = [
        [1, 2, 3, 4, 5],
        [0, 0, 0, 0, 0],
        [1, 2, 3, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 2, 3, 4, 5],
      ];

      const pickedNumbers = [1, 2, 3, 4, 5];

      expect(pickSquareSheetWithFreeSquareWinnings(sheet, pickedNumbers, 5))
        .toMatchInlineSnapshot(`
        Object {
          "fullHouse": false,
          "rows": Object {
            "horizontalRows": Array [
              true,
              false,
              false,
              false,
              true,
            ],
            "southEastDiagonal": false,
            "southWestDiagonal": false,
            "verticalRows": Array [
              false,
              false,
              false,
              false,
              false,
            ],
          },
          "singleWinningRow": true,
          "threeWinningRows": false,
        }
      `);
    });

    it("should find vertical winning row", () => {
      const sheet = [
        [1, 0, 0, 0, 0],
        [2, 0, 0, 0, 0],
        [3, 2, 3, 0, 0],
        [4, 0, 0, 0, 0],
        [5, 2, 0, 4, 5],
      ];

      const pickedNumbers = [1, 2, 3, 4, 5];

      expect(pickSquareSheetWithFreeSquareWinnings(sheet, pickedNumbers, 5))
        .toMatchInlineSnapshot(`
        Object {
          "fullHouse": false,
          "rows": Object {
            "horizontalRows": Array [
              false,
              false,
              false,
              false,
              false,
            ],
            "southEastDiagonal": false,
            "southWestDiagonal": false,
            "verticalRows": Array [
              true,
              false,
              false,
              false,
              false,
            ],
          },
          "singleWinningRow": true,
          "threeWinningRows": false,
        }
      `);
    });

    it("should find vertical and horizontal winning rows", () => {
      const sheet = [
        [1, 0, 0, 0, 1],
        [2, 1, 3, 4, 5],
        [3, 2, 3, 0, 2],
        [4, 0, 0, 0, 3],
        [5, 2, 0, 4, 0],
      ];

      const pickedNumbers = [1, 2, 3, 4, 5];

      expect(pickSquareSheetWithFreeSquareWinnings(sheet, pickedNumbers, 5))
        .toMatchInlineSnapshot(`
        Object {
          "fullHouse": false,
          "rows": Object {
            "horizontalRows": Array [
              false,
              true,
              false,
              false,
              false,
            ],
            "southEastDiagonal": false,
            "southWestDiagonal": false,
            "verticalRows": Array [
              true,
              false,
              false,
              false,
              false,
            ],
          },
          "singleWinningRow": true,
          "threeWinningRows": false,
        }
      `);
    });

    it("should find three winning rows", () => {
      const sheet = [
        [1, 0, 0, 0, 1],
        [2, 1, 3, 4, 5],
        [3, 2, 3, 0, 2],
        [4, 0, 0, 0, 3],
        [5, 2, 0, 4, 4],
      ];

      const pickedNumbers = [1, 2, 3, 4, 5];

      expect(pickSquareSheetWithFreeSquareWinnings(sheet, pickedNumbers, 5))
        .toMatchInlineSnapshot(`
        Object {
          "fullHouse": false,
          "rows": Object {
            "horizontalRows": Array [
              false,
              true,
              false,
              false,
              false,
            ],
            "southEastDiagonal": false,
            "southWestDiagonal": false,
            "verticalRows": Array [
              true,
              false,
              false,
              false,
              true,
            ],
          },
          "singleWinningRow": true,
          "threeWinningRows": true,
        }
      `);
    });

    it("should find a full house", () => {
      const sheet = [
        [2, 1, 3, 4, 5],
        [2, 1, 3, 4, 5],
        [2, 1, 3, 4, 5],
        [2, 1, 3, 4, 5],
        [2, 1, 3, 4, 5],
      ];

      const pickedNumbers = [1, 2, 3, 4, 5];

      expect(pickSquareSheetWithFreeSquareWinnings(sheet, pickedNumbers, 5))
        .toMatchInlineSnapshot(`
        Object {
          "fullHouse": true,
          "rows": Object {
            "horizontalRows": Array [
              true,
              true,
              true,
              true,
              true,
            ],
            "southEastDiagonal": true,
            "southWestDiagonal": true,
            "verticalRows": Array [
              true,
              true,
              true,
              true,
              true,
            ],
          },
          "singleWinningRow": true,
          "threeWinningRows": true,
        }
      `);
    });

    it("should handle free squares", () => {
      const sheet: Sheet = [
        [1, 0, 0, 0, 1],
        [2, 1, 3, 4, 5],
        [3, 2, FreeSquareCell, 1, 2],
        [4, 0, 0, 0, 3],
        [5, 2, 0, 4, 4],
      ];

      const pickedNumbers = [1, 2, 3, 4, 5];

      expect(pickSquareSheetWithFreeSquareWinnings(sheet, pickedNumbers, 5))
        .toMatchInlineSnapshot(`
        Object {
          "fullHouse": false,
          "rows": Object {
            "horizontalRows": Array [
              false,
              true,
              true,
              false,
              false,
            ],
            "southEastDiagonal": false,
            "southWestDiagonal": false,
            "verticalRows": Array [
              true,
              false,
              false,
              false,
              true,
            ],
          },
          "singleWinningRow": true,
          "threeWinningRows": true,
        }
      `);
    });
  });
});
