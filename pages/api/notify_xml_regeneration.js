import { SitemapManager } from "src/lib/sitemapManager";
import fs from 'fs';

export default async function(req, res){

    try{
        await SitemapManager.buildSitemap();
        res.statusCode = 200
        res.json({ result: 'OK' })
    }catch(e){
        res.statusCode = 400
        res.json({ result: 'Error', error: e+"" })
    }

}