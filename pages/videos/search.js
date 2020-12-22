import { MetaFetcher } from 'src/lib/metaFetcher';
import { SearchManager } from 'src/lib/searchManager';
import { StockManager } from 'src/lib/stockManager';
import { JSONLDManager } from 'src/lib/jsonldManager';
import VideoIndexPage from '.';

export default class SearchPage extends VideoIndexPage {
}


export async function getServerSideProps({query}){
    let { q, tags, sort, paging } = query;
    const meta = await MetaFetcher.fetchPageData('video_search');
    let parsedTags = SearchManager.parseTags(tags);
    if(!q){
        if(parsedTags && parsedTags.length > 0){
            meta.title = `Watch videos of: ${parsedTags.join(", ")}`
        }else{
            meta.title = "Watch Stock Videos"
        }
    }else{
        meta.title = meta.title.replace(/_q_/g, q || '');
    }

    const {searchResults, resultingPaging} = await SearchManager.search(q, tags, sort, paging);
    const footerData = await MetaFetcher.fetchFooterData();
    let topStocks = await StockManager.fetchStockWeeklyOcurrences(10);
    let topItems = StockManager.stockToCarouselItem(topStocks);
    //console.log({topStocks: topStocks, length: topStocks.length});

    let jsonLD = JSONLDManager.getVideoSearchData(searchResults);

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