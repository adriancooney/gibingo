# Gibingo
A simple app that generates bingo sheet and a small bingo number picker.

### To install
Install via `yarn`. It may take a while to install the `puppeteer` binary.

```sh
$ yarn
```

### To run a game
1. Open a spreadsheet and input all of the players names.
2. Assign each user an id start from 0..N
3. Generate N bingo sheets for your users using `render-sheet` (see below).
4. Send bingo sheets to users.
5. Start Zoom call with players.
6. Open number picker.

### Picking the numbers
Start the app:

```sh
$ yarn start
```

And navigate to http://localhost:3000/game.

* Press "Next Number" for the next number.
* Press "Next Game" for the next game.
* Add an `entropy=<value>` query parameter to change the game's randomness.

*Note:* Games are generated using a seeded random number generator. It allows us to repeatedly play games across refreshes and to deterministically generate user's sheets to check them on the fly.

### Generate the sheets
To generate sheets for 40 users into the `games` directory, start the server:

```sh
$ yarn start
```

And in another terminal, create the sheets:

```sh
$ yarn run bin:render-sheet --user-count 50 --games 4 --dir games
```

This will output sheets for you to send to your users.

At the bottom of the picker is a sheet checker. It allows you to determine if a sheet is a winner based upon the user id (which is also on the sheet at the bottom, slightly faded). The numbers are of the following format:

```
user id, 1st prize win, 2nd prize win, 3rd prize win, full horizontal rows, full vertical row, full south east diagonal, full south west diagonal
```

And an example:

```
14,1,0,0,00010,00000,0,0
```

Where after the user id `1` is true, `0` is false. The horizontal and vertical rows have a `0` or `1` for each row. So `00010` means the 4 row is full. The above example translates to:

> User 14 has won the first prize. Their 4th horizontal row is full.

Disclaimer: This was created with very little regard for code existing beyond Sunday 19th April, 2020 so apologies for any wtf moments.