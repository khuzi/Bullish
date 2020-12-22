const moment = require("moment");

/**
 * @property {open} number
 */
module.exports.StockPrice = class StockPrice {
    constructor(){
        /*
        this.open = 0;
        this.high =  119.06;
        this.low =  116.81;
        this.close =  118.64;
        this.volume =  74112972.0;
        this.symbol =  "TEST";
        this.date =  "2020-11-19T00:00:00+0000";
        */
    }

    //this.adj_high =  119.06;
    //this.adj_low =  116.81;
    //this.adj_close =  118.64;
    //this.adj_open =  117.59;
    //this.adj_volume =  74112972.0;
    //this.exchange =  XNAS;

    toJSON(){
        return {
            open: this.open,
            high: this.high,
            low: this.low,
            close: this.close,
            volume: this.volume,
            symbol: this.symbol,
            date: this.date,
        }
    }

    static fromJSON(payload){
        let price = new StockPrice();
        price.open = payload.open;
        price.high = payload.high;
        price.low = payload.low;
        price.close = payload.close;
        price.volume = payload.volume;
        price.symbol = payload.symbol;
        price.date = payload.date ? moment(payload.date).format("YYYY-MM-DD") : null;
        return price;
    }
    
}