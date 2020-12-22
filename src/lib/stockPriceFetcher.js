const {get} = require("axios").default;
const { StockPrice } = require("./stockPrice");

const STOCK_PRICE_FETCH_URL = "http://api.marketstack.com/v1/eod?access_key=_ACCESS_KEY_&symbols=_SYMBOL_&date_from=_FROM_YYYY-MM-DD_&date_to=_TO_YYYY-MM-DD_";

module.exports.StockPriceMarketstackFactory = class StockPriceMarketstackFactory {

    /**
     * 
     * @param {{
        "open": number,
        "high": number,
        "low": number,
        "close": number,
        "volume": number,
        "adj_high": number,
        "adj_low": number,
        "adj_close": number,
        "adj_open": number,
        "adj_volume": number,
        "symbol": string
        "exchange": string
        "date": string
    }[]} elements 
     */
    async parseToStockElements(elements = []){
        return elements.map(element => {
            let stockPriceElement = new StockPrice();
            stockPriceElement.open = element.open;
            stockPriceElement.high = element.high;
            stockPriceElement.low = element.low;
            stockPriceElement.close = element.close;
            stockPriceElement.volume = element.volume;
            stockPriceElement.symbol = element.symbol;
            stockPriceElement.date = new Date(element.date);
            return stockPriceElement;
        })
    }

    async fetch(symbol, fromDate, toDate){
        if(!process.env.MARKETSTACK_API_KEY){
            throw new Error("API Key not found. #2251432");
        }

        let requestURL = STOCK_PRICE_FETCH_URL
            .replace("_ACCESS_KEY_", process.env.MARKETSTACK_API_KEY)
            .replace("_SYMBOL_", symbol)
            .replace("_FROM_YYYY-MM-DD_", fromDate)
            .replace("_TO_YYYY-MM-DD_", toDate);
        const {data} = (await get(requestURL)).data;
        return this.parseToStockElements(data)
    }
}