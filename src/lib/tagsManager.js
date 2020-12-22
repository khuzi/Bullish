const {CacheRequester} = require("@lib/cacheRequester");
const qs = require("qs");
const { CacheObjectManager } = require("./cacheObjectManager");
/**
 * @typedef {import("./objects/wpArticleFactory").WPTag} WPTag
*/

module.exports.TagsManager = class TagsManager {

    /**
     * @type {{
     *  [key:string]: WPTag
     * }} Tags loaded
    */
    static tags = {};
    static loadWpTagsPromise = null;

    static makeQuerablePromise(promise) {
        // Don't modify any promise that has been already modified.
        if (promise.isResolved) return promise;
    
        // Set initial state
        var isPending = true;
        var isRejected = false;
        var isFulfilled = false;
    
        // Observe the promise, saving the fulfillment in a closure scope.
        var result = promise.then(
            function(v) {
                isFulfilled = true;
                isPending = false;
                return v; 
            }, 
            function(e) {
                isRejected = true;
                isPending = false;
                throw e; 
            }
        );
    
        result.isFulfilled = function() { return isFulfilled; };
        result.isPending = function() { return isPending; };
        result.isRejected = function() { return isRejected; };
        return result;
    }
    

    /**
     * @description Loads and returns the wordpress-available tags.
     * @returns {Promise<WPTag[]>} The tags to return
     */
    static async loadWpTags(){
        
        if(!this.loadWpTagsPromise){
            this.loadWpTagsPromise = new Promise(async (accept)=>{
                let reachedEnd = false, tags = [], page = 1;
                
                //We attempt to load them from the local objects cache
                let cachedTags = []; //CacheObjectManager.getTags();
                if(cachedTags && cachedTags.length > 0){
                    tags = cachedTags;
                }else{
                    //If not found, we load them from the cache requester
                    while(!reachedEnd){
                        let query = qs.stringify({
                            per_page: 100,
                            page
                        });
                        let url = `https://bullish.news/wp-json/wp/v2/tags/?${query}`;
                        try{
                            let {data} = await CacheRequester.get(url, undefined, undefined, 5);
                            if(data.length < 1){
                                reachedEnd = true;
                                break;
                            }
                            tags = tags.concat(data)
                            page++;
                        }catch(e){
                            console.log(`Error fetching tags on page ${page}. Retrying...`);
                        }
                    }
                }
                accept(tags);
            });
            this.loadWpTagsPromise = this.makeQuerablePromise(this.loadWpTagsPromise);
        }
        return this.loadWpTagsPromise;
    }
}