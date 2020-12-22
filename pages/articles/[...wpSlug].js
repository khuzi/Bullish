import React from 'react';
import { VideoHeader } from '@components/video/header';
import { VideoFooter } from '@components/video/footer';
import HeadComponent from '@components/head';
import { FooterIncludes } from '@components/video/footer_includes';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { SearchSidebar } from '@components/article/search_sidebar';
import { StockManager } from 'src/lib/stockManager';
import { ArticleManager } from '@lib/articleManager';
import { JSONLDManager } from 'src/lib/jsonldManager';
import { ArticleItem } from '@components/article/article_item';
import { MentionedStockInArticle } from '@components/article/mentioned_stock';
import { ServerUtils } from '@lib/utils';
import { ROUTES } from 'src/const';
import { JWPlayerManager } from '@lib/jwPlayerManager';
import { VideoListTemplateB } from '@components/video/video_list_template_b';
import { SingleVideoLowerVideoList } from '@components/video/video_list_template_d';

export default class ArticlePage extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        const { jsonLD, meta, article, foundStocksData, footer } = this.props;

        return (
            <div className="blog-page">
                <HeadComponent jsonLD={jsonLD} meta={meta} cssImports={HeadsImport.pageImports.css['article_main']} />
                <VideoHeader />
                <div id="wrapper">
                    <div id="content-wrapper">
                        <div class="container-fluid">
                            <section class="blog-page section-padding">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-8">
                                            {
                                                article ? 
                                                <ArticleItem item={article}/> : 
                                                <>
                                                    <h1>404 - Article not found</h1>
                                                </>
                                            }
                                            <SingleVideoLowerVideoList
                                                title="Related videos"
                                                videos={this.props.playlist} />
                                        </div>
                                        <div class="col-md-4">
                                            <MentionedStockInArticle tweetTickers={foundStocksData}/>
                                            <SearchSidebar/>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <VideoFooter data={footer} />
                    </div>
                </div>
                <FooterIncludes />
            </div>
        )
    }
}

export async function getServerSideProps({ query, params }) {
    let { q, tags, sort, paging } = query;
    let {wpSlug} = params;
    wpSlug = wpSlug[0];

    const meta = await MetaFetcher.fetchPageData('blog');
    const footerData = await MetaFetcher.fetchFooterData();
    let topStocks = await StockManager.fetchStockWeeklyOcurrences(10);
    let topItems = StockManager.stockToCarouselItem(topStocks);
    //console.log({wpSlug});
    let article = await ArticleManager.getPost(wpSlug);
    if(!article){
        ServerUtils.redirectTo(res, ROUTES.ARTICLE);
        return {
            props: {}
        }
    }
    let foundStocksData = await StockManager.getArticleStocksItems(article);
    let articleSearch = article.content.substr(0, 120);
    let playlist = await JWPlayerManager.getContextPlaylist(articleSearch)
    
    
    article = JSON.parse(JSON.stringify(article));
    //let posts = await ArticleManager.searchPosts(1);
    //let returnPosts = JSON.parse(JSON.stringify(posts));

    let articleJLD = JSONLDManager.getArticlePageData(article);

    return {
        props: {
            meta: meta,
            API_ENDPOINT: process.env.REACT_APP_API_END,
            footer: footerData,
            top_stocks: topItems,
            //articles: returnPosts.posts,
            //pagination: returnPosts.paging,
            jsonLD: articleJLD,
            article: article,
            foundStocksData: foundStocksData || null,
            playlist: playlist.playlist
        }
    }
}