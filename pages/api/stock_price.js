import NextCors from 'nextjs-cors';
import { StockManager } from "src/lib/stockManager";

export default async function(req, res){

    try{
        await NextCors(req, res, {
            // Options
            methods: ['GET'],
            origin: 'http://bullish.studio',
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });
        console.log({
            query: req.query
        });
        let stock = req.query ? req.query.stock : null;
        let from = req.query ? req.query.from : null;
        let to = req.query ? req.query.to : null;
        if(!stock || !from || !to){
            res.statusCode = 400;
            res.json({ error: "You need a valid stock symbol and a from and to date" })
            return;
        }
        try{
            const element = await StockManager.fetchStockPrice(stock, from, to)
            if(!element){
                res.statusCode = 404;
                res.json({}); 
            }else{
                res.statusCode = 200;
                res.json(element);
            }
        }catch(e){
            res.statusCode = 400;
            res.json({ error: e+"" });
            return;
        }
    }catch(e){
        res.statusCode = 400;
        res.json({ error: e+"" });
        return;
    }

}