const { AuthManager }  = require("./authManager");

const fs = require("fs");
const path = require("path");
const dir = path.resolve('default.page.metadata.json');
const axios = require("axios");

module.exports.MetaFetcher = class MetaFetcher {
    static meta = {}
    static async fetchPageData(pageID = "index"){
        const {data} = await axios.get(`${process.env.STRAPI_ENDPOINT}/page-metas/`);

        const page = data.find(element => element.page_id === pageID);
        if(page){
            //console.log({page});
            return page;
        }
        return JSON.parse(fs.readFileSync(dir).toString())[pageID] || {};
    }

    static async initialize(){
        const { data } = await axios.post(`${process.env.STRAPI_ENDPOINT}/auth/local`, {
            identifier: process.env.STRAPI_READER_EMAIL,
            password: process.env.STRAPI_READER_PASSWORD,
        });
        //console.log({data});
        this.signInData = data;
    }

    static async fetchXMLMeta(){
        await AuthManager.getCredentials();
        const {data} = await axios.get(`${process.env.STRAPI_ENDPOINT}/page-metas/`);
        return data;
    }

    static async fetchFooterData(){
        return {
            BULLISH_DATA_ADDRESS: process.env.BULLISH_DATA_ADDRESS,
            BULLISH_DATA_EMAIL: process.env.BULLISH_DATA_EMAIL,
            BULLISH_DATA_URL: process.env.BULLISH_DATA_URL,
            BULLISH_DATA_LOGO: process.env.BULLISH_DATA_LOGO
        };
    }
}