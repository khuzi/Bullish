import React from "react";
import moment from "moment";
import { Article } from "../../../lib/objects/article";
import { Utils } from "@components/common/util";
import Link from "next/link";
import { ROUTES } from "src/const";

export class ArticleSearchItem extends React.Component {
  constructor(props) {
    super(props);
  }

  formattedDate(date) {
    return moment(date).format("MMMM D, YYYY");
  }

  /**
   * @param {Article} article The article element to get it's link from
   */
  getArticleUrl(article) {
    let URL = ROUTES.ARTICLE_PARTICULAR.replace(":article-slug", article.slug);
    return URL;
  }

  render() {
    /**
     * @type {Article} The article element
     */
    let article = this.props.item;

    let articleUrl = this.getArticleUrl(article);
    //console.log({articleUrl});

    return (
      <div
        style={{
          padding: 0,
          background: "var(--color-primary)",
          border: "none",
        }}
        className="card blog mb-4 col-lg-4 col-md-6 col-sm-12"
      >
        <div
          style={{
            width: "95%",
            background: "var(--color-primary-c)",
            borderRadius: "5px",
            height: "100%",
          }}
        >
          <div className="blog-header">
            <Link href={articleUrl}>
              <a>
                <img
                  className="card-img-top"
                  src={(article.featured || {}).link}
                  alt={(article.featured || {}).alt_text || "Article Image"}
                />
              </a>
            </Link>
          </div>
          <div className="card-body">
            <h5
              style={{
                maxHeight: "49px",
                overflow: "hidden",
              }}
            >
              <Link href={articleUrl}>
                <a
                  dangerouslySetInnerHTML={{
                    __html: Utils.fromHTML(article.title).substr(0, 50) + "...",
                  }}
                ></a>
              </Link>
            </h5>
            <div className="entry-meta">
              <ul className="tag-info list-inline">
                <li className="list-inline-item">
                  <a href="#">
                    <i className="fas fa-calendar"></i>
                    {this.formattedDate(article.date)}
                  </a>
                </li>
                <li className="list-inline-item">
                  <i className="fas fa-tag"></i>
                  {(Array.isArray(article.tags) ? article.tags : []).map(
                    (element, index) => (
                      <a rel="tag" key={index}>
                        {element.name},
                      </a>
                    )
                  )}
                </li>
                <li className="list-inline-item">
                  <i className="fas fa-comment"></i>
                  <a href="#">{article.commentCount} Comments</a>
                </li>
              </ul>
            </div>
            <p className="card-text">
              {Utils.fromHTML(article.content).substr(0, 100) + "..."}
            </p>
            <Link href={articleUrl}>
              <a>
                READ MORE <span className="fas fa-chevron-right"></span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
