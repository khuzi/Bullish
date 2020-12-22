/**
 * @typedef {{
    "id": number,
    "name": string,
    "description": string,
    "slug": string,
    "meta": []
 }} ArticleAuthor
 */

module.exports.ArticleAuthor = class ArticleAuthor {
    constructor(){
        /**
         * @type {number} The ID for the author
         */
        this.id = 0;
        /**
         * @type {string} The name of the author
         */
        this.name = "";
        /**
         * @type {description} The description for the page
         */
        this.description = "";
        /**
         * @type {string} The article author slug
         */
        this.slug = "";
        /**
         * @type {string} The picture URL to use
         */
        this.picture_url = "";
    }

    toJson(){
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            slug: this.slug,
            picture_url: this.picture_url
        }
    }
}