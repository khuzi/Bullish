const qs = require("qs");
const fs = require("fs");
const { ServerUtils } = require("./utils");

const postsStorePath = "temp/wpData_posts.json";
const tagsStorePath = "temp/wpData_tags.json";
const categoriesStorePath = "temp/wpData_categories.json";
const mediaStorePath = "temp/wpData_media.json";
const commentsStorePath = "temp/wpData_comments.json";
const usersStorePath = "temp/wpData_comments.json";

module.exports.CacheObjectManager = class CacheObjectManager {

    /**
     * @type {Promise<any>}  The main promise for loading the data.
     */
    loadWPPromise = null;
    /**
     * @type {Interval} The main cache interval. clearInverval to clear it out.
     */
    daemonInterval = null;

    /**
     * @param {string} recordUrl Gets all the website records URL
     * @returns {Promise<object[]>} The resulting records
     */
    static async fetchRecords(recordUrl){
        let records = [], current_page = 1, per_page = 100;
        let total = null, totalPages = null;

        try{
            let url = `${recordUrl}?per_page=${per_page}`;
            let {headers, data} = await ServerUtils.retryRequest(url, 'get', {}, {}, 5, (err)=>{
                return (err && err.response && err.response.status == 503);
            }, 1500);
            
            total = parseInt(headers['x-wp-total']);
            totalPages = parseInt(headers['x-wp-totalpages']);

            records = data;
            current_page++;
        }catch(e){
            throw new Error("Invalid total pages for the dataset.");
        }

        //while(records.length <= total && current_page <= totalPages){
        let reachedEnd = false;
        while(!reachedEnd){
            let query = qs.stringify({
                per_page: per_page,
                page: current_page
            });
            let url = `${recordUrl}?${query}`;
            try{
                console.log({
                    url, per_page, current_page, records: records.length, total
                });
                let {data} = await ServerUtils.retryRequest(url, 'get', {}, {}, 5, (e)=> {
                    return (e && e.response && (e.response.status == 503));
                });
                if(data.length < 1){
                    reachedEnd = true;
                    break;
                }
                records = records.concat(data)
                current_page++;
            }catch(e){
                if(e && e.response && (e.response.status == 400)){
                    reachedEnd = true;
                }else{
                    console.log(`Error fetching tags on page ${current_page}...`,{
                        e
                    });
                    reachedEnd = true;
                }
            }
        }
        /*
        while(records.length <= total){
            let query = qs.stringify({
                per_page: per_page,
                page: current_page
            });

            const url = `${recordUrl}?${query}`;
            console.log({
                url, total, totalPages, records: records.length, current_page
            });
            let data, headers;
            try{
                //let payload = await get(url);
                let url = `${recordUrl}?per_page=${per_page}`;
                let payload = await ServerUtils.retryRequest(url, 'get', {}, {}, 5, (err)=>{
                    return (err && err.response && err.response.status == 503);
                }, 1500);
                data = payload.data;
                headers = payload.headers;
            }catch(e){
                console.log({e});
                break;
            }
            records = records.concat(data);
            current_page++;
        }
        */
        return records;
    }

    /**
     * @param {string} recordUrl The record URL where the records are
     * @param {string} filePath The file path to get the records from
     * @returns {Promise<number>} The ammount of records created
     */
    static async createRecords(recordUrl, filePath){
        console.time(`createRecords ${recordUrl}`);
        let records = await this.fetchRecords(recordUrl);
        fs.writeFileSync(filePath, JSON.stringify({
            records: records,
            fetched_at: new Date().toUTCString()
        }, null, 4));
        console.timeEnd(`createRecords ${recordUrl}`);
        return records.length;
    }

    /**
     * @description Get the file path
     * @param {string} filePath The path for this file
     */
    static readFile(filePath){
        if(!fs.existsSync(filePath)){
            throw new Error(`Store file path: "${filePath}" was not found.`);
        }
        let data;
        try{
            data = JSON.parse(fs.readFileSync(filePath).toString())
        }catch(e){
            throw new Error(`File store "${filePath}" doesn't have a valid .JSON`);
        }
        return data;
    }
    
    /**
     * @description Updates records on the data store based on a comparison function (if matched, otherwise, adds to the end of the records array).
     * @param {string} recordUrl The record URL where the records are
     * @param {string} filePath The file path to get the records from
     * @param {(existingElement, newRecord)=>boolean} equalityCompareFunction The comparison function. If it returns true, it will update existingElement with newRecord
     */
    static async updateRecords(recordUrl, filePath, equalityCompareFunction){
        /**
         * @type {object[]}
         */
        let newRecords = await this.fetchRecords(recordUrl);
        /**
         * @type {{fetched_at:string, records:object[]}}
         */
        let existingFileData = this.readFile(filePath);

        let existingRecords = Array.isArray(existingFileData.records) ? existingFileData.records : [];
        let newStoreRecords = [];
        //Create or update individual records.
        for(let i=0; i < newRecords.length; i++){
            let newRecord = newRecords[i];
            let updatableRecordIndex = existingRecords.findIndex(existingElement => equalityCompareFunction(existingElement, newRecord))
            if(updatableRecordIndex < 0){
                newStoreRecords.push(newRecord);
            }else{
                existingRecords[updatableRecordIndex] = newRecord;
            }
        }
        newStoreRecords = newStoreRecords.concat(existingRecords);
        
        fs.writeFileSync(filePath, JSON.stringify({
            records: newStoreRecords,
            fetched_at: new Date().toUTCString()
        }, null, 4));
        return {
            newStoreRecords: newStoreRecords.length
        };
    }

    /**
     * @description Gets all the data and stores it locally.
     */
    static async loadWPData(){
        let createResult, updateResult;
        if(this.loadWPPromise){
            return this.loadWPPromise;
        }

        this.loadWPPromise = new Promise(async (accept)=>{
            let posts = await this.createRecords("https://bullish.news/wp-json/wp/v2/posts/", postsStorePath);
            let video_skrn = await this.updateRecords("https://bullish.news/wp-json/wp/v2/video_skrn/", postsStorePath, (existingElement, newRecord)=>{ return (existingElement.id === newRecord.id) });
            let tags = await this.createRecords("https://bullish.news/wp-json/wp/v2/tags/", tagsStorePath);
            let categories = await this.createRecords("https://bullish.news/wp-json/wp/v2/categories/", categoriesStorePath);
            let media = await this.createRecords("https://bullish.news/wp-json/wp/v2/media/", mediaStorePath);
            let comments = await this.createRecords("https://bullish.news/wp-json/wp/v2/comments/", commentsStorePath);
            let users = await this.createRecords("https://bullish.news/wp-json/wp/v2/users/", usersStorePath);
            accept({ 
                posts,
                video_skrn,
                tags,
                categories,
                media,
                comments,
                users
             });
        });
        this.loadWPPromise.then(()=>{
            delete this.loadWPPromise;
        });
        return this.loadWPPromise;
    }

    /**
     * @description Loads a post from the cache store
     * @param {number} postId The ID for the post
     */
    static loadPostFromStore(postId){
        try{
            let postsData = this.readFile(postsStorePath);
            let {records} = postsData;
            return records.find((element)=>{
                return (element.id == postId)
            });
        }catch(e){
            return null;
        }
    }

    /**
     * @description Counts the existing comments on a post
     * @param {number} postId The ID for the post
     */
    static countComments(postId){
        try{
            let postsData = this.readFile(commentsStorePath);
            let {records} = postsData;
            return records.filter((element)=>{
                return (element.post == postId)
            }).length;
        }catch(e){
            return null;
        }
    }

    /**
     * Fetchs a media object from its store.
     * @param {number} mediaId The media ID to fetch
     */
    static getMedia(mediaId){
        let tagsData = this.readFile(mediaStorePath);
        let {records} = tagsData;
        return records.find(element => element.id == mediaId);
    }

    /**
     * @description Gets the tags record in the local store object
     */
    static getTags(){
        try{
            let postsData = this.readFile(tagsStorePath);
            let {records} = postsData;
            return records;
        }catch(e){
            return [];
        }
    }

    /**
     * Fetchs a user object from its store.
     * @param {number} userId The user ID to fetch
     */
    static getUser(userId){
        let usersData = this.readFile(usersStorePath);
        let {records} = usersData;
        return records.find(element => element.id == userId);
    }

    /**
     * @description Updates the stored cache every X minutes.
     */
    static startCacheDaemon(){

        //We set the interval
        console.log("startCacheDaemon started");

        //Set the cache interval
        this.daemonInterval = setInterval(()=>{
            console.log("startCacheDaemon loadWPData executing...");
            console.time("startCacheDaemon")
            this.loadWPData()
            .then((data)=>{
                console.log(`loadWPData loaded on ${(new Date()).toUTCString()}`,{ data });
                console.timeEnd("startCacheDaemon")
            })
            .catch((err)=>{
                console.log("Error loading interval...");
                console.timeEnd("startCacheDaemon")
            });
        }, (5*60*1000))
    }

}