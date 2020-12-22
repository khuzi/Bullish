import { ROUTES } from "src/const";
const {get} = require("axios").default;

export class ArticleDataFetcher {

    /**
     * @param {string} queryString 
     * @returns {Promise<{
     *      searchResults: JWPVideo[],
     *      resultingPaging: VideoPagingResult
     * }>} The videos found
     * @description Gets the videos with a general search
     */
    static async searchEndpoint(queryString){
        let url = `${ROUTES.ARTICLE_SEARCH_API}?${queryString}`;
        let {data} = await get(url);
        return {
            searchResults: data.posts,
            resultingPaging: data.paging
        }
        return data;
    }
}