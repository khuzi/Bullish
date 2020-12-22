import React from 'react';
import { ShowHeader } from '@components/video/show/header';
import { ShowCarousel } from '@components/video/show/show_carousel.js';
import { ShowCard } from '@components/video/show/show_card/index.js';
import { VideoFooter } from '@components/video/footer';
import HeadComponent from '@components/head';
import { FooterIncludes } from '@components/video/footer_includes';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { JSONLDManager } from 'src/lib/jsonldManager';
import { SearchManager } from 'src/lib/searchManager';
import { ShowManager } from 'src/lib/showManager';


export default class Shows extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
    };

    render() {

        const shows = this.props.jsonLD;

        const showsContainer = {
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center",
            marginTop: "30px",
            backgroundColor: "#000"
        };
console.log(jsonLD)
        return (
            <div style={{backgroundColor: "#000"}}> 
                <HeadComponent meta={this.props.meta} jsonLD={this.props.jsonLD} cssImports={HeadsImport.pageImports.css['video_index']}/>
                <ShowHeader />
                    <div id="content-wrapper">
                        <h5 style={{margin:"30px auto 0 auto", textAlign: "center"}}>Most Popular Shows</h5>
                        <ShowCarousel shows={shows} />
                        <div className="container-fluid pb-0" style={showsContainer}>
                            {shows.map((show, key) => <ShowCard key={key} {...show} />)}
                            <hr className="mt-0"/>
                        </div>
                        <VideoFooter data={this.props.footer} />
                    </div>
                <FooterIncludes/>
            </div>
        )
    }
}

// function present in video
export async function getServerSideProps({query}){

    let { q, tags, sort, paging } = query;
    const meta = await MetaFetcher.fetchPageData('video_index');
  
    const {searchResults, resultingPaging} = await SearchManager.search(q, tags, sort, paging);

    let jsonLD = JSONLDManager.getCollectionPageData(videos);


    const footerData = await MetaFetcher.fetchFooterData();
    return {
        props: {
            meta: meta,
            API_ENDPOINT: process.env.REACT_APP_API_END,
            videos: searchResults,
            paging: resultingPaging || null,
            footer: footerData,
            jsonLD
            // count: count
        }
    }
}
