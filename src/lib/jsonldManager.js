const { Utils } = require("@components/common/util");
const numeral = require("numeral");
const { ROUTES } = require("src/const");
const { JWPVideo } = require("src/docs/jstypes");

module.exports.JSONLDManager = class JSONLDManager {


	static secondsToISO8601(secs) {
		var string = numeral(secs).format('00:00:00').split(":");
		return `PT${string[0]}H${string[1]}M${string[2]}S`;
	}

	static getVideoPageData(video) {
		let payload = this.parseVideo(video);
		return JSON.stringify(payload, null, 4);
	}

	static getVideoSearchData(searchResults) {
		let payload = {
			"@context": "http://schema.org",
			"@type": "ItemList",
			"itemListElement": searchResults.map((element, index) => this.getVideoItem(element, index + 1))
		};
		return JSON.stringify(payload, null, 4);
	}

	static getShowData(searchResults) {
		let payload = {
			"@context": "http://schema.org",
			"@type": "WebPage",
			"video": searchResults.map(element => this.parseVideo(element, true))
		};
		return JSON.stringify(payload, null, 4);
	}

	static getVideoItem(videoElement, position) {
		return {
			"@type": "ListItem",
			"position": position,
			"name": videoElement.title,
			"description": videoElement.description,
			"url": `http://bullish.studio${ROUTES.VIDEO}/${videoElement.mediaid}`,
			"image": videoElement.images[videoElement.images.length - 1].src
		};
	}

	/**
	 * @param {JWPVideo} videoElement Video Element
	 */
	static parseVideo(videoElement, excludeSchema, trimDescription=300) {
		let description = trimDescription ? (videoElement.description || "").substr(0, trimDescription)+"..." : videoElement.description;
		let payload = {
			"@type": "VideoObject",
			"name": videoElement.title,
			"description": description,
			"thumbnailUrl": videoElement.images[videoElement.images.length - 1].src,
			"uploadDate": new Date((videoElement.pubdate * 1000)).toUTCString(),
			"duration": this.secondsToISO8601(videoElement.duration),
			"contentUrl": videoElement.sources[videoElement.sources.length - 1].file,
			"embedUrl": `http://bullish.studio${ROUTES.VIDEO}/${videoElement.mediaid}`,
			"keywords": videoElement.tags,
			"producer": {
				"@type": "Organization",
				"name": "Bullish.News"
			},
			"publisher": this.Organization,
		};
		if (!excludeSchema) {
			payload["@context"] = "https://schema.org";
		}
		return payload;
	}

	static escapeText(textString){
		return Utils.fromHTML(textString);
		//return textString.replace(/<!-- Mailchimp for WordPress(([\s\S]*?))<!-- \/ Mailchimp for WordPress Plugin -->/gi, ''); //Escape mailchimp plugin
	}

	/**
	 * @param {Artice}
	 */
	static getArticlePageData(article, excludeSchema) {
		let payload = {
			"@context": "http://schema.org",
			"@type": "BlogPosting",
			...this.getCreator(),
			"url": `${ROUTES.ARTICLE}/${article.slug}`,
			"headline": article.title,
			"dateCreated": article.date,
			"datePublished": article.date,
			"dateModified": article.modified,
			"inLanguage": "en-US",
			"isFamilyFriendly": "true",
			"copyrightYear": article.date && article.date.slice(0, 4) || "2020",
			"accountablePerson": {
				"@type": "Person",
				"name": article.author.name,
				"url": "http://bullish.studio"
			},
			"author": {
				"@type": "Person",
				"name": article.author.name,
				"url": "http://bullish.studio"
			},
			"creator": {
				"@type": "Person",
				"name": article.author.name,
				"url": "http://bullish.studio"
			},
			"image": article.featured ? article.featured.link : "",
			"publisher": this.Organization,
			"sponsor": this.Organization,
			"mainEntityOfPage": "True",
			"keywords": article.tags.map(tag => tag.name),
			"genre": ["investing"],
			"articleSection": "Uncategorized posts",
			"articleBody": this.escapeText(article.content).substr(0, 300)+"..."
		};
		// if(!excludeSchema){ // TODO research
		// 	payload["@context"] = "https://schema.org";
		// }
		return JSON.stringify(payload, null, 4);
	}

	/**
	 * @param {articles}
	 */
	static getArticlesPageData(articles, excludeSchema) {
		let payload = {
			...this.getCreator(),
			"@context": "http://schema.org",
			"@type": "Blog",
			"about": "CreativeWork",
			"blogPost": articles.map(article => JSON.parse(this.getArticlePageData(article))),
			"genre": "creativeWork",
			"inLanguage": "en-US",
			"isAccessibleForFree": "true",
			"copyrightYear": "2020",
		};
		// if(!excludeSchema){ // TODO research
		// 	payload["@context"] = "https://schema.org";
		// }
		return JSON.stringify(payload, null, 4);
	}

	/**
	 * @param {stock}
	 * @param {video}
	 */
	static getStockPageData(stock, video, tweets, article, excludeSchema) {
		let payload = {
			...this.getCreator(),
			"@context": "http://schema.org",
			"@type": "WebPage",
			"mainContentOfPage": stock.description,
			"comment": tweets.map(tweet => {
				return {
					"text": tweet.tweetContent,
					"about": tweet.ticker,
					"dateCreated": tweet.tweetDate
				}
			}),
			"name": stock.company_name,
			"about": stock.company_name,
			"headline": article ? article.title : "",
			"text": article ? this.escapeText(article.content) : "",
			"video": this.parseVideo(video),
			"keywords": [stock.ticker, stock.company_name],
			"dateCreated": stock.created_at,
			"lastReviewed": stock.updated_at,
			"primaryImageOfPage": stock.img_src, // stock image or bullish logo?
			"inLanguage": "en-US",
			"isAccessibleForFree": "true",
			"copyrightYear": "2020",
		};
		// if(!excludeSchema){ // TODO research
		// 	payload["@context"] = "https://schema.org";
		// }
		return JSON.stringify(payload, null, 4);
	}

	/**
	 * @param {metadata} ? (fetch page name and description)
	 */
	static getCollectionPageData(data, excludeSchema) {
		let payload = {
			...this.getCreator(),
			"@context": "http://schema.org",
			"@type": "Collection",
			"name": "Bullish",
			"text": data ? data.map(data => data.description) : "",
			"thumbnailUrl": data ? data.map(data => data.poster_image_url) : "",
			"headline": data ? data.map(data => data.name) : "",
			"inLanguage": "en-US",
			"isAccessibleForFree": "true",
			"copyrightYear": "2020",
		};
		// if(!excludeSchema){ // TODO research
		// 	payload["@context"] = "https://schema.org";
		// }
		return JSON.stringify(payload, null, 4);
	}

	/**
	 * @param {metadata} ? (fetch page name and description)
	 */
	static getPageData(excludeSchema) {
		let payload = {
			...this.getCreator(),
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "Bullish",
			"primaryImageOfPage": process.env.BULLISH_DATA_LOGO || "",
			"inLanguage": "en-US",
			"isAccessibleForFree": "true",
			"copyrightYear": "2020",
		};
		return JSON.stringify(payload, null, 4);
	}

	/**
	 * @param {JWPVideo[]} videos The videos to add to the page
	 */
	static getSeveralVideosPageData(videos){
		let pageData = JSON.parse(this.getPageData());
		pageData.video = videos.map(element => {
			return this.parseVideo(element, null, 200);
		})
		return JSON.stringify(pageData, null, 4);
	}


	static getCreator() {
		return {
			"copyrightHolder": this.Organization,
			"funder": this.Organization,
			"maintainer": this.maintainer,
			"sourceOrganization": this.Organization,
			"provider": this.maintainer,
			"author": this.Organization
		}
	}

	static get maintainer(){
		return {
			"@type": "Organization",
			"address": "Magyk",
			"email": "peterantley@magyk.cloud",
			"url": "https://magyk.cloud",
			"name": "Magyk.Cloud",
			"logo": {
				"@type": "ImageObject",
				"url": "https://bullish.studio/images/magyk_resize.png"
			}
		}
	}


	static get Organization() {
		return {
			"@type": "Organization",
			"address": process.env.BULLISH_DATA_ADDRESS || "",
			"email": process.env.BULLISH_DATA_EMAIL || "",
			"url": process.env.BULLISH_DATA_URL || "",
			"name": "Bullish.News",
			"logo": {
				"@type": "ImageObject",
				"url": process.env.BULLISH_DATA_LOGO || ""
			}
		}
	}
}

