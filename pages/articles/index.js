import React from "react";
import { VideoHeader } from "@components/video/header";
import { VideoFooter } from "@components/video/footer";
import HeadComponent from "@components/head";
import { FooterIncludes } from "@components/video/footer_includes";
import { MetaFetcher } from "src/lib/metaFetcher";
import { HeadsImport } from "src/lib/headsImports";
import { ArticleSearchItem } from "@components/article/search_item";
import { SearchSidebar } from "@components/article/search_sidebar";
import { JSONLDManager } from "src/lib/jsonldManager";
import { ArticleManager } from "src/lib/articleManager";
import { StockManager } from "src/lib/stockManager";
import { PAGINATION_TYPE } from "src/const";
import { ArticlePagination } from "@components/article/pagination";
import { Article } from "@lib/objects/article";

import classes from "../../public/styles/articles.module.css";
import Router from "next/router";

export default class ArticleMainPage extends React.Component {
  /**
   * @type {{
   *  articles: Article[]
   * }}
   */
  state = {
    articles: [],
    error: false,
    visible: 5,
  };

  /**
   * @type {React.Ref<ArticlePagination>}
   */
  navigation = React.createRef();

  constructor(props) {
    super(props);
    console.log("Constructor calling...");
    this.articlesLoaded = this.articlesLoaded.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
    this.setState((prev) => {
      return { visible: prev.visible + 5 };
    });
  }

  componentDidUpdate() {
    console.log("Component did update...", {
      "this.props.articles": this.props.articles,
      "this.props.paging": this.props.paging,
    });
    if (Array.isArray(this.props.articles)) {
      if (
        JSON.stringify(this.props.articles) !==
        JSON.stringify(this.state.articles)
      ) {
        //this.setState({ articles: this.props.articles || [] })
        console.log("Should update the articles...", {
          "this.props.articles": this.props.articles,
          "this.state.articles": this.state.articles,
        });
        ///*
        this.setState({
          articles: this.props.articles,
        });
        this.navigation.current.setPaging(this.props.paging);
        //*/
      }
    }
  }

  componentDidMount() {
    this.setState({
      articles: Array.isArray(this.props.articles) ? this.props.articles : [],
    });
  }

  articlesLoaded(articles) {
    this.setState({
      articles: this.state.articles.concat(articles),
    });
  }

  render() {
    return (
      <div className="blog-page">
        <HeadComponent
          meta={this.props.meta}
          jsonLD={this.props.jsonLD}
          cssImports={HeadsImport.pageImports.css["article_main"]}
        />
        <VideoHeader />
        <div id="wrapper">
          <div id="content-wrapper">
            <div className="container-fluid">
              <section className="section-padding">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        {this.state.articles
                          .slice(0, this.state.visible)
                          ?.map((element, index) => (
                            <ArticleSearchItem key={index} item={element} />
                          ))}
                      </div>
                      <ArticlePagination
                        ref={this.navigation}
                        type={PAGINATION_TYPE.LAZY}
                        load_listener={this.loadMore}
                        paging={this.props.paging}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <div className={classes.articles_sidebar}>
                        <SearchSidebar />
                      </div>
                    </div> */}
                  </div>
                </div>
              </section>
            </div>
            <VideoFooter data={this.props.footer} />
          </div>
        </div>
        <FooterIncludes />
      </div>
    );
  }
}

export async function getServerSideProps({ query }) {
  let { q, tags, sort, paging } = query;
  const meta = await MetaFetcher.fetchPageData("video_index");

  const footerData = await MetaFetcher.fetchFooterData();

  let topStocks = await StockManager.fetchStockWeeklyOcurrences(10);
  let topItems = StockManager.stockToCarouselItem(topStocks);

  let posts = await ArticleManager.searchPosts(1, 10, q || null);
  let returnPosts = JSON.parse(JSON.stringify(posts));

  let jsonLD = JSONLDManager.getArticlesPageData(returnPosts.posts);

  console.log({ jsonLD });

  return {
    props: {
      meta: meta,
      API_ENDPOINT: process.env.REACT_APP_API_END,
      footer: footerData,
      jsonLD,
      top_stocks: topItems,
      articles: returnPosts.posts,
      paging: returnPosts.paging,
    },
  };
}
