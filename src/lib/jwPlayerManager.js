const {get, post} = require("axios").default;
var crypto = require('crypto')
const qs = require("qs");
const { JWPVideo, JWPPlaylistResult } = require("src/docs/jstypes");

const sortDirs = {
    "asc": 1, "dsc": 1
}

module.exports.JWPlayerManager = class JWPlayerManager {

    /**
     * @description Gets a test playlist
     */
    static async getTestPlaylist(){
        return await this.getPartnerPlaylist("testPartner")
    }

    /**
     * @description Gets the context that should be used on an embed request
     * @param {Object} req The request object
     * @param {Object} query The query object
     */
    static getEmbedContext(req, query){
        let {use_context} = query;
        if(!use_context){
            return null;
        }
        let context = query.context ? query.context : null;
        return context;
    }

    /**
     * @description This method gets a partner playlist along with additional data
     * @param {string} partnerId The parter unique legible ID
     */
    static async getPartnerPlaylist(parterId, playlistContextURL){
        let query = qs.stringify({
            _where: [{
                customID: parterId
            }]
        });
        const partnerData = (await get(`${process.env.STRAPI_ENDPOINT}/partners?${query}`)).data;
        const {recommended_playlist_id, leading_video_id, custom_data} = partnerData[0];
        let data;
        if(playlistContextURL){
            data = await this.getContextPlaylist(playlistContextURL);
        }else{
            data = (await get(`https://cdn.jwplayer.com/v2/playlists/${recommended_playlist_id}?related_media_id=${leading_video_id || 'W6eWKAEs'}`)).data;
        }
        

        let advertising = null;
        if(custom_data && custom_data.ad_schedule){
            try{
                //const {data} = await get(`https://cdn.jwplayer.com/v2/advertising/schedules/${custom_data.ad_schedule}.json`);
                advertising = await this.getSchedule(custom_data.ad_schedule);
            }catch(e){
                console.log(`Error loading advertising schedule ID ${custom_data.ad_schedule}: `+e);
            }
        }else if(custom_data.custom_player_id){
            try{
                let configSchedule = await this.getPlayerScheduleData(custom_data.custom_player_id);
                //console.log({ parterId, configSchedule });
                advertising = configSchedule;
            }catch(e){
                console.log(`Error loading schedule from JWPlayer configuration: `+e);
            }
        }
        return {
            playlist: data.playlist,
            custom: custom_data,
            leading_video_id,
            advertising
        };
    }

    /**
     * @description Gets a playlist based on a contex provided
     * @param {string} contextURL The context URL (could also be a free text)
     * @returns {Promise<JWPPlaylistResult>}
     */
    static async getContextPlaylist(contextURL){
        try{
            contextURL = encodeURIComponent(contextURL);
            const {data} = await get(`https://cdn.jwplayer.com/v2/playlists/${process.env.CONTEXT_PLAYLIST_ID}?search=${contextURL}`);
            return data;
        }catch(e){
            return {
                playlist: []
            };
        }
    }

    /**
     * @description Gets a playlist via its id
     * @param {string} playlistID The playlist ID
     * @returns {Promise<JWPPlaylistResult>}
     */
    static async getPlaylist(playlistID){
        return (await get(`https://cdn.jwplayer.com/v2/playlists/${playlistID}`)).data;
    }

    /**
     * @param {string} videoID Video ID
     * @description Gets a video data
     * @returns {Promise<JWPVideo>} The video found
     */
    static async getVideo(videoID){
        return (await get(`https://cdn.jwplayer.com/v2/media/${videoID}`)).data.playlist[0];
    }

    /**
     * @description Performs a video search for the v2 search functionality
     * @param {string} searchTerm The term to search
     * @param {string[]} tags The different tags to search
     * @param {string} id A possible ID of the video.
     * @param {1|2} eq The comparison method (1 = OR, 2 = AND)
     * @param {{
        dir: 'dsc' | 'asc', //'asc' || 'dsc'
        attribute: "created"
        }} sort The sorting direction
    */
    static getSeachQuery(searchTerm, tags, id, eq = 1, sort = {
        dir: 'dsc', //'asc' || 'dsc'
        attribute: "created"
    }, page = 1, page_length = 10){
        const searchElement = ["https://api.jwplayer.com/v2/sites/ltQn70c9/media/?q="];
        //https://api.jwplayer.com/v2/sites/ltQn70c9/media/
        //?q=(title:+"THC"+OR+description:+"THC"+OR+tags:+"THC"+OR+id:+"THC")
        //https://api.jwplayer.com/v2/sites/ltQn70c9/media/?q=(title:+"THC"+OR+description:+"THC"+OR+tags:+"THC"+OR+id:+"THC")
        
        //https://api.jwplayer.com/v2/sites/ltQn70c9/media/?q=(tags:+"THC")
        let searchBody = [], joinTags, operator = "OR";
        switch(eq){
            case 2:
                operator = "AND";
            break;
        }
        if(searchTerm){
            searchBody.push(`title:+"${searchTerm}"+OR+description:+"${searchTerm}"`);
        }
        if(tags && Array.isArray(tags) && tags.length > 0){
            console.log("Parsing tags: ",{tags});
            
            joinTags = tags.map(element => {
                return `tags:+"${element}"`
            }).join(`+${operator}+`);
        }
        if(id){
            let or = searchBody.length > 1 ? `${operator}+` : '';
            searchBody.push(`${or}+id:+"${id}"+`);
        }
        const statusFilter = `(status:+"ready")`;
        if(searchBody.length > 0){
            searchElement.push(`(${searchBody.join(`+${operator}+`)})+AND+${statusFilter}`);
        }else{
            searchElement.push(`${statusFilter}`);
        }
        if(joinTags){
            searchElement.push(`+AND+(${joinTags})`);
        }

        if(sort){
            searchElement.push(`&sort=${sort.attribute}:${sort.dir}`);
        }

        if(!isNaN(page)){
            searchElement.push(`&page=${page}`);
        }

        if(!isNaN(page_length)){
            searchElement.push(`&page_length=${page_length}`);
        }
        const url = searchElement.join("").replace("++", "+");
        //console.log({url});
        return url;
    }

    /**
     * @description Performs a video search for the v2 search functionality
     * @param {string} searchTerm The term to search
     * @param {string[]} tags The different tags to search
     * @param {string} id A possible ID of the video.
     * @param {1|2} eq The comparison method (1 = OR, 2 = AND)
     * @param {{
            dir: 'dsc' | 'asc', //'asc' || 'dsc'
            attribute: "created"
        }} sort The sorting direction
     * @param {number} page The page number
     * @param {number} page_length The length of results for each page
     */
    static async searchVideos(searchTerm = "", tags, id, eq, sort, page = 1, page_length = 10){
        searchTerm = encodeURIComponent(searchTerm);

        let sortSplit = sort ? sort.split(":") : [];
        if(sortSplit.length == 2){
            sort = {
                attribute: sortSplit[0],
                dir: sortDirs[sortSplit[1]] ? sortSplit[1] : "dsc",
            }
        }
        //console.log({tags});

        const queryURL = this.getSeachQuery(searchTerm, tags, id, eq, sort, page, page_length);
        let data, paging;
        try{
            data = (await get(queryURL, {
                headers: {
                    Authorization: process.env.JWPLAYERTOKEN
                }
            })).data;
            paging = {
                page: data.page,
                page_length: data.page_length,
                total: data.total
            }
        }catch(e){
            console.log({e});
        }
        
        //console.log({ data });

        const videos = (await Promise.all(data.media.map(element => {
            return new Promise(async (accept)=>{
                try{
                    let data = await this.getVideo(element.id)
                    accept(data);
                }catch(e){
                    console.log(`Error fetching data for ${element.id}: `+e);
                    console.log({element});
                    accept(null);
                }
            });
        }))).filter(element => !!element);

        return {videos, paging};
    }

    /**
     * @description Converts a string to UTF string
     * @param {string} value The value to convert
     */
    static stringToUTF8(value){
        if(!(typeof value === "string")){
            return value;
        }
        return Buffer.from(value, 'utf-8').toString();
    }

    /**
     * @description Gets the signed payload for a v1 API request.
     * @param {Object} payload The full payload to send. Some parameters will be attached.
     */
    static getV1SignedPayload(payload){
        let autPayload = {
            api_format: "json",
            api_key: process.env.JWPLAYERKEY,
            api_nonce: Math.floor(Math.random() * (1e8 - 1e7) ) + 1e7,
            api_timestamp: Math.floor(new Date().getTime()/1000),
        };
        let secret = process.env.JWPLAYERSECRET;

        /*autPayload = {
            api_format: "xml",
            api_key: "XOqEAfxj",
            api_nonce: 80684843,
            api_timestamp: 1237387851,
        };
        secret = "uA96CFtJa138E2T5GhKfngml";
        */

        let jointPayload = Object.assign(autPayload, payload);
        //console.log({jointPayload});
        let newPayload = {};
        Object.keys(jointPayload).sort().forEach((key)=>{
            newPayload[key] = this.stringToUTF8(jointPayload[key]);
        });
        //console.log({newPayload});
        let payloadString = qs.stringify(newPayload)+secret;
        //console.log({payloadString});
        var shasum = crypto.createHash('sha1');
        shasum.update(payloadString);
        newPayload.api_signature = shasum.digest('hex'); // => "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33"
        return newPayload;
    }

    /**
     * @description Queries a javascript file and gets its parsed schedule id
     * @param {string} playerID The player ID to get the data from
     */
    static async getPlayerScheduleID(playerID){
        let playerURL = `https://cdn.jwplayer.com/libraries/${playerID}.js`;
    
        let {data} = await get(playerURL);
        let match = data.match(/\n(.*)"adscheduleid":\s(|"|\w){1,12}\n/g);
        if(match && match.length == 1){
            return match[0].trim().split(":")[1].replace(/"/g, '').trim();
        }
        return data;
    }

    /**
     * @description Gets the schedule ID to get the data from
     * @param {string} scheduleId The ID for the schedule to get the information from
     */
    static async getSchedule(scheduleId){
        let scheduleURL = `https://cdn.jwplayer.com/v2/advertising/schedules/${scheduleId}.json`;
        try{
            let {data} = await get(scheduleURL);
            return data;
        }catch(e){
            console.log({
                getSchedule_e: e+""
            });
            return null;
        }
    }

    /**
     * @description Gets the player-scrapped schedule data.
     * @param {string} playerID The player ID
     */
    static async getPlayerScheduleData(playerID){
        let scheduleID = await this.getPlayerScheduleID(playerID);
        if(!scheduleID){
            return null;
        }
        let scheduleData = await this.getSchedule(scheduleID);
        return scheduleData;
    }

    /**
     * @description Gets a player configuration via the v1 API
     * @param {string} player_key The key for the player
     */
    static async getPlayerConfig(player_key="vhU0NHpZ"){
        let players;
        //players = await jwApi.players.list();
        let queryPayload = this.getV1SignedPayload({player_key});
        let payload = qs.stringify(queryPayload);
        //let url = `https://api.jwplatform.com/v1/players/list?${payload}`;    //List Players
        let url = `https://api.jwplatform.com/v1/players/show?${payload}`;    //Get Single Player
        let {data} = await get(url);
        players = data;
        return players;
    }

    /**
     * @description Get tags used in the account, along with their details.
     */
    static async getTags(limit){
        let data;
        let siteID = "ltQn70c9";
        //
        try{
            let queryPayload = {
                "order_by": "name:asc",
                "result_limit": limit || 400,
                "result_offset": 0,
                "site_id": "ltQn70c9"
            };
            let url = `https://api.jwplayer.com/botr/sites/${siteID}/accounts/tags/list`;
            data = (await post(url, queryPayload, {
                headers: {
                    Authorization: process.env.JWPLAYERTOKEN,
                    "Content-Type": "application/json"
                }
            })).data;
        }catch(e){
            console.log({
                e: Object.keys(e),
                request: e.toJSON()
            });
            console.log({e: e.response});
        }
        return data;
    }
}