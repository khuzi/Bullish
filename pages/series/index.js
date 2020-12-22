import React from 'react';
import { ShowHeader } from '@components/video/show/header';
import { ShowCarousel } from '@components/video/show/show_carousel.js';
import { ShowCard } from '@components/video/show/show_card';
import { VideoFooter } from '@components/video/footer';
import HeadComponent from '@components/head';
import { FooterIncludes } from '@components/video/footer_includes';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { JSONLDManager } from 'src/lib/jsonldManager';
import { ShowManager } from 'src/lib/showManager';
import { Pagination } from '@components/video/show/pagination';
import { PAGING_NUMBER_OF_SHOWS } from 'src/const';
const PAGE_LENGTH = PAGING_NUMBER_OF_SHOWS;

export default class Shows extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { jsonLD, data, footer, paging, meta, query} = this.props;

        const showsContainer = {
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center",
            marginTop: "30px",
            backgroundColor: "#000"
        };
        return (
            <div style={{backgroundColor: "#000"}}> 
                <HeadComponent meta={meta} jsonLD={jsonLD} cssImports={HeadsImport.pageImports.css['video_index']}/>
                <ShowHeader />
                    <div id="content-wrapper">
                        <h1 style={{margin:"30px auto 0 auto", textAlign: "center", fontSize:"18pt"}}>Original Video Series</h1>
                        <ShowCarousel shows={data} />
                        <div className="row container-fluid pb-0" style={showsContainer}>
                            <div className="row">
                                {data.map((show, key) => 
                                    <div className="col-sm-6 col-md-4">
                                        <ShowCard key={key} {...show} />
                                    </div>
                                )}
                                <hr className="mt-0"/>
                            </div>
                        </div>
                        <Pagination paging={paging} query={query} />
                        <VideoFooter data={footer} />
                    </div>
                <FooterIncludes/>
            </div>
        )
    }
}

export async function getServerSideProps({query}){

    let { search, page } = query;

    const meta = await MetaFetcher.fetchPageData('video_index');
    page=page ? parseInt(page) : 1;
    
    const data = await ShowManager.searchShows(search, page);

    const resultingPaging = {
        page: page || 1,
        page_length: PAGE_LENGTH,
        total: data.count
    };

    console.log(`current page is: ${page}`);
    let jsonLD = JSONLDManager.getCollectionPageData(data.data);


    const footerData = await MetaFetcher.fetchFooterData();
    return {
        props: {
            meta: meta,
            API_ENDPOINT: process.env.REACT_APP_API_END,
            paging: resultingPaging || null,
            footer: footerData,
            data: data.data,
            query,
            jsonLD
        }
    }
}
