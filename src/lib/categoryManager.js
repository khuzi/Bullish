const {CacheRequester} = require("@lib/cacheRequester");
const qs = require("qs");
/**
 * @typedef {import("./objects/wpArticleFactory").WPCategory} WPCategory
*/

module.exports.CategoryManager = class CategoryManager {

    /**
     * @type {{
     *  [key:string]: WPCategory
     * }} Categories loaded
    */
    static categories = {};
    static loadCategoriesPromise = null;

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
    

    static async loadCategories(){
        
        if(!this.loadCategoriesPromise){
            this.loadCategoriesPromise = new Promise(async (accept)=>{
                let reachedEnd = false, page=1;
                /**
                * @type {WPCategory[]} Categories array containing all categories
                */
                let loadedCategories = [];
                while(!reachedEnd){
                    let query = qs.stringify({
                        per_page: 100,
                        page
                    })
                    /**
                    * @type {WPCategory[]} The category.
                    */
                    let {data} = (await CacheRequester.get(`https://bullish.news/wp-json/wp/v2/categories?${query}`, undefined, undefined, 5));
                    if(data.length === 100){
                        reachedEnd = false;
                        page++;
                    }else{
                        reachedEnd = true;
                    }
                    loadedCategories = loadedCategories.concat(data);
                }
                loadedCategories.forEach((categoryElement)=>{
                    this.categories[categoryElement.id] = categoryElement;
                });
                accept(this.categories);
            });
            this.loadCategoriesPromise = this.makeQuerablePromise(this.loadCategoriesPromise);
        }
        return this.loadCategoriesPromise;
    }
}