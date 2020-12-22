import React from 'react';
import { VideoHeader } from '@components/video/header';
import { VideoFooter } from '@components/video/footer';
import HeadComponent from '@components/head';
import RidgelineChart from '@components/stockPage/ridgelineChart';
import { InfluencerTweet } from '@components/stockPage/influencerTweet';
import { FooterIncludes } from '@components/video/footer_includes';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { ArticleSearchItem } from '@components/article/search_item';
import { VideoSingle } from "@components/video/video_single"
import { SearchSidebar } from '@components/article/search_sidebar';
import { SearchManager } from 'src/lib/searchManager';
import { ArticleManager } from 'src/lib/articleManager';
import { StockManager } from 'src/lib/stockManager';
import { Utils } from '@components/common/util';
import { TweetsManager } from '@lib/tweetsManager';
import { JWPlayerManager } from '@lib/jwPlayerManager';
import { JSONLDManager } from 'src/lib/jsonldManager';
import { ShowManager } from '@lib/showManager';
import { ServerUtils } from '@lib/utils';
import { ROUTES } from 'src/const';
const { get, post } = require("axios").default;

export default class StockMainPage extends React.Component {
    
    /**
     * @type {React.RefObject<RidgelineChart>}
     */
    ridgelineChart;

    constructor(props) {
        super(props);
        this.ridgelineChart = React.createRef();
    }

    componentDidMount(){
        Utils.WaitForCondition(()=>{
            return !!document.getElementById('ridgeline-chart');
        })
        .then(()=>{
            this.ridgelineChart.current.chart();
        })
    }

    render() {

        const { jsonLD, article, video, stock, series, avgOcc, tweets } = this.props;

        const h1Style = {
            textTransform: "uppercase",
            fontWeight: "800"
        }

        return (
            <div className="blog-page">
                <HeadComponent meta={this.props.meta} jsonLD={jsonLD} cssImports={HeadsImport.pageImports.css['stock_new']} />
                <VideoHeader />
                <div id="wrapper">
                    <div id="content-wrapper">
                        <div class="container-fluid">
                            <section class="section-padding">
                                <div class="container">
                                    <h1 style={h1Style}>{`${stock.company_name} - $${stock.ticker}`}</h1>

                                    <div class="row">

                                        <div class="col-md-8">
                                            {
                                                avgOcc ? 
                                                <div style={{height:"1100px"}}>
                                                    <RidgelineChart ticker={stock.ticker} avgOcc={avgOcc}
                                                    ref={this.ridgelineChart}
                                                    API_ENDPOINT={this.props.API_ENDPOINT}/>
                                                </div>
                                                 : <></>
                                            }
                                            {
                                                video ? 
                                                <VideoSingle video={video} series={series} /> : <></>
                                            }

                                            {
                                                article ? 
                                                <ArticleSearchItem item={article} /> : <></>    
                                            }

                                            {
                                                (tweets && tweets.length > 0) ? 
                                                <>
                                                {
                                                    tweets.map(element => (
                                                        <InfluencerTweet 
                                                            key={element.tweetId}
                                                            elementID={element.tweetId}
                                                            tweet={element}
                                                            style={{justifySelf: "stretch"}} />
                                                    ))
                                                }
                                                </> : <></>
                                            }
                                            <script src="https://platform.twitter.com/widgets.js"></script>
                                        </div>
                                        <div class="col-md-4">
                                            <h2>Company Description</h2>
                                            <p>{stock.description}</p>
                                            <h3>Stock Price Description</h3>
                                            <SearchSidebar />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <VideoFooter data={this.props.footer} />
                    </div>
                </div>
                <FooterIncludes />
            </div>
        )
    }
}



export async function getServerSideProps({ query, params }) {
    let { q, tags, sort, paging } = query; // testing name
    let newStockId;
    if(params){
        newStockId = params.newStockId;
    }
    newStockId = Array.isArray(newStockId) ? newStockId[0] : "tsla";

    let tickers = await StockManager.fetchStockTickers();
    
    //If new stock present AND exists on tickers
    if(newStockId && !tickers.map[newStockId.toUpperCase()]){
        console.log(`Stock ${newStockId} not found...`);
        ServerUtils.redirectTo(res, ROUTES.VIDEO);
        return {
            props: {}
        }
    }

    /**
     * @type {string}
     */
    let stockTicker = newStockId.toUpperCase();

    let data = await Promise.all([
        await MetaFetcher.fetchPageData('stock'),
        await MetaFetcher.fetchFooterData(),
        await StockManager.fetchStockMeta(stockTicker)
    ]);

    const meta = data[0];
    const footerData = data[1];


    let stockMeta = data[2];
    let stockMetadata=stockMeta[0];

    let posts = await ArticleManager.searchPosts(1, 1, stockTicker);
    let returnPosts = JSON.parse(JSON.stringify(posts));
    let stockId = (await StockManager.fetchStockTickers()).map[stockTicker.toUpperCase()].id;

    let ridgelineData = await StockManager.getAverageOcurrences(stockTicker);

    //console.log({ stockId });
    let tweets = await TweetsManager.fetchStockTweets(stockId);
    tweets = tweets.slice(0, 10);

    let searchResults = (await SearchManager.search(`${stockTicker}`, [], sort, 1, 1)).searchResults; // somewhow unable to get video by tags
    if(searchResults.length < 1){
        searchResults = (await SearchManager.search(`${stockMetadata.company_name}`, [], sort, 1, 1)).searchResults; // somewhow unable to get video by tags
        if(searchResults.length < 1){
            searchResults = (await JWPlayerManager.getContextPlaylist(`${stockMetadata.company_name}`)).playlist;
        }
    }
    let video = searchResults.length > 0 ? searchResults[0] : null;
    let series;
    if(video){
        series = await ShowManager.getVideoSeries(video);
        console.log({series});
    }

    let jsonLD = JSONLDManager.getStockPageData(stockMetadata, video, tweets, returnPosts.posts[0] || null);

    return {
        props: {
            meta: meta,
            API_ENDPOINT: process.env.REACT_APP_API_END,
            footer: footerData,
            article: returnPosts.posts[0] || null,
            video,
            series,
            query: query,
            stock: stockMetadata,
            avgOcc: ridgelineData,
            ticker: stockTicker,
            tweets,
            jsonLD
            // tweets
        }
    }
}
