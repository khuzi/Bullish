import React from "react";
import Router from "next/router";

export default class TopPage extends React.Component {
  componentDidMount() {
    Router.push("/stocks");
  }
  render() {
    return <></>;
  }
}
