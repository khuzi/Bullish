import { Utils } from "@components/common/util";
import { SidebarCardsNwsLtr } from "@components/newsletter/sidebarCard";
import { ROUTES } from "src/const";
import Router from "next/router";
import React from "react";

export class SearchSidebar extends React.Component {
  search(ev) {
    ev.preventDefault();
    let content = document.getElementById("sidebarSearch").value;
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
    Router.replace(`${ROUTES.ARTICLE}?${query}`);
    /*
        Router.push({
            pathname: ROUTES.ARTICLE,
            query: {
                q: encodeURIComponent(content)
            }
        }, undefined, {
            shallow: false
        });
        */
  }

  render() {
    return (
      <div className="blog-search-sidebar">
        <div className="card sidebar-card mb-4">
          <div className="card-body">
            <div className="input-group">
              <form onSubmit={this.search} id="articleSidebarSearchContainer">
                <input
                  type="text"
                  placeholder="Search For"
                  id="sidebarSearch"
                  className="form-control"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.search}
                  >
                    Search
                    <i
                      style={{ marginLeft: "0.2rem" }}
                      className="fas fa-arrow-right"
                    ></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="card sidebar-card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Categories</h5>
            <ul className="sidebar-card-list">
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Audio
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Gallery
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Image
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Uncategorized
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Video
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card sidebar-card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Archives</h5>
            <ul className="sidebar-card-list">
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> December, 2017
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> November, 2017
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> October, 2017
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card sidebar-card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Tags</h5>
            <div className="tagcloud">
              <a className="tag-cloud-link" href="#">
                coupon
              </a>
              <a className="tag-cloud-link" href="#">
                deals
              </a>
              <a className="tag-cloud-link" href="#">
                discount
              </a>
              <a className="tag-cloud-link" href="#">
                envato
              </a>
              <a className="tag-cloud-link" href="#">
                gallery
              </a>
              <a className="tag-cloud-link" href="#">
                sale
              </a>
              <a className="tag-cloud-link" href="#">
                shop
              </a>
              <a className="tag-cloud-link" href="#">
                stores
              </a>
              <a className="tag-cloud-link" href="#">
                video
              </a>
              <a className="tag-cloud-link" href="#">
                vimeo
              </a>
              <a className="tag-cloud-link" href="#">
                youtube
              </a>
            </div>
          </div>
        </div>
        <SidebarCardsNwsLtr />
        <div className="card sidebar-card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Meta</h5>
            <ul className="sidebar-card-list">
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Log in
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Entries RSS
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Comments RSS
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> WordPress.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
