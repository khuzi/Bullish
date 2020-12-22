const qs = require("qs");
const { StockPriceMarketstackFactory } = require("./stockPriceFetcher");
const moment = require("moment");
const { CacheRequester } = require("./cacheRequester");
const { Article } = require("./objects/article");
const { AverageDataFactory } = require("@components/common/AverageDataFactory");
const { ROUTES } = require("src/const");
const { get, post } = require("axios").default;

/**
 *  @typedef {{
        id: number,
        ticker: string,
        description: string,
        created_at: string,
        updated_at: string,
        meta: {
            scrapped: any
        },
        img_src: string,
        company_name: string | null
    }} StockMeta The metadata to return

    @typedef {{ ticker: string, date: string, avg: number, daily: number }} StockParsedAvgOcc
 */

/**
 * @typedef {{
 *  year: number
 *  week: number
 *  ticker: number
 *  ocurrences: number
 *  change_percent: number
 * }} DailyOccRaw The daily ocurrence data
*/

 /**
  * @typedef {[
    string,
    number,
    string,
    string,
    string
]} AvgOccRaw The data gotten from calling to the endpoint from get_avg_occ_data
*/

/**
 * @typedef {{
 *  from: string
 *  value: string
 * }} StockScrappedPiece
*/

/**
 * @typedef {{
 *  companyLogos: StockScrappedPiece[],
 *  companyDescriptions: StockScrappedPiece[]
 *  companyWebsites: StockScrappedPiece[]
 *  companyNames: StockScrappedPiece[]
 * }} StockScrappedMeta
*/

/**
 * @typedef {{
 *      meta: StockScrappedMeta,
 *      weekly_ocurrences: DailyOccRaw
 * }} WeeklyOcurrences The weekly ocurrences object
*/

module.exports.StockManager = class StockManager {

    /**
     * @description This gets the weekly ocurrences loaded.
     * @param {number} top The top elements to select
     * @param {number} week The week of the year to search
     * @param {number} year The year to search
     * @returns {Promise<WeeklyOcurrences[]>} The weekly ocurrences object
     */
    static async fetchStockWeeklyOcurrences(top, week = (moment().week()), year = moment().year()) {
        if (isNaN(parseInt(week)) || isNaN(parseInt(year))) {
            throw new Error("Week and Year must be defined.");
        }
        let results = await this.fetchStockWeeklyOcurrencesRaw(week, year);
        let stocksMeta = [];
        results = results.sort((element1, element2)=>{
            if(element1.ocurrences > element2.ocurrences){
                return -1;
            }
            if(element1.ocurrences < element2.ocurrences){
                return 1;
            }
            return 0;
        });
        if(top){
            results = results.slice(0, top);
        }

        if(results.length <= 20){
            try{
                stocksMeta = await StockManager.fetchStockMeta(null, {
                    _where: {
                       _or: results.map((element)=>{
                           return {
                               ticker: element.ticker
                           }
                       })
                    }
                });
            }catch(e){
                console.log({
                    fetchStockWeeklyOcurrences_error: e
                });
            }
        }

        return results.map(weeklyElement => {
            let metadata = stocksMeta.find(stockElement => (stockElement.ticker.toLowerCase() === weeklyElement.ticker.toLowerCase()));
            if(!metadata){
                metadata = {
                    ticker: weeklyElement.ticker
                }
            }
            metadata.weekly_ocurrences = weeklyElement;
            return metadata;
        })
    }

    /**
     * @description Gets the company website from scrapped data
     * @param {StockScrappedMeta} scrapped The scrapped data
     */
    static getCompanyName(scrapped){
        if(Array.isArray(scrapped.companyNames)){
            let main = scrapped.companyNames.find((element)=>element.from === "stockanalysis.com");
            let fallback = scrapped.companyNames.find((element)=>element.from === "yahooinfo.com");
            let last = scrapped.companyNames[0];
            if(main){
                return main.value;
            }
            if(fallback){
                return fallback.value;
            }
            if(last){
                return last.value;
            }
        }
        return null;
    }

    /**
     * @description Gets the company logo from scrapped data
     * @param {StockScrappedMeta} scrapped The scrapped data
     */
    static getCompanyLogo(scrapped){
        if(Array.isArray(scrapped.companyLogos)){
            let main = scrapped.companyLogos.find((element)=>element.from === "clearbit");
            let fallback = scrapped.companyLogos.find((element)=>element.from === "wikipedia");
            let last = scrapped.companyLogos[0];
            if(main){
                return main.value;
            }
            if(fallback){
                return fallback.value;
            }
            if(last){
                return last.value;
            }
        }
        return null;
    }

    /**
     * @description Gets the company logo from scrapped data
     * @param {StockScrappedMeta} scrapped The scrapped data
     */
    static getCompanyDescription(scrapped){
        if(Array.isArray(scrapped.companyDescriptions)){
            let main = scrapped.companyDescriptions.find((element)=>element.from === "stockanalysis.com");
            let fallback = scrapped.companyDescriptions.find((element)=>element.from === "yahooinfo.com");
            if(main){
                return (main.value.replace("Description: ", "")+ " (From: StockAnalysis.com)").trim();
            }
            if(fallback){
                return fallback.value+ " (From: yahooinfo.com)";
            }
            if(last){
                return last.value;
            }
        }
        return null;
    }

    /**
     * @description Gets raw data for weekly ocurrences
     * @param {number} week The week
     * @param {number} year The year
     * @returns {Promise<DailyOccRaw[]>}
     */
    static async fetchStockWeeklyOcurrencesRaw(week = (moment().week()), year = moment().year()){
        let _raw = [];
        try {
            let weekly_payload = {
                week,
                year
            };
            _raw = (await CacheRequester.post(`${process.env.REACT_APP_API_END}/weekly_occurences`, {}, weekly_payload, (3600*1000))).data;
        } catch (e) {
            console.log(`Error getting weekly ocurrences stocks: `+e);
            _raw = [];
        }

        return _raw.map((raw)=>{
            return {
                year: parseInt(raw[0]),
                week: parseInt(raw[1]),
                ticker: raw[2],
                ocurrences: parseInt(raw[3]),
                change_percent: parseInt(raw[4]),
            }
        })

    }

    /**
     * @description Format items from fetchStockWeeklyOcurrences to 
     * items to set on scroll component for most popular stocks
     * @param {WeeklyOcurrences[]} topStocks The top stocks
     */
    static stockToCarouselItem(topStocks){
        return topStocks.map((element)=>{
            let ocurrences = element.weekly_ocurrences.ocurrences;
            return {
                title: element.weekly_ocurrences.ticker,
                img_src: element.img_src || null,
                subtitle: `${ocurrences} People are talking about this`,
                href: `${ROUTES.STOCK_PARTICULAR.replace(":stock_ticker", element.ticker)}`
            }
        })
    }

    /**
     * @description Gets the stock metadata (from Strapi) for a certain stock.
     * @param {string} stockTicker The stock ticker
     * @param {object} additionalQuery The additional data for the search
     * @returns {Promise<StockMeta[]>} The stock meta found for the ticker(s)
     */
    static async fetchStockMeta(stockTicker, additionalQuery=null) {
        let searchPayload = {};

        if (stockTicker && typeof stockTicker === "string") {
            searchPayload = Object.assign({
                _where: [{
                    ticker: stockTicker.toLowerCase()
                }
            ]})
        }

        if (additionalQuery) {
            Object.assign(searchPayload, additionalQuery)
        }
        //console.log({searchPayload});

        let query = qs.stringify(searchPayload);
        //console.log({query});
        const url = `${process.env.STRAPI_ENDPOINT}/stocks/?${query}`;
        try {
            let stockData = (await get(url)).data;
            stockData = stockData.map((stockElement)=>{
                let scrapped;
                //console.log("Scrapped 1");
                if(stockElement.meta){
                    //console.log("Scrapped 2");
                    if(stockElement.meta.meta){
                        //console.log("Scrapped 3");
                        scrapped = stockElement.meta.meta.scrapped
                    }else{
                        scrapped = stockElement.meta.scrapped;
                    }
                }

                if(scrapped){
                    stockElement.img_src = this.getCompanyLogo(scrapped);
                    stockElement.description = this.getCompanyDescription(scrapped);
                    stockElement.company_name = this.getCompanyName(scrapped);
                }
                return stockElement;
            })
            return stockData;
        } catch (e) {
            //console.log("Error making fetch call...", { e });
            throw e;
        }
    }

    /**
     * @description Returns the existing stock tickers as a string array
     * @returns {Promise<{
            rows:[string, number][],
            map:{
                [key:string]:{
                    id:number
                }
            }
        }>} The stock tickers. The key of the map is on uppercase.
     */
    static async fetchStockTickers(){
        const url = `${process.env.REACT_APP_API_END}/tweet_tickers`;
        /**
         * @type {[string, number][]} The ticker found and the number of mentions for that ticker
         */
        const {data} = await CacheRequester.get(url);
        const map = {};
        data.forEach((element)=>{
            map[element[0].toUpperCase()] = {
                id: element[1]
            };
        })
        return {rows: data, map};
    }

    static async fetchStockPrice(symbol, from, to) {
        const fetcher = new StockPriceMarketstackFactory();
        let fromM = moment(from), toM = moment(to);
        if (fromM.isValid() && toM.isValid()) {
            return await fetcher.fetch(symbol, fromM.format("YYYY-MM-DD"), toM.format("YYYY-MM-DD"));
        }
    }

    /**
     * @description RegEx Parses stocks from a text, and returns the uppercase unique matches
     * or an empty array
     */
    static scrapeFromText(text){
        let foundStocks = text.match(/(\$([a-zA-Z]+){1,6})/g);
        foundStocks = foundStocks ? foundStocks.map(element => element.replace("$", "").toUpperCase()) : [];
        let unique = [...new Set(foundStocks)];
        return unique;
    }

    /**
     * @description Gets the video tags mentioned on a video object and returns them uppercased.
     * If no stock is found, returns empty array.
     * @param {import("./jwPlayerManager").JWPVideo} video The video element
     * @returns {string[]} The stocks matched on the video
     */
    static scrapeFromVideo(video){
        let foundVideoStocks = this.scrapeFromText([
            video.description, video.title, video.tags
        ].join(""));
        return foundVideoStocks;
    }

    /**
     * @description Gets the article tags mentioned on a article object and returns them uppercased.
     * If no stock is found, returns empty array.
     * @param {Article} article The article element
     * @returns {string[]} The stocks matched on the article
     */
    static scrapeFromArticle(article){
        let foundVideoStocks = this.scrapeFromText([
            article.title,
            article.tags.map(element => element.name),
            article.content,
            article.categories.map(element => element.name)
        ].join(""));
        return foundVideoStocks;
    }

    /**
     * @description Loads several descriptions for stocks
     * @param {string[]} tickers The stock tickers without the $
     * @returns {Promise<StockMeta[]>} The metadata gotten
     */
    static async getSeveralMeta(tickers){
        let _or = [];
        for(let i=0; i < tickers.length; i++) {
            let ticker = tickers[i];
            _or.push({
                ticker: ticker.toLowerCase()
            });
        }
        
        let data = await this.fetchStockMeta(null, {
            _where: {
                _or
            }
        });
        return data;
    }

    /**
     * @description Gets the stocks metadata of the stocks mentioned in the text of a video
     * as long as they are included among our tickers
     * @returns {Promise<{
            meta: StockMeta,
            id: number,
            ticker: string}[]>} The stock metadata of the stocks found in the text
     * of the video
     * @param {import("./jwPlayerManager").JWPVideo} video The video to analyze
     */
    static async getVideoStocks(video){
        //We fetch all the tweet tickers
        let tweetTickers = await StockManager.fetchStockTickers();

        //We match all ocurrences of a $STOC type of string on the descriptions,
        //title and tags
        let foundVideoStocks = StockManager.scrapeFromVideo(video);

        //We filter the stocks to show only the ones we have on our DB
        let filteredVideoStocks = foundVideoStocks.filter(element => {
            return !!tweetTickers.map[element];
        })

        if(filteredVideoStocks.length == 0){
            return [];
        }

        //We load the stocks metadata for the stocks on the video
        let stocksMeta = await StockManager.getSeveralMeta(filteredVideoStocks);

        return filteredVideoStocks.map((ticker)=>{
            let element = tweetTickers.map[ticker.toUpperCase()];
            element.ticker = ticker;
            element.meta = stocksMeta.find(meta => (meta.ticker === ticker)) || null;
            return element;
        });
    }

    /**
     * @description Gets the stocks metadata of the stocks mentioned in the text of a article
     * as long as they are included among our tickers
     * @returns {Promise<{
            meta: StockMeta,
            id: number,
            ticker: string}[]>} The stock metadata of the stocks found in the text
     * of the article
     * @param {Article} article The article to analyze
     */
    static async getArticleStocks(article){
        //We fetch all the tweet tickers
        let tweetTickers = await StockManager.fetchStockTickers();

        //We match all ocurrences of a $STOC type of string on the descriptions,
        //title and tags
        console.log({article});
        let foundArticleStocks = StockManager.scrapeFromArticle(article);
        console.log({foundArticleStocks});

        //We filter the stocks to show only the ones we have on our DB
        let filteredArticleStocks = foundArticleStocks.filter(element => {
            return !!tweetTickers.map[element];
        })

        if(filteredArticleStocks.length == 0){
            return [];
        }

        //We load the stocks metadata for the stocks on the article
        let stocksMeta = await StockManager.getSeveralMeta(filteredArticleStocks);

        return filteredArticleStocks.map((ticker)=>{
            let element = tweetTickers.map[ticker.toUpperCase()];
            element.ticker = ticker;
            element.meta = stocksMeta.find(meta => (meta.ticker === ticker)) || null;
            return element;
        });
    }


    /**
     * @description Gets the stocks mentioned in the video
     * @returns {Promise<{
        ticker: string
        tweets: number
        logo: string
     * }[]>} The elements matched
     @param {import("./jwPlayerManager").JWPVideo} video The video to get the tags from
     */
    static async getVideoStocksItems(video){
        try{
            let stocksMeta = await this.getVideoStocks(video);
            let tweets = await this.fetchStockWeeklyOcurrencesRaw();
            //console.log({tweets});

            let inVideoFoundStocksData = stocksMeta.map(element => {
                let tweetAmmount = tweets.find(tweetElement => {
                    return tweetElement.ticker.toLowerCase() === element.ticker.toLowerCase()
                });
                return {
                    ticker: element.ticker.toUpperCase(),
                    tweets: tweetAmmount ? tweetAmmount.ocurrences : 0,
                    logo: element.meta ? element.meta.img_src : "",
                }
            })
    
            return inVideoFoundStocksData;
        }catch(e){
            console.log({
                getVideoStocksItems_error: e
            });
        }
    }
    /**
     * @description Gets the stocks mentioned in the article
     * @returns {Promise<{
        ticker: string
        tweets: number
        logo: string
     * }[]>} The elements matched
     * @param {Article} article The article to match the data from
     */
    static async getArticleStocksItems(article){
        try{
            if(!article){
                return [];
            }
            let stocksMeta = await this.getArticleStocks(article);

            let inVideoFoundStocksData = stocksMeta.map(element => {
                return {
                    ticker: element.ticker.toUpperCase(),
                    tweets: element.id,
                    logo: element.meta ? element.meta.img_src : "",
                }
            })
    
            return inVideoFoundStocksData || [];
        }catch(e){
            console.log({
                getArticleStocksItems_error: e
            });
            return [];
        }
    }

    /**
     *  @description Gets the average ocurrences of a stock
     *  @param {number} stockId The stock numerical ID on tweets database. DO NOT CONFUSE WITH TICKER
     *  @returns {Promise<AvgOccRaw[]>} The average ocurrence raw data for a selected stock ID.
        @example {[[
            'TSLA',
            1425,
            'Thu, 20 Aug 2020 00:00:00 GMT',
            '14027',
            '14027.0000000000000000'
        ]]}
     */
    static async getAvgOcurrence(stockId){
        let {data} = await post(`${process.env.REACT_APP_API_END}/get_avg_occ_data`, [
            stockId
        ])
        return data;
    }

    /**
     * @description Gets the data for the average ocurrences
     * @param {string} stockTicker The stock ticker string. DO NOT CONFUSE WITH STOCK ID
     * @returns {Promise<StockParsedAvgOcc[]>} The ticker parsed average ocurrences
     */
    static async getAverageOcurrences(stockTicker){
        let tweetTickers = await this.fetchStockTickers();

        //If no ticker found, we return an empty array (as we didn't find the ticker inside our DB)
        if(!tweetTickers.map[stockTicker]){
            return [];
        }

        let stockId = tweetTickers.map[stockTicker].id;

        //return stockId;
        let data = await this.getAvgOcurrence(stockId);
        let parsedData = AverageDataFactory.parseFromDataArray(data);
        let {dats, stateProps} = AverageDataFactory.parseDataForStock(parsedData);
        //console.log({ parsedData, data, stateProps });
        return dats;
    }

}