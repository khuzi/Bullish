import React from 'react';
import { VideoHeader } from '@components/video/header';
import { TopMobileSearch } from '@components/video/top_mobile_search';
import { VideoFooter } from '@components/video/footer';
import { FooterIncludes } from '@components/video/footer_includes';
import { VideoSingle } from '@components/video/video_single';
import { VideoListTemplateB } from '@components/video/video_list_template_b';
import HeadComponent from '@components/head';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { JWPlayerManager } from 'src/lib/jwPlayerManager';
import { ServerUtils } from 'src/lib/utils';
import { JSONLDManager } from 'src/lib/jsonldManager';
import { StockManager } from '@lib/stockManager';
import { MentionedStockInVideo } from '@components/video/mentioned_stock';
import { ROUTES } from 'src/const';
import { SingleVideoLowerVideoList } from '@components/video/video_list_template_d';
import { ShowManager } from '@lib/showManager';
import { JWPVideo } from 'src/docs/jstypes';

export default class WatchVideoPage extends React.Component {

    /**
    * @type {{
    *  current: SingleVideoLowerVideoList
    * }}
    */
    videoTemplateRef = React.createRef();

    componentDidUpdate(data){
        if(JSON.stringify(this.props.lowerVideoPlaylist) !== JSON.stringify(data.lowerVideoPlaylist)){
            this.videoTemplateRef.current.setVideos(this.props.lowerVideoPlaylist)
        }
    }

    render() {

        const {series, jsonLD, meta, video, lowerVideoPlaylist, foundStocksData, playlist, footer } = this.props;
console.log(jsonLD)
        return (
            <div className="play-video-page">
                <HeadComponent
                    jsonLD={jsonLD}
                    meta={meta}
                    cssImports={HeadsImport.pageImports.css['video_index']} />
                <VideoHeader />

                <div id="wrapper">
                    <div id="content-wrapper">
                        <div className="container-fluid pb-0">
                            <TopMobileSearch />
                            <div className="video-block section-padding">
                                <div className="row">
                                    <div className="col-md-8 video-container">
                                        <VideoSingle video={video} playlist={playlist} series={series} />
                                        <SingleVideoLowerVideoList
                                            title="Most recent videos"
                                            video={video}
                                            ref={this.videoTemplateRef}
                                            videos={lowerVideoPlaylist}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <MentionedStockInVideo tweetTickers={foundStocksData}/>

                                        <VideoListTemplateB videos={playlist} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <VideoFooter data={footer} />
                    </div>
                </div>
                <FooterIncludes />
            </div>
        )
    }
}

export async function getServerSideProps({ query, params, res }) {


    let playlist = [], down_playlist = [];
    /**
     * @type {JWPVideo}
     */
    let video = null;
    if (params && params.videoID && params.videoID.length == 1) {
        try {
            const videoID = params.videoID[0];
            video = (await JWPlayerManager.getVideo(videoID));
            playlist = (await JWPlayerManager.getContextPlaylist(video.description)).playlist;
            console.log({playlist});
            playlist = playlist.filter(element => {
                return (element.mediaid !== videoID)
            });
        } catch (e) {
            console.log({ e });
        }
        if (!video) {
            ServerUtils.redirectTo(res, ROUTES.VIDEO);
            return {
                props: {}
            };
        }
        const series = await ShowManager.getShows();
        let videoTags = video.tags.split(",").filter(Boolean).map(element => element.toLowerCase());
        let videoSeries = series.find(element => {
            if(!element.meta || !Array.isArray(element.meta.show_dedicated_tag)){
                return false;
            }
            let serieTag = element.meta.show_dedicated_tag[0].toLowerCase();
            return videoTags.indexOf(serieTag) > -1;
        });
        //console.log({videoSeries});


        const meta = await MetaFetcher.fetchPageData('video_play');
        meta.title = video.title;
        let videoSuffix = ROUTES.VIDEO_PARTICULAR.replace(":video-slug", video.mediaid);
        meta.canonical_url_path = `http://bullish.studio${videoSuffix}`;
        meta.tags = meta.tags.map(element => {
            if (element.property.toLowerCase().endsWith("image")) {
                element.content = video.images[video.images.length - 1].src;
            } else if (element.property.toLowerCase().endsWith("title")) {
                element.content = video.title;
            } else if (element.property.toLowerCase().endsWith("description")) {
                element.content = video.description.replace(/\n/g, ' ').substr(0, 200) + "...";
            } else if (element.property.toLowerCase().endsWith("url")) {
                element.content = meta.canonical_url_path;
            }
            return element;
        })
        let videoJLD = JSONLDManager.getVideoPageData(video);
        
        let foundStocksData = await StockManager.getVideoStocksItems(video);
        let lowerVideoPlaylist = [];
        if(foundStocksData.length > 0){
            let stocks = foundStocksData.map(element => (element.ticker)).join(" ");
            stocks = encodeURIComponent(stocks);
            lowerVideoPlaylist = (await JWPlayerManager.getContextPlaylist(stocks)).playlist;
        }else{
            let linkSearch = video.link;
            lowerVideoPlaylist = (await JWPlayerManager.getContextPlaylist(linkSearch)).playlist;
        }
        
        const footerData = await MetaFetcher.fetchFooterData();
        return {
            props: {
                meta: meta,
                API_ENDPOINT: process.env.REACT_APP_API_END,
                video,
                playlist,
                lowerVideoPlaylist: lowerVideoPlaylist || [],
                jsonLD: videoJLD,
                foundStocksData,
                footer: footerData,
                series: videoSeries || null
            }
        }
    } else {
        console.log("Couldn't find valid parameters. Redirecting to /video...");
        ServerUtils.redirectTo(res, ROUTES.VIDEO);
        return {
            props: {}
        };
    }
}