import React, { Component } from "react";
import { generateSheet } from "../lib/bingo/sheet";

type SheetProps = {
  seed: string | null;
}

export default class Index extends Component<SheetProps> {
  static getInitialProps({ query }) {
    return {
      seed: query.seed || null,
    };
  }

  render() {
    const sheet = generateSheet(this.props.seed || 0);
    const sheetList = sheet.map((number, i) => <li key={i}>{number}</li>);

    return (
      <div>
        <h3>Sheet</h3>
        <ul>
          {sheetList}
        </ul>
      </div>
    );
  }
}