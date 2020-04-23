import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import Link from "next/link";
import { chunk, range, sortBy } from "lodash";
import { generateGame, pickSquareSheetWithFreeSquareWinningsForUser } from "../lib/bingo/sheet";
import { SHEET_THEMES } from "./sheet";
import numbers from "../lib/bingo/numbers";

const USER_COUNT = 40;

const GameContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Avenir Next;
`;

const Controls = styled.ul`
  display: flex;

  li {
    margin: 6px;
  }
`;

const GameBox = styled.div`
  width: 1140px;
  height: 800px;
  display: flex;
  flex-direction: column;
`;

const GameBoxContent = styled.div`
  border: 5px solid ${props => props.theme.secondary};
  display: flex;
  flex-direction: column;
  padding: 18px;
  flex: 1;
`;

const GameHeader = styled.div`
  display: flex;
  height: 190px
`;

const GameTitle = styled.h1`
  font-size: 5rem;
  font-weight: bold;
  margin: 30px;
  margin-top: 50px;
  text-align: center;
`;

const CurrentNumber = styled.h3`
  font-size: 8rem;
  text-align: center;
  font-weight: bold;
  margin: 30px;
  margin-bottom: 5px;
`;

const CurrentNumberName = styled.h5`
  text-align: center;
  font-size: 180%;
`;

const NumberBoard = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding-top: 12px;
`;

const Number = styled.div`
  background: ${props => props.theme.secondary};
  color: white;
  font-size: 2rem;
  font-weight: bold;
  width: 60px;
  height: 60px;
  line-height: 60px;
  vertical-align: middle;
  border-radius: 30px;
  text-align: center;
  margin: 6px;
`;

const WinnersBoard = styled.div`
  display: flex;
  height: 135px;

  li {
    color: rgba(0,0,0,0.2);
    margin: 6px;
    font-size: 12px;
    font-family: monospace;
  }
`;

const Flex = styled.div`
  flex: 1;
`;

type SheetProps = {
  entropy: string | undefined;
  game: number;
};

export default class Index extends Component<SheetProps> {
  state = {
    currentNumberIndex: null,
  };

  static getInitialProps({ query }) {
    return {
      entropy: query.seed,
      game: query.game ? parseInt(query.game, 10) : 1,
    };
  }

  nextNumber = () => {
    this.setState({
      currentNumberIndex: this.state.currentNumberIndex === null ? 0 : this.state.currentNumberIndex + 1,
    });
  };

  resetGame = () => {
    this.setState({
      currentNumberIndex: null,
    });
  };

  render() {
    const game = generateGame(this.props.game, this.props.entropy);
    const pickedNumbers = game.slice(0, this.state.currentNumberIndex === null ? 0 : this.state.currentNumberIndex + 1);
    const currentNumber = this.state.currentNumberIndex === null ? null : game[this.state.currentNumberIndex];
    const remainingNumberCount = game.length - (this.state.currentNumberIndex === null ? 0 : this.state.currentNumberIndex);
    const visibleNumbers = pickedNumbers.slice(0, remainingNumberCount > 0 ? -1 : pickedNumbers.length);
    const winningUsers = range(1, USER_COUNT).map(user => ({
      user,
      winnings: pickSquareSheetWithFreeSquareWinningsForUser(user, this.props.game, this.props.entropy, pickedNumbers),
    })).filter(({ winnings }) => winnings);

    return (
      <ThemeProvider theme={SHEET_THEMES[this.props.game - 1] || {}}>
        <GameContainer>
          <Controls>
            <li><button onClick={this.nextNumber} disabled={remainingNumberCount <= 0}>Next Number</button></li>
            <li><Link href={this.formatNextGameUrl()}><a onClick={this.resetGame}>Next Game</a></Link></li>
          </Controls>
          <GameBox>
            <GameBoxContent>
              <GameHeader>
                <Flex>
                  <GameTitle>Game {this.props.game}</GameTitle>
                </Flex>
                <Flex>
                  <CurrentNumber>{remainingNumberCount > 0 ? currentNumber : "🎉"}</CurrentNumber>
                  <CurrentNumberName>{numbers[currentNumber] ? `(${numbers[currentNumber]})` : null}</CurrentNumberName>
                </Flex>
              </GameHeader>
              <Flex>
                <NumberBoard>
                  {visibleNumbers.map(number => <Number key={number}>{number}</Number>)}
                </NumberBoard>
              </Flex>
            </GameBoxContent>
            <WinnersBoard>
              {chunk(winningUsers, 7).map(winningUsers => <ul>{winningUsers.map(winningUser => <li>{formatWinningUser(winningUser)}</li>)}</ul>)}
            </WinnersBoard>
          </GameBox>
        </GameContainer>
       </ThemeProvider>
    );
  }

  formatNextGameUrl() {
    let url = `/game?game=${this.props.game + 1}`;

    if (this.props.entropy) {
      url += `&entropy=${this.props.entropy}`;
    }

    return url;
  }
}

function formatWinningUser({ user, winnings }) {
  return [
    user,
    binary(winnings.singleWinningRow),
    binary(winnings.threeWinningRows),
    binary(winnings.fullHouse),
    formatRow(winnings.rows.horizontalRows),
    formatRow(winnings.rows.verticalRows),
    binary(winnings.rows.southEastDiagonal),
    binary(winnings.rows.southWestDiagonal),
  ].join(",")
}

function formatRow(row) {
  return row.map(binary).join("");
}

function binary(bool: boolean): "0" | "1" {
  return bool ? "1" : "0";
}