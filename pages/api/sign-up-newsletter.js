import { NewsletterManager } from '@lib/newsletterManager';
import NextCors from 'nextjs-cors';
import { StockManager } from "src/lib/stockManager";

export default async function(req, res){

    try{
        ///*
        await NextCors(req, res, {
            // Options
            methods: ['POST'],
            origin: 'http://bullish.studio',
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });
        //*/
        /*
        let result = await NewsletterManager.subscribe({
            email: "azolotdev@gmail.com"
        });

        res.statusCode = 200;
        res.json({result});
        */
        let {body} = req;
        if(!body){
            res.statusCode = 400;
            res.json({"reason": "Invalid data provided"})
            return;
        }
        let result = await NewsletterManager.subscribe({
            email: body.email
        });
        res.statusCode = result.status_code;
        res.json({result});
    }catch(e){
        res.statusCode = 400
        res.json({ result: 'Error', error: e+"" })
    }

}