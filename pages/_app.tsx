import React from "react";
import NextApp from "next/app";
import Head from "next/head";

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>Bingo</title>
          <link href="/css/reset.css" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}
