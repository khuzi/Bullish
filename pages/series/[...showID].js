import React from 'react';
import { VideoHeader } from '@components/video/header';
import { VideoFooter } from '@components/video/footer';
import { FooterIncludes } from '@components/video/footer_includes';
import Router from 'next/router'
import HeadComponent from '@components/head';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { Utils } from '@components/common/util';
import { ShowImage } from '@components/video/show/image';
import { ChannelNav } from '@components/video/show/nav';
import { VideoCard } from '@components/video/card';
import { SortElement } from '@components/video/sort_element';
import { ShowManager } from 'src/lib/showManager';
import { Pagination } from '@components/video/pagination';
import { SearchManager } from 'src/lib/searchManager';
import { ServerUtils } from 'src/lib/utils';
import { JSONLDManager } from 'src/lib/jsonldManager';
import { PAGINATION_TYPE, ROUTES } from 'src/const';
import { ShowVideoList } from '@components/video/video_list_template_c';

export default class VideoSearchPage extends React.Component {
    state = {
        q: "",
        tags: [],
        videos: []
    }
    /**
     * @type {{
     *  current: ShowVideoList
     * }}
     */
    videoTemplateRef = React.createRef();

    constructor(props) {
        super(props);
        this.videosLoaded = this.videosLoaded.bind(this);
    }

    componentDidMount() {
        const { q, tags } = Router.query;
        this.setState({
            q, tags: Utils.parseTags(tags)
        })
    }

    componentDidUpdate() {
        const { q, tags } = Router.query;
        let queryTags = Utils.parseTags(tags);
        if ((this.state.q) !== q
            || JSON.stringify(this.state.tags) !== JSON.stringify(queryTags)) {
            this.setState({
                q, tags: queryTags
            })
        }
    }

    sort(ev){
        ev.preventDefault();
        const {target} = ev;
        const {name} = target;
        const sort = Utils.getSortObject(Router);
        let newSort = `${name}:asc`;

        if(sort && sort.attribute === name){
            //Reverse sort
            let newDir = sort.dir === 'asc' ? "dsc": "asc";
            newSort = `${name}:${newDir}`;
        }
        console.log({newSort, sort});
        const newURL = Utils.asembleRelativeSearchURL(Router, null, null, newSort);
        console.log({newURL});
        Router.push(newURL);
    }

    htmlText(description){
        return Utils.toHTML(description);
    }

    /**
     * @description Catches async loading of videos
     * @param {JWPVideo[]} result The videos to set to the template
     */
    videosLoaded(result){
        try{
            this.videoTemplateRef.current.onNewVideosLoaded(result)
        }catch(e){
            console.log({e});
        }
    }

    render() {
        let {social} = this.props.showData.meta ? this.props.showData.meta : {};

        return (
            <div>
                <HeadComponent jsonLD={this.props.jsonLD} meta={this.props.meta} cssImports={HeadsImport.pageImports.css['video_index']} />
                <VideoHeader />
                <div id="wrapper">
                    <div className="single-channel-page" id="content-wrapper">
                        <ShowImage 
                            social={social}
                            poster={this.props.showData.poster_image_url}
                            profile={this.props.showData.profile_picture_url} />
                        <ChannelNav title={this.props.showData.name} />
                        <ShowVideoList
                            showData={this.props.showData}
                            ref={this.videoTemplateRef}
                            videos={this.props.videos}
                        />
                        <Pagination
                            showData={this.props.showData}
                            type={PAGINATION_TYPE.LAZY}
                            video_load_listener={this.videosLoaded} 
                            paging={this.props.paging}/>
                        <VideoFooter data={this.props.footer} />
                    </div>
                </div>
                <FooterIncludes />
            </div>
        )
    }
}


export async function getServerSideProps({ query, params, res }) {
    let { q, tags, sort, paging} = query;
    const {showID} = params;
    const showData = await ShowManager.getShowData(showID);

    if(!showData){
        ROUTES
        ServerUtils.redirectTo(res, ROUTES.SERIES);
        return {
            props: {}
        };
    }
    const meta = await MetaFetcher.fetchPageData('video_search');
    let showSuffix = ROUTES.SERIES_PARTICULAR.replace(":serie-slug", showID);
    meta.canonical_url_path = `http://bullish.studio/${showSuffix}`;
    meta.tags = meta.tags.map(element => {
        if(element.property.toLowerCase().endsWith(":image")){
            element.content = showData.poster_image_url;
        }else if(element.property.toLowerCase().endsWith("title")){
            element.content = showData.name;
        }else if(element.property.toLowerCase().endsWith("description")){
            element.content = showData.description.replace(/\n/g, ' ').substr(0, 140)+"...";
        }else if(element.property.toLowerCase().endsWith("url")){
            element.content = meta.canonical_url_path;
        }
        return element;
    })
    meta.title = showData.name;

    tags = showData.meta['show_dedicated_tag'] || [];

    //We search the page videos
    const {searchResults, resultingPaging} = await SearchManager.search(q, tags, sort, paging);
    
    const jsonLD = JSONLDManager.getShowData(searchResults)
    const footerData = await MetaFetcher.fetchFooterData();
    return {
        props: {
            meta: meta,
            API_ENDPOINT: process.env.REACT_APP_API_END,
            videos: searchResults,
            paging: resultingPaging || null,
            showData,
            jsonLD,
            footer: footerData
        }
    }
}