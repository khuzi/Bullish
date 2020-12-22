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
        let element = await StockManager.fetchStockMeta(req.query.stock)
        if(Array.isArray(element) && element.length > 0){
            element = element[0];
        }
        if(!element){
            res.statusCode = 404;
            res.json({})
        }else{
            res.statusCode = 200;
            console.log({element});
            res.json(element)
        }
    }catch(e){
        res.statusCode = 400
        res.json({ result: 'Error', error: e+"" })
    }

}