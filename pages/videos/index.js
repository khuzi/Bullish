import React from 'react';
import { VideoHeader } from '@components/video/header';
import { TopMobileSearch } from '@components/video/top_mobile_search';
import { TopCategorySection } from '@components/video/top_category_section';
import { VideoListTemplateA } from '@components/video/video_list_template_a';
import { VideoFooter } from '@components/video/footer';
import HeadComponent from '@components/head';
import { FooterIncludes } from '@components/video/footer_includes';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { JSONLDManager } from 'src/lib/jsonldManager';
import { SearchManager } from 'src/lib/searchManager';
import { Pagination } from '@components/video/pagination';
import { StockManager } from 'src/lib/stockManager';
import { PAGINATION_TYPE } from 'src/const';
import { JWPVideo, VideoPagingResult } from 'src/docs/jstypes';

export default class VideoIndexPage extends React.Component {
    /**
     * @type {{
     *  current: VideoListTemplateA
     * }}
     */
    videoTemplateRef = React.createRef();


    /**
     * @type {{
    *  current: Pagination
    * }}
    */
    paginationRef = React.createRef();
    
    /**
     * @type {{
     *  videos: JWPVideo[],
     *  paging: VideoPagingResult
     * }}
     */
    state = {
        videos: [],
        paging: null
    }

    constructor(props){
        super(props);
        this.videoLoadCallback = this.videoLoadCallback.bind(this);
        //this.paginationRef.current.setPaging()
        this.videoTemplateRef = React.createRef();
    }

    componentDidUpdate(data){
        if(JSON.stringify(data.paging) !== JSON.stringify(this.props.paging)){
            //Update from server side rendering. Set videos and paging.
            this.paginationRef.current.setPaging(this.props.paging);
            this.videoTemplateRef.current.setVideos(this.props.videos);
        }
    }

    /**
     * @description Catches async loading of videos
     * @param {JWPVideo[]} result The videos to set to the template
     */
    videoLoadCallback(result){
        try{
            this.videoTemplateRef.current.onNewVideosLoaded(result)
        }catch(e){
            console.log({e});
        }
    }

    render() {
        console.log({
            "this.props.top_stocks": this.props.top_stocks
        });
        return (
            <div>
                <HeadComponent meta={this.props.meta} jsonLD={this.props.jsonLD} cssImports={HeadsImport.pageImports.css['video_index']}/>
                <VideoHeader />
                <div id="wrapper">
                    <div id="content-wrapper">
                        <div className="container-fluid pb-0">
                            <TopMobileSearch/>
                            <TopCategorySection 
                                section_title={"Top Stocks"}
                                items={this.props.top_stocks}/>
                            <VideoListTemplateA
                                title="Most recent videos"
                                ref={this.videoTemplateRef}
                                videos={this.props.videos}/>
                            <hr className="mt-0"/>
                        </div>
                        <Pagination 
                            ref={this.paginationRef}
                            type={PAGINATION_TYPE.LAZY} 
                            video_load_listener={this.videoLoadCallback}
                            paging={this.props.paging}/>
                        <VideoFooter data={this.props.footer} />
                    </div>
                </div>
                <FooterIncludes/>
            </div>
        )
    }
}

export async function getServerSideProps({query}){
    let { q, tags, sort, paging } = query;
    const meta = await MetaFetcher.fetchPageData('video_index');

    const {searchResults, resultingPaging} = await SearchManager.search(q, tags, sort, paging);
    const footerData = await MetaFetcher.fetchFooterData();
    let topStocks = await StockManager.fetchStockWeeklyOcurrences(10);
    console.log({topStocks});
    let topItems = StockManager.stockToCarouselItem(topStocks);
    let jsonLD = JSONLDManager.getSeveralVideosPageData(searchResults.slice(0, 5));
    //console.log({topItems});
    //console.log({topStocks: topStocks, length: topStocks.length});

    return {
        props: {
            meta: meta,
            API_ENDPOINT: process.env.REACT_APP_API_END,
            videos: searchResults,
            paging: resultingPaging || null,
            footer: footerData,
            top_stocks: topItems,
            jsonLD
        }
    }
}