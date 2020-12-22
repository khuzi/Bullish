const { CacheRequester } = require("./cacheRequester");

const {post} = require("axios").default;

/**
 * @typedef {[
    string,
    number,
    string,
    string,
    string,
    string
]} StockTweetRaw The tweet element binding it to the stock
 */

 /**
  * @typedef {{
        ticker: string,
        stockId: number,
        tweetUserID: string,
        tweetContent: string,
        tweetDate: string,
        tweetId: string
    }} StockTweet The stock tweet data
  */
module.exports.TweetsManager = class TweetsManager {
    
    /**
     * @param {number} stockId The ID for the stock to search
     * @example {[[
     *  "stockTicker",
        stockId,
        "tweeterUserIdNumber",
        "Some text for the tweet",
        "Fri, 11 Dec 2020 15:14:47 GMT",
        "tweetIdNumber"]]}
        @returns {Promise<StockTweetRaw[]>} The array of tweets caught for this stock
     */
    static async fetchStockTweetsData(stockId){
        let url = `${process.env.REACT_APP_API_END}/tweets_by_stock_id`;
        let {data} = await CacheRequester.post(url, {}, {
            stock_id: stockId
        }, (5*60*1000), 1);
        return data;
    }

    /**
     * @description Gets the 200 latest tweets for a stock.
     * @param {number} stockId The stock ID
     * @returns {Promise<StockTweet[]>} The stock tweets
     */
    static async fetchStockTweets(stockId){
        let data;
        try{
            data = await this.fetchStockTweetsData(stockId);
        }catch(e){
            return [];
        }
        
        //console.log({ data: data.slice(0, 5) });
        let returnData = data.map(element => {
            /**
             *  'DNKN',
                1775,
                '1134049078424162304',
                'As Tesla elbows into S&amp;P 100 indexes set other shuffles; AIV -3.9% $AIV $OXY $DNKN https://t.co/XaPujt1mHf  ',
                'Fri, 11 Dec 2020 17:53:22 GMT',
                '1337530948796239874'
             */
            return {
                ticker: element[0],
                stockId: parseInt(element[1]),
                tweetUserID: element[2],
                tweetContent: element[3],
                tweetDate: element[4],
                tweetId: element[5]
            }
        });
        //console.log({ returnData: returnData.slice(0, 5) });
        return returnData;
    }

}