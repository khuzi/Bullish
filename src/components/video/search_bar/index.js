import React from "react";
import { Utils } from "@components/common/util";
import Router from "next/router";
import { ROUTES } from "../../../const";

export class SearchBar extends React.Component {
  state = {
    query: null,
  };

  constructor(props) {
    super(props);
    this.inputChanged = this.inputChanged.bind(this);
    this.search = this.search.bind(this);
  }

  inputChanged(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  searchArticles(ev) {
    ev.preventDefault();
    let content = this.state.query;
    if (!content) {
      return;
    }
    let newUrl = Utils.asembleRelativeSearchURL(
      Router,
      content,
      null,
      null,
      null
    );
    let query = newUrl.split("?")[1];
    Router.push(`${ROUTES.ARTICLE}?${query}`);
  }

  search(ev) {
    if (ev) {
      ev.preventDefault();
    }
    const url = Utils.assembleRouterSearchURL(Router, this.state.query);
    if (!this.state.query) {
      //We clean the query
      Router.push("/videos/search");
    } else {
      Router.push(url);
    }
  }

  render() {
    return (
      <form
        onSubmit={(e) => {
          if (Router.route.match("/articles")) {
            this.searchArticles(e);
          } else {
            this.search(e);
          }
        }}
        className={`${this.props.formClass || ""}`}
      >
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${this.props.className || ""}`}
            name="query"
            onChange={this.inputChanged}
            placeholder={this.props.placeholder || "Search for..."}
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-dark"
              onClick={(e) => {
                if (Router.route.match("/articles")) {
                  this.searchArticles(e);
                } else {
                  this.search(e);
                }
              }}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </form>
    );
  }
}
