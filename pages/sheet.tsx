import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import { chunk } from "lodash";
import { generateSquareSheetWithFreeSquare, FreeSquareCell } from "../lib/bingo/sheet";

const SHEET_SIZE = 5;
export const SHEET_THEMES = [
  {
    primary: "#fff",
    secondary: "#000",
    primaryText: "black",
    secondaryText: "white",
    debugText: "rgba(0,0,0,0.35)",
  },
  {
    primary: "#fff",
    secondary: "#3D9970",
    primaryText: "black",
    secondaryText: "white",
    debugText: "rgba(0,0,0,0.35)",
  },
  {
    primary: "#fff",
    secondary: "#B10DC9",
    primaryText: "black",
    secondaryText: "white",
    debugText: "rgba(0,0,0,0.35)",
  },
  {
    primary: "#fff",
    secondary: "#39CCCC",
    primaryText: "black",
    secondaryText: "white",
    debugText: "rgba(0,0,0,0.35)",
  },
];

const SheetContainer = styled.div`
  background: ${props => props.theme.primary};
  padding: 12px;
  font-family: Avenir Next;
`;

const SheetHeader = styled.div`
  text-align: center;

  h3 {
    margin: 18px;
    text-transform: uppercase;
    color: ${props => props.theme.secondary};
    font-size: 1.2rem;
    font-weight: bold;
  }

  h1 {
    color: ${props => props.theme.secondaryText};
    background: ${props => props.theme.secondary};
    padding: 16px;
    margin: 18px 0;
    font-size: 2.5rem;
    font-weight: bold;
  }
`;

const SheetTable = styled.table`
  width: 100%;
  border: 3px solid ${props => props.theme.secondary};
  border-collapse: collapse;

  tr:first-child td {
    border-top: none;
  }

  tr td:first-child {
    border-left: none;
  }
`;

const SheetRow = styled.tr`
  height: 76px;
`;

const SheetCell = styled.td`
  width: 20%;
  border: 3px solid ${props => props.theme.secondary};
  border-bottom: none;
  border-right: none;
  text-align: center;
  font-size: 2.5rem;
  color: ${props => props.theme.primaryText};
  vertical-align: middle;
`;

const SheetStarCell = styled(SheetCell)`
  color: #FFDC00;
  background: #FF851B;
  font-size: 4rem;
`;

const SheetFooter = styled.footer`
  display: flex;

  p {
    flex: 1;
    color: ${props => props.theme.primaryText};
    line-height: 140%;
    margin: 16px 0;
  }

  strong {
    font-weight: bold;
  }

  aside {
    color: ${props => props.theme.debugText};
    margin-top: 16px;
  }
`;

type SheetProps = {
  user: number;
  game: number;
};

export default class Index extends Component<SheetProps> {
  static getInitialProps({ query }) {
    return {
      user: query.user || 1,
      game: query.game ? parseInt(query.game, 10) : 1,
    };
  }

  render() {
    const sheet = generateSquareSheetWithFreeSquare(this.props.user, this.props.game)
      .map((row, i) => (
        <SheetRow key={i}>{
          row.map(value => value === FreeSquareCell ? <SheetStarCell key="star">★</SheetStarCell> : <SheetCell key={value}>{value}</SheetCell>)
        }</SheetRow>
      ));

    return (
      <ThemeProvider theme={SHEET_THEMES[this.props.game - 1] || {}}>
        <SheetContainer game={this.props.game}>
          <SheetHeader>
            <h3>Gibingo</h3>
            <h1>Game {this.props.game}</h1>
          </SheetHeader>

          <SheetTable>
            <tbody>
              {sheet}
            </tbody>
          </SheetTable>

          <SheetFooter>
            <p><strong>Prizes:</strong> 1 row, 3 rows and full sheet. <br/> ★ is a free square.</p>
            <aside>{this.props.user}</aside>
          </SheetFooter>
        </SheetContainer>
      </ThemeProvider>
    );
  }
}