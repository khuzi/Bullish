module.exports.ArticleCategory = class ArticleCategory {
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
         * @type {string} The slug
         */
        this.slug = "";
    }
}