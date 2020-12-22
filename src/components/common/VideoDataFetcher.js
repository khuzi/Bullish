import { ROUTES } from "src/const";
import { JWPVideo, VideoPagingResult } from "src/docs/jstypes";
const {get} = require("axios");

export class VideoDataFetcher {

    /**
     * 
     * @param {string} queryString 
     * @returns {Promise<{
     *      searchResults: JWPVideo[],
     *      resultingPaging: VideoPagingResult
     * }>} The videos found
     * @description Gets the videos with a general search
     */
    static async searchEndpoint(queryString){
        let url = `${ROUTES.VIDEO_SEARCH_API}?${queryString}`;
        let {data} = await get(url);
        return data;
    }
}