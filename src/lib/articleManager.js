import { Article } from "./objects/article";
import { WPArticleFactory } from "./objects/wpArticleFactory";

const {get} = require("axios").default;
const qs = require("qs");

export class ArticleManager {

    static async fetchMedia(mediaId){
        const {data} = await get(`https://bullish.news/wp-json/wp/v2/media/${mediaId}`);
        return data;
    }

    /**
     * @description This fetches a number of articles and returns them, by page and items per page
     * @param {number} page The page
     * @param {number} limit The limit of the pages
     * @param {string} query The query for the data
     * @returns {Promise<Article>} The number of posts to return
     */
    static async searchPosts(page, limit=10, query=""){
        let factory = new WPArticleFactory();
        let results = await factory.searchPosts(page, limit, query);
        return results;
    }

    /**
     * @param {string} slug The slug of the article
     * @description Gets a post
     * @returns {Promise<Article>} The article
     */
    static async getPost(slug){
        let factory = new WPArticleFactory();
        let result = await factory.getPostBySlug(slug);
        return result;
    }

}