import { ArticleAuthor } from "./article_author";
import { ArticleCategory } from "./article_category";
import { ArticleMedia } from "./article_media";
import { ArticleTag } from "./article_tag";

export class Article {

	constructor(){
		/**
		 * @type {ArticleTag[]} The tags for this article (as string)
		 */
		this.tags = [];
		/**
		 * @type {ArticleCategory[]} The categories for this article
		 */
		this.categories = [];
		/**
		 * @type {string} The date it was created, on GMT
		 */
		this.date = "";
		/**
		 * @type {string} The date it was modified, on GMT
		 */
		this.modified = "";
		/**
		 * @type {'publish'} The blog post status
		 */
		this.status = "";
		/**
		 * @type {string} The title for the article, HTML rendered
		*/
		this.title = "";
		/**
		 * @type {string} The content fo the article, HTML rendered
		 */
		this.content = "";
		/**
		 * @type {ArticleAuthor} The data of the author of the post
		*/
		this.author = null;
		/**
		 * @type {ArticleMedia} The image to be featured
		*/
		this.featured = null;
		/**
		 * @type {object} The extra metadata for this article
		*/
		this.meta = null;
		/**
		 * @type {number} The ID of this article
		 */
		this.id = null;
		/**
		 * @type {number} The number of total comments
		*/
		this.commentCount = null;
		/**
		 * @type {string} The article slug
		*/
		this.slug = null;
		/**
		 * @type {string} The type of post
		 */
		this.type = null;
	}


	toJson() {
		return {
			tags: this.tags,
			categories: this.categories,
			date: this.date,
			modified: this.modified,
			status: this.status,
			title: this.title,
			content: this.content,
			author: this.author,
			featured: this.featured,
			meta: this.meta,
			id: this.id,
			commentCount: this.commentCount,
			slug: this.slug,
			type: this.type
		}
	}
}