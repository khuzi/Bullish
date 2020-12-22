import { PAGING_NUMBER_OF_SHOWS } from "src/const";
import { JWPVideo, ShowRecord } from "src/docs/jstypes";
import { CacheRequester } from "./cacheRequester";

const { get } = require("axios").default;
const qs = require("qs");

export class ShowManager {


    /**
     * @param {string} showId 
     * @returns {Promise<ShowRecord | null>}
     */
    static async getShowData(showId) {
        // Get channel data
        try {
            const query = qs.stringify({
                _where: [{
                    showId: showId
                }]
            });
            const showSearchURL = `${process.env.STRAPI_ENDPOINT}/shows/?${query}`;
            const { data } = await get(showSearchURL);

            return data.length == 1 ? data[0] : null;
        } catch (e) {
            console.log(`Error getting show ${showId}: ` + e);
            return null;
        }
    }

    /**
     * 
     * @param {JWPVideo} video The video to get the data from
     * @returns {Promise<ShowRecord|null>}
     */
    static async getVideoSeries(video){
        const series = await this.getShows();
        let videoTags = video.tags.split(",").filter(Boolean).map(element => element.toLowerCase());
        let videoSeries = series.find(element => {
            if(!element.meta || !Array.isArray(element.meta.show_dedicated_tag)){
                return false;
            }
            let serieTag = element.meta.show_dedicated_tag[0].toLowerCase();
            return videoTags.indexOf(serieTag) > -1;
        });
        console.log({
            videoTags, series
        });
        return videoSeries || null;
    }

    /**
     * @description Loads all shows.
     * @returns {Promise<ShowRecord[]>} All the shows on the database
     */
    static async getShows(){
        const showSearchURL = `${process.env.STRAPI_ENDPOINT}/shows/`;
        let {data} = await CacheRequester.get(showSearchURL);
        return data;
    }

    static async searchShows(search, page) {
        //Get channels
        try {

            const take = PAGING_NUMBER_OF_SHOWS;
            const start = isNaN(page) ? 0 : (page - 1) * take;
            search = search || "";

            const query = qs.stringify({
                _where: { _or: [{ name_contains: search }, { description_contains: search }, { meta_contains: search }] }, _limit: take, _start: start  // unable to use "show_dedicated_tags" got every show as response.
            });

            const showsSearchURL = `${process.env.STRAPI_ENDPOINT}/shows?${query}`;
            const showsCountURL = `${process.env.STRAPI_ENDPOINT}/shows/count?${query}`;

            let { data } = await get(showsSearchURL);
            let count = await get(showsCountURL);

            data = {
                data: data,
                count: count.data
            }

            return data ? data : null;

        } catch (e) {
            console.log(`Error searching shows: ` + e);
            return null;
        }
    }
}