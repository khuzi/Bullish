const { MetaFetcher } = require("./metaFetcher");
const { create } = require('xmlbuilder2');
const fs = require("fs");
const moment = require("moment");

module.exports.SitemapManager = class SitemapManager {

    static async generateSitemap(){

        const meta = await MetaFetcher.fetchXMLMeta();

        const commonPagesData = meta.map(element => {
            let existingSitemapMetadata = element.sitemap_custom_data ? element.sitemap_custom_data : element.sitemap_data;
            if(existingSitemapMetadata){
                try{
                    existingSitemapMetadata = JSON.parse(existingSitemapMetadata);
                }catch(e){

                }
            }

            const resultingSitemapData = Object.assign({
                loc: element.canonical_url_path,
                lastmod: moment(element.updated_at).format("YYYY-MM-DD"),
                changefreq: "mothly",
                priority: 0.9
            }
            ,existingSitemapMetadata);
            return resultingSitemapData;
        });

        let sitemapData = {
            urlset: {
                url: commonPagesData,
                "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"
            }
        }

        return create(sitemapData).end({ prettyPrint: true });
    }

    /**
     * @description Builds sitemap
     */
    static async buildSitemap(){
        const sitemap = await this.generateSitemap();
        fs.writeFileSync("public/sitemap.xml", sitemap);
        console.log("Reloaded public sitemap at "+new Date().toUTCString());
    }
}