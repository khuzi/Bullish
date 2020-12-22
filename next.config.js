const { CacheObjectManager } = require('./src/lib/cacheObjectManager');
const { SitemapManager } = require('./src/lib/sitemapManager');
const withTM = require('next-transpile-modules')(['lodash-es', 'react-d3-speedometer']);


console.log("Generating sitemap...");
SitemapManager.buildSitemap()
.then(()=>{
    console.log("Sitemap generated.");
})
.catch((e)=>{
    console.log("Sitemap error: ",{e});
});


CacheObjectManager.startCacheDaemon();

///*
CacheObjectManager.loadWPData()
.then((storeData)=>{
    //console.log(`Loaded ${storedAmmount} WP posts`);
    console.log({storeData});
})
.catch((err)=>{
    console.log("Error loading metadata.",{err});
})
//*/

module.exports = withTM({

})
//*/