/**
  * @typedef {{
    "id": number,
    "count": number,
    "description": string,
    "link": string,
    "name": string,
    "slug": string,
    "taxonomy": "post_tag",
    "meta": [],
    "yoast_head": string,
    "_links": {
      "self": [{ "href": string }],
      "collection": [{ "href": string }],
      "about": [
        { "href": string }
      ],
      "wp:post_type": [
        { "href": string }
      ],
      "curies": [
        { "name": "wp", "href": string, "templated": boolean }
      ]
    }
}} WPTag A tag element gotten from Wordpress via https://bullish.news/wp-json/wp/v2/tags?post=postId
*/
/**
 * @typedef {{
        "id": number,
        "date": string,
        "date_gmt": string,
        "guid": {
            "rendered": string
        },
        "modified": string,
        "modified_gmt": string,
        "slug": string,
        "status": string,
        "type": string,
        "link": string,
        "title": { "rendered": string },
        "author": number,
        "comment_status": string,
        "ping_status": string,
        "template": string,
        "meta": [],
        "yoast_head": string,
        "description": {
            "rendered": string
        },
        "caption": { "rendered": "" },
        "alt_text": string,
        "media_type": "image",
        "mime_type": string,
        "media_details": {
            "width": number,
            "height": number,
            "file": string,
            "sizes": {
                [key:string]: {
                    "file": string,
                    "width": number,
                    "height": number,
                    "uncropped": boolean,
                    "mime_type": string,
                    "source_url": string
                }
            },
            "image_meta": {
                "aperture": "0",
                "credit": "",
                "camera": "",
                "caption": "",
                "created_timestamp": "0",
                "copyright": "",
                "focal_length": "0",
                "iso": "0",
                "shutter_speed": "0",
                "title": "",
                "orientation": "0",
                "keywords": []
            }
        },
        "post": number,
        "source_url": string,
        "_links": {
            "self": [{ "href": string }],
            "collection": [{ "href": string }],
            "about": [
                { "href": string }
            ],
            "author": [
                {
                    "embeddable": true,
                    "href": string
                }
            ]
        }
    }} WPMedia The media object gotten from https://bullish.news/wp-json/wp/v2/media/mediaId
*/

/**
 @typedef {{
    "id": number,
    "count": number,
    "description": string,
    "link": string,
    "name": string,
    "slug": string,
    "taxonomy": string,
    "parent": number,
    "meta": [],
    "yoast_head": string,
    "_links": {
      "self": [{ "href": string }],
      "collection": [
        { "href": string }
      ],
      "about": [
        { "href": string }
      ],
      "up": [
        {
          "embeddable": true,
          "href": string
        }
      ],
      "wp:post_type": [
        { "href": string }
      ],
      "curies": [
        { "name": "wp", "href": string, "templated": true }
      ]
    }
 }} WPCategory The category for the article, gotte from https://bullish.news/wp-json/wp/v2/categories/:categoryId
*/


/**
 * @typedef {{
    "id": number,
    "name": string,
    "url": string,
    "description": string,
    "link": string,
    "slug": string,
    "meta": [],
    "woocommerce_meta": any,
    "yoast_head": string,
    "_links": {
      "self": [{ "href": string }],
      "collection": [{ "href": string }]
    }
 }} WPUser The wordpress article's author data
*/

/**
    @typedef {{
        "id": number,
        "date": string,
        "date_gmt": string,
        "guid": { "rendered": string },
        "modified": string,
        "modified_gmt": string,
        "slug": string,
        "status": "publish",
        "type": "post"|"video_skrn",
        "link": string,
        "title": {
            "rendered": string
        },
        "content": {
            "rendered": string,
            "protected": boolean
        },
        "excerpt": {
            "rendered": string,
            "protected": boolean
        },
        "author": number,
        "featured_media": number,
        "comment_status": "closed",
        "ping_status": "closed",
        "sticky": boolean,
        "template": string,
        "format": "standard",
        "meta": { "mc4wp_mailchimp_campaign": [] },
        "categories": WPCategory[],
        "tags": WPTag[],
        "yoast_head": string,
        "_links": {
            "self": [{ "href": string }],
            "collection": [{ "href": string }],
            "about": [{ "href": string }],
            "author": [
                {
                    "embeddable": boolean,
                    "href": string
                }
            ],
            "replies": [
                {
                    "embeddable": boolean,
                    "href": string
                }
            ],
            "version-history": [
                {
                    "count": 1,
                    "href": string
                }
            ],
            "predecessor-version": [
                {
                    "id": 6064,
                    "href": string
                }
            ],
            "wp:featuredmedia": [
                {
                    "embeddable": boolean,
                    "href": string
                }
            ],
            "wp:attachment": [
                { "href": string }
            ],
            "wp:term": [
                {
                    "taxonomy": "category",
                    "embeddable": boolean,
                    "href": string
                },
                {
                    "taxonomy": "post_tag",
                    "embeddable": boolean,
                    "href": string
                }
            ],
            "curies": [
                { "name": string, "href": string, "templated": boolean }
            ]
        },
        featured_media_data: WPMedia,
        tags_data: WPTag[],
        category_data: WPCategory[]
        author_data: WPUser
    }} WPArticle The wordpress article assembled with additional details
*/

/**
@typedef {{
    id: 3950,
    title: 'Earnings Season Kicks Off: Everyone Can&#8217;t Stop Talking About Tesla',
    url: 'https://bullish.news/earnings-season-kicks-off-everyone-cant-stop-talking-about-tesla/',
    type: 'post',
    subtype: 'post',
    _links: [Object]
}} WPSearchResult Search result for search endpoint
 */

import { CacheObjectManager } from '@lib/cacheObjectManager';
import { CategoryManager } from '@lib/categoryManager';
import { TagsManager } from '@lib/tagsManager';
import { CacheRequester } from '../cacheRequester';
import { ArticleAuthor } from './article_author';
import { ArticleCategory } from './article_category';
import { ArticleMedia } from './article_media';
import { ArticleTag } from './article_tag';

const { Article } = require('./article');
const qs = require("qs");
const { get } = require("axios").default;

export class WPArticleFactory {

    /**
     * @typedef {[key:string]:WPUser}
     */
    static prefetched_users = {};
    /**
     * @typedef {[key:string]:WPMedia}
     */
    static prefetched_media = {};
    /**
     * @typedef {[key:string]:WPTag}
     */
    static prefetched_tags = {};
    /**
     * @typedef {[key:string]:WPCategory}
     */
    static prefetched_categories = {};

    async toPostResult() {

    }

    /**
     * @description Loads the data for posts from a search result
     * @param {WPSearchResult[]} posts The search results
     * @returns {Promise<object[]>} The result for the articles
     */
    async loadPosts(postsData) {
        //console.log({ postsData: postsData[0]._links.self });
        /**
         * @type {number[]} The IDs for the posts to get
         */
        //let posts = postsData.map(element => element.id);
        //console.time(`loadPostsMethod ${postsData.length}`)
        let postUrl = `https://bullish.news/wp-json/wp/v2/posts`;
        let skrnUrl = `https://bullish.news/wp-json/wp/v2/video_skrn`;
        //let loadedPosts = [];
        
        let loadedPosts = await Promise.all(postsData.map(async (postElement, i) => {
            let cacheStored = CacheObjectManager.loadPostFromStore(postElement.id);
            if(cacheStored){
                console.log(`Returning cached post ID ${postElement.id}`);
                return cacheStored;
            };
            try{
                if (postElement.subtype === 'video_skrn') {
                    let { data } = await CacheRequester.get(`${skrnUrl}/${postElement.id}`, undefined, (3600*24));
                    return data;
                } else {
                    let { data } = await CacheRequester.get(`${postUrl}/${postElement.id}`, undefined, (3600*24));
                    return data;
                }
            }catch(e){
                return null;
            }
        }));
        return loadedPosts.filter(data => !!data);
    }

    /**
     * @param {number} page 
     * @param {number} perPage 
     */
    async searchPosts(page, perPage, query) {
        let search_payload = {
            per_page: perPage || 10,
            page: page || 1,
            subtype: "post"
        };
        if(query){
            search_payload.search = query;
        }

        let resultPayload = {
            /**@type {Article[]} Posts to get*/
            posts: [],
            paging: {
                total: 0, page_length: perPage, page: 0
            }
        };
        try {
            const query = qs.stringify(search_payload);
            const url = `https://bullish.news/wp-json/wp/v2/search?${query}`;
            console.log({url});
            const searchResults = await CacheRequester.get(url);
            console.time("this.loadPosts");
            console.log("Beginning to load posts: "+searchResults.data.length);
            let posts = await this.loadPosts(searchResults.data);
            console.log("Finished loading posts: "+searchResults.data.length);
            console.timeEnd("this.loadPosts");

            const total = parseInt(searchResults.headers['x-wp-total']);
            const totalPages = parseInt(searchResults.headers['x-wp-totalpages']);

            if (posts.length < 1) {
                return {
                    posts: [], paging: { total: 0, page_length: 0, page: 0 }
                };
            }

            let fetchPromises = posts.map(postsData => this.makeFromWPData(postsData));
            //We build the blog post
            console.time(`makeFromWPData length ${posts.length}`);
            posts = await Promise.all(fetchPromises);
            console.timeEnd(`makeFromWPData length ${posts.length}`);

            resultPayload = {
                posts, paging: {
                    total, page_length: perPage, page: page
                }
            };
        } catch (e) {
            console.log("Error from searchPosts: ");
            console.log({ e });
        }

        return resultPayload;
    }

    /**
     * @param {string} slug The string slug to be used
     * @description Returns a blog post data via it's slug
     * @returns {Promise<Article>} Returns an article via it's slug
     */
    async getPostBySlug(slug) {
        //We get the meta for the post
        slug = encodeURIComponent(slug);
        const postUrl = `https://bullish.news/wp-json/wp/v2/posts?slug=${slug}`;
        const videoSkrnUrl = `https://bullish.news/wp-json/wp/v2/video_skrn?slug=${slug}`;

        try {
            /**
             * @type {WPArticle} The data article to be used to get the full article data
            */
            let { data } = (await get(postUrl));
            if (!data[0]) {
                data = (await get(videoSkrnUrl)).data;
                if(!data[0]){
                    return null;
                }
            }
            try {
                return await this.makeFromWPData(data[0]);
            } catch (e) {
                console.log({ getPostBySlug_makeFromWPData_e: e });
            }
        } catch (e) {
            console.log({ getPostBySlug_e: e });
            return null;
        }
    }

    /**
     * 
     * @param {number} postId The post ID to fetch the data from
     */
    async fetchCommentsAmmount(postId) {
        try {
            let storeCachecComments = CacheObjectManager.countComments(postId);
            if(!isNaN(storeCachecComments)){
                return storeCachecComments;
            }
            console.time(`fetchCommentsAmmount ${postId}`);
            console.log(`Fetching ${postId} comments ammount...`);
            const url = `https://bullish.news/wp-json/wp/v2/comments?post=${postId}&per_page=1`;
            const results = await CacheRequester.get(url, undefined, (3600*24*1000));   //1 day cache
            const total = parseInt(results.headers['x-wp-total']);
            //const totalPages = parseInt(results.headers['x-wp-totalpages']);
            console.timeEnd(`fetchCommentsAmmount ${postId}`);
            return total;
        } catch (e) {
            return 0;
        }
    }


    /**
     * @description Gets the author WP profle picture URL
     * @param {WPUser} author The author data
     */
    getYoastProfilePicture(author){
        //`<meta property=\"og:image\" content=\"https://bullish.news/wp-content/uploads/2020/10/image-4.png\" />`.match(/(property=\"og:image\" content)=\"(.*)"/g)[0].split("content=")[1].replace(/"/g, "")
        let matches = author.yoast_head.match(/(property=\"og:image\" content)=\"(.*)"/g);
        if(matches){
            return matches[0].split("content=")[1].replace(/"/g, "");
        }else{
            return null;
        }
    }

    /**
     * @param {WPArticle} WPRawData 
     * @returns {Promise<Article>} The article
     */
    async makeFromWPData(WPRawData) {
        let data = WPRawData;

        let meta = await Promise.all([
            this.fetchMedia(data.featured_media),
            this.fetchTags(data),
            this.fetchAuthor(data.author),
            this.fetchCategories(data.categories),
            this.fetchCommentsAmmount(data.id)
        ]);

        data.featured_media_data = meta[0];;
        data.tags_data = meta[1];
        data.author_data = meta[2];
        data.category_data = meta[3];

        let article = new Article();
        article.id = data.id;
        article.date = data.date_gmt;
        article.modified = data.modified_gmt;
        article.status = data.status;
        article.title = data.title.rendered;
        article.content = data.content.rendered;
        article.commentCount = meta[4];
        article.slug = data.slug;
        article.type = data.type;

        try {
            article.featured = (() => {
                let media = new ArticleMedia();
                media.id = data.featured_media_data.id;
                media.title = data.featured_media_data.title.rendered;
                media.slug = data.featured_media_data.slug;
                media.date = data.featured_media_data.date_gmt;
                media.caption = data.featured_media_data.caption.rendered;
                media.alt_text = data.featured_media_data.caption.alt_text;
                media.link = data.featured_media_data.link;
                return media;
            })();
        } catch (e) {
            console.log("Error on featured media parsing: ", { e });
        }


        try {
            article.tags = data.tags_data
            .filter(element => !!element)
            .map(element => {
                let articleTag = new ArticleTag();
                articleTag.id = element.id;
                articleTag.name = element.name;
                articleTag.slug = element.slug;
                return articleTag;
            });
        } catch (e) {
            console.log("Error parsing tags: ", { e });
        }

        try {
            article.categories = data.category_data.map((element) => {
                let articleCategory = new ArticleCategory();
                articleCategory.name = element.name;
                articleCategory.id = element.id;
                articleCategory.slug = element.slug;
                return articleCategory;
            })
        } catch (e) {
            console.log("Error parsing categories: ", { e });
        }

        try {
            article.author = (() => {
                if (!data.author_data) {
                    return null;
                }
                let author = new ArticleAuthor();
                author.id = data.author_data.id;
                author.name = data.author_data.name;
                author.description = data.author_data.description;
                author.slug = data.author_data.slug;
                console.log({
                    "data.author_data": data.author_data._links.self
                });
                author.picture_url = this.getYoastProfilePicture(data.author_data);
                return author;
            })()
        } catch (e) {
            console.log("Error parsing author: " + e + " on article: " + data.id, { e });
        }

        return article;
    }

    /**
     * @param {string} authorId The author ID to fetch
     * @return {Promise<WPUser>} The author for the article
     */
    async fetchAuthor(authorId) {
        try{
            if (!authorId) {
                return null;
            }
            let cachedUser = CacheObjectManager.getUser(authorId);
            if(cachedUser){
                return cachedUser;
            }
            let url = `https://bullish.news/wp-json/wp/v2/users/${authorId}`;
            let { data } = await CacheRequester.get(url, undefined, undefined, 5);
            return data;
        }catch(e){
            return null;
        }
    }

    /**
     * @param {number} mediaId The media to fetch
     * @description Gets certain media for a post
     * @returns {Promise<WPMedia>} The media element
     */
    async fetchMedia(mediaId) {
        try{
            /**
             * `https://bullish.news/wp-json/wp/v2/media/${mediaId}`
            */
            let cachedMedia = CacheObjectManager.getMedia(mediaId);
            if(cachedMedia){
                console.log("Returning cached media...");
                return cachedMedia;
            }
            let url = `https://bullish.news/wp-json/wp/v2/media/${mediaId}`;
            let { data } = await CacheRequester.get(url, undefined, undefined, 5);
            return data;
        }catch(e){
            console.log({e});
            return null;
        }
    }

    /**
     * @param {WPArticle} wpArticle The ID of the post to get the tags from
     * @description Gets the tags for a post
     * @returns {Promise<WPTag[]>} An array of tags
     */
    async fetchTags(wpArticle) {
        try {
            let articleTags = Array.isArray(wpArticle.tags) ? wpArticle.tags : [];
            let wpTagsData;
            wpTagsData = CacheObjectManager.getTags();
            return articleTags.map((tag) => {
                return wpTagsData.find(element => (tag == element.id ));
            });
        } catch (e) {
            console.log({
                fetchTagsError: e
            });
            return [];
        }
    }

    /**
     * @param {number[]} categories The ID array of the post categories to get
     * @description Gets the categories for a post
     * @returns {Promise<WPCategory[]>} An array of categories
     */
    async fetchCategories(categories = []) {
        try {
            let abscent = categories.find((category_id) => (
                !CategoryManager.categories[category_id.id]
            ));
            if (abscent) {
                await CategoryManager.loadCategories();
                return categories.map((catID) => (CategoryManager.categories[catID]));
            } else {
                return categories.map((catID) => (CategoryManager.categories[catID]));
            }
        } catch (e) {
            console.log({
                fetchCategories_error: e
            });
            return [];
        }
    }
}