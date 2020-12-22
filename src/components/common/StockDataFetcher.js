import { StockPrice } from "../../../src/lib/stockPrice";

const {get} = require("axios").default;
const moment = require("moment");

export class StockDataFetcher {
    /**
     * @param {{
            STOCK_MARKET_DESCRIPTION_END: string,
            STOCK_MARKET_PRICE_END: string,
        }} API_ROUTES The API Routes to fetch the data from.
     */
    constructor(API_ROUTES){
        this.API_ROUTES = API_ROUTES;
    }

    async getStockPrice(symbol, from, to){
        let fromM = moment(from), toM = moment(to);
        if(!fromM.isValid() || !toM.isValid()){
            throw new Error("Invalid dates provided");
        }
        const priceRoute = this.API_ROUTES.STOCK_MARKET_PRICE_END
            .replace("_SYMBOL_", symbol)
            .replace("_FROM_YYYY-MM-DD_", fromM.format("YYYY-MM-DD"))
            .replace("_TO_YYYY-MM-DD_", toM.format("YYYY-MM-DD"));
        const {data} = await get(priceRoute);
        return data.map(element => {
            return StockPrice.fromJSON(element)
        })
    }

    async getStockDescription(symbol){
        if(!symbol){
            throw new Error("Requires a symbol to fetch it's description")
        }
        const route = this.API_ROUTES.STOCK_MARKET_DESCRIPTION_END
            .replace("_SYMBOL_", symbol);
        const {data} = await get(route);
        return data;
    }
}