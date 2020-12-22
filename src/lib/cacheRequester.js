const {get, post, put} = require("axios").default;
const qs = require("qs");

/**
 * @description Requests data but first checks on our cache custom system
 */
module.exports.CacheRequester = class CacheRequester {
    static _data = {
        "someURL": {
            //The promise in charge to fetch the cache
            promise: new Promise((accept)=>{
                accept();
            }),
            //The URL to fetch the cache from
            url: "http://someurl.com",
            //The time when the cache was fetched
            fetchedAt: new Date().getTime(),
            //The max age for the cache
            maxAge: (3600*1000)
        }
    }

    /**
     * @param {string} url The URL to call
     * @param {object} options The additional axios options
     */
    static getKey(url, options){
        return JSON.stringify({url, options});
    }

    /**
     * @description Fetchs whether a cache element has expired
     */
    static hasExpired(key, specificMaxAge){
        if(!this._data[key]){
            return false;   //Hasn't expired. It just doesn't exist.
        }

        if (Number.isInteger(this._data[key].fetchedAt) && Number.isInteger(this._data[key].maxAge)){
            let passed = ((new Date().getTime()) - this._data[key].fetchedAt);
            let maxAge = isNaN(specificMaxAge) ? this._data[key].maxAge : specificMaxAge;
            if(passed > maxAge){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    /**
     * @param {string} url The URL to fetch it
     * @param {object} options The additional options for the get request
     * @param {number} maxAge The max age. in milliseconds. If last cache was fetched at that time, it refetches it
     * @param {number} retries Max ammount of additional retries
     */
    static async get(url, options = {}, maxAge, retries = 5){
        return this.request('get', url, options, {}, maxAge, retries);
    }

    static async post(url, options = {}, body={}, maxAge, retries = 5){
        return this.request('post', url, options, body, maxAge, retries);
    }

    /**
     * @description Makes a request to an endpoint
     * @param {string} method 
     * @param {string} url The URL to fetch
     * @param {object} options The additional request options
     * @param {number} maxAge The request body
     * @param {number} retries Max. ammount of retries allowed
     */
    static async request(method, url, options = {}, body={}, maxAge, retries = 5){
        let key = this.getKey(url, options);
        

        if(this.hasExpired(key, maxAge)){
            console.log(`${key} has expired...`);
            delete this._data[key];
        }

        if(!this._data[key]){
            this._data[key] = {
                promise: new Promise((accept, reject)=>{
                    console.log(`Fetching URL: "${url}"...`);
                    if(method === "get"){
                        get(url, options)
                        .then((data)=>{
                            this._data[key].data = data;
                            this._data[key].fetchedAt = new Date().getTime();
                            accept(data);
                        })
                        .catch((err)=>{
                            console.log(`ERROR requesting URL ${url}: `,{err});
                            reject(err);
                        })
                    }else if(method === "post"){
                        post(url, body, options)
                        .then((data)=>{
                            this._data[key].data = data;
                            this._data[key].fetchedAt = new Date().getTime();
                            accept(data);
                        })
                        .catch((err)=>{
                            console.log(`ERROR requesting URL ${url}: `,{err});
                            reject(err);
                        })
                    }else if(method === "put"){
                        put(url, body, options)
                        .then((data)=>{
                            this._data[key].data = data;
                            this._data[key].fetchedAt = new Date().getTime();
                            accept(data);
                        })
                        .catch((err)=>{
                            console.log(`ERROR requesting URL ${url}: `,{err});
                            reject(err);
                        })
                    }
                }),
                data: null,
                maxAge: isNaN(maxAge) ? (3600*1000) : maxAge
            };
        }

        if (this._data[key].data){
            console.log(`Found ${url} data on the cache...`);
            return this._data[key].data;
        }else if(this._data[key].promise){
            console.log(`Found ${url} PROMISE on the CACHE...`,{ promise: this._data[key].promise });
            try{
                let result = await this._data[key].promise;
                //console.log(`Awaited promise "${url}". Returning result.`,{result});
                return result;
            }catch(e){
                console.log(`Caught await error for ${url}`);
                if(e.response && e.response.status != 404){
                    if(retries > 0){
                        retries--;
                    }else{
                        console.log("Retries not found. Throwing error");
                        throw e;
                    }
                    console.log(`Retries left: ${retries}...`);
                    let waitTimeout = parseInt(Math.random() * (3500 - 1500) + 1500);
                    await new Promise(accept => setTimeout(accept, waitTimeout));  //Retry after 1000 ms
                    return this.request(method, url, options, body, maxAge, retries);
                }else{
                    throw e;
                }
            }
        }
    }


    /**
     * @returns {Promise<WPTags[]>} The wordpress tags data for this website.
     */
    static async getWPTags(){
        
        let key = "WP_TAGS";//this.getKey(url, options);
        let maxAge = (3600*1000);

        if(this.hasExpired(key)){
            delete this._data[key];
        }

        if(!this._data[key]){
            this._data[key] = {
                promise: new Promise(async (accept)=>{

                    let reachedEnd = false;
                    let tags = [];
                    let page = 1;
                    while(!reachedEnd){
                        let query = qs.stringify({
                            per_page: 100,
                            page
                        });
                        let url = `https://bullish.news/wp-json/wp/v2/tags/?${query}`;
                        console.log(`Requesting... ${url}`);
                        try{
                            let {data} = await this.get(url, undefined, undefined, 5);
                            if(data.length < 1){
                                reachedEnd = true;
                                continue;
                            }
                            tags = tags.concat(data)
                            page++;
                        }catch(e){
                            console.log(`Error fetching tags on page ${page}. Retrying...`);
                        }
                    }
                    accept(tags);
                }),
                data: null,
                maxAge: maxAge
            };
        }

        if (this._data[key].data){
            //console.log(`Found ${url} on the cache...`);
            return this._data[key].data;
        }else if(this._data[key].promise){
            //console.log(`Found ${url} PROMISE on the cache...`);
            let result = await this._data[key].promise;
            return result;
        }
    }

    /**
     * @description Flushed the cache of a request (removes it's cache)
     */
    static flush(url, options){
        let key = this.getKey(url, options);
        delete this._data[key];
    }
}