import React from "react";
import Router from "next/router";
import Head from "next/head";
import App, { Container } from "next/app";
import { LoadingManager } from "@components/common/loadingManager";

export default class MyApp extends App {
  state = {
    loading: true,
  };
  constructor(props) {
    super(props);

    Router.onRouteChangeStart = (url) => {
      // Some page has started loading
      LoadingManager.showLoading();
    };

    Router.onRouteChangeComplete = (url) => {
      // Some page has finished loading
      LoadingManager.hideLoading();
    };

    Router.onRouteChangeError = (err, url) => {
      // an error occurred.
      LoadingManager.hideLoading();
    };
  }

  componentDidMount() {
    LoadingManager.hideLoading();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        <Head>
          <link rel="stylesheet" href="/styles/loading.css" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-811NRMMD15"
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', 'G-811NRMMD15');
							`,
            }}
          />
        </Head>
        <div id="loadingScreen">
          <img src="/loading_logo.png" style={{ height: "120px" }} />
        </div>
        <Component {...pageProps} />
      </div>
    );
  }
}

/*
function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />
}

export default MyApp
*/
