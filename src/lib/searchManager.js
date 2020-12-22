const { JWPVideo } = require('src/docs/jstypes');
const { JWPlayerManager } = require('./jwPlayerManager');

/**
 * @typedef {{ 
    searchResults: JWPVideo [];
    resultingPaging: {
        page: number;
        page_length: number;
        total: number;
    }}} SearchVideoResult The search video result.
 */

/**
 * @description JWPlayer search manager
 */
module.exports.SearchManager = class SearchManager {

    static parseTags(tags) {
        if (tags) {
            if (!Array.isArray(tags)) {
                try {
                    let newTags = JSON.parse(tags);
                    if (Array.isArray(newTags)) {
                        tags = newTags;
                    } else {
                        tags = null;
                    }
                } catch (e) {
                    console.log({ e });
                }
            }
        }
        return tags || null;
    }

    /**
     * 
     * @param {string} q The search term to search the video for
     * @param {string[]} tags The tags contained in this video. Empty for no tags.
     * @param {{dir:'asc'|'dsc', attribute:string}} sort The sort attribute to sort the results.
     * @param {number} page The page for the videos (for paging purposes).
     * @param {number} pageLength The length for the results gotten.
     * @returns {Promise<SearchVideoResult>} The result of the search
     */
    static async search(q, tags = [], sort, page, pageLength = 10) {
        let searchResults, resultingPaging;
        if (q || tags) {
            if (tags) {
                if (!Array.isArray(tags)) {
                    try {
                        //console.log({ tags });
                        let newTags = JSON.parse(tags);
                        if (Array.isArray(newTags)) {
                            tags = newTags;
                        } else {
                            tags = null;
                        }
                    } catch (e) {
                        console.log({ e });
                    }
                }
            }
            try{
                let fetchResults = await JWPlayerManager.searchVideos(q, tags, null, 2, sort, page, pageLength);
                searchResults = fetchResults.videos, resultingPaging = fetchResults.paging;
            }catch(e){
                searchResults = [], resultingPaging = {
                    page: 1,
                    page_length: 1,
                    total: 0,
                };
            }
        } else {
            let fetchResults = await JWPlayerManager.searchVideos(null, null, null, 2, sort, page, pageLength);
            searchResults = fetchResults.videos, resultingPaging = fetchResults.paging;
        }

        return { searchResults, resultingPaging };
    }

}