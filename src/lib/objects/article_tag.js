module.exports.ArticleTag = class ArticleTag {
    constructor(){
        /**
         * @type {number} The internal ID of the category
         */
        this.id = 0;
        /**
         * @type {string} The display name
         */
        this.name = "";
        /**
         * @type {string} The display slug
         */
        this.slug = "";
    }
}