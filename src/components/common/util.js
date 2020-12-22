const {ROUTES} = require("../../../src/const");

const {post} = require("axios").default;
const moment = require("moment");
const marked = require("marked");
const qs = require("qs");
const QUERY_DATE_FORMAT = "YYYY-MM-DD";
const { htmlToText } = require('html-to-text');

module.exports.Utils = class Utils {

    static WaitForCondition(conditionFunction, intervalMs){
        return new Promise((accept)=>{
            const interval = setInterval(()=>{
                if(conditionFunction()){
                    clearInterval(interval);
                    accept();
                }
            }, intervalMs || 100);
        });
    }

    static async fetchDailyOccurences(day){
        //
        const data = (await post("http://52.86.239.14:8000/daily_occurences", {
            day: day
        })).data;
        //console.log({ currentDate: data });

        ///*
        const weekAgoData = (await post("http://52.86.239.14:8000/daily_occurences", {
            day: moment(day).subtract(7, 'day').format(QUERY_DATE_FORMAT)
        })).data;
        
        //We turn it into a dictionary for faster search
        const weekAgoDataDictionary = {};
        weekAgoData.forEach(element => {
            weekAgoDataDictionary[element[0]] = element;
        });
        
        return data
        .map(element => {
            let change;
            if(weekAgoDataDictionary[element[0]]){
                const lastWeekCount = weekAgoDataDictionary[element[0]][2];
                const currentWeekCount = element[2];
                change = ((currentWeekCount - lastWeekCount)/(lastWeekCount))*100;
            }else{
                change = "N/A"
            }
            element.push(change);
            return element;
        });
        //*/
    }

    static getDuration(duration){
        let minutes = Math.floor(duration/60);
        let seconds = duration%60;
        if(minutes < 10){
            minutes = `0${minutes}`
        }
        if(seconds<10){
            seconds = `0${seconds}`
        }
        return `${minutes}:${seconds}`
    }

    /**
     * @param {number} millis The milliseconds of the date to compare
     */
    static getTimeSince(millis){
        return moment(millis).fromNow();
    }

    /**
     * @param {string} text Gets an HTML version for the text with marked
     */
    static toHTML(text){
        return marked(text);
    }

    /**
     * 
     * @param {sting} text The HTML text to be transformed to plain text
     */
    static fromHTML(text){
        return htmlToText(text);
    }

    /**
     * 
     * @param {{ 
            "file": string,
            "type": string,
            "height": number,
            "width": number,
            "label": string
        }[]} videos 
     */
    static getProperVideSource(videos) {
        let returnVideoSource = null;
        if (window.innerWidth <= 320 && videos.find(element => (element.width <= 320))) {
            returnVideoSource = videos.find(element => (element.width <= 320));
        } else if (window.innerWidth <= 480 && videos.find(element => (element.width <= 480))) {
            returnVideoSource = videos.find(element => (element.width <= 480));
        } else if (window.innerWidth <= 640 && videos.find(element => (element.width <= 640))) {
            returnVideoSource = videos.find(element => (element.width <= 640));
        } else if (window.innerWidth <= 720 && videos.find(element => (element.width <= 720))) {
            returnVideoSource = videos.find(element => (element.width <= 720));
        } else {
            returnVideoSource = videos[videos.length - 1];
        }
        return returnVideoSource;
    }


    /**
     * 
     * @param {{ 
            "src": string,
            "width": number,
            "type": string
        }[]} images
        */
    static getProperImage(images) {
        let returnImage = null;
        if (window.innerWidth <= 320 && images.find(element => (element.width <= 320))) {
            returnImage = images.find(element => element.width == 320);
        } else if (window.innerWidth <= 480 && images.find(element => (element.width <= 480))) {
            returnImage = images.find(element => (element.width <= 480));
        } else if (window.innerWidth <= 640 && images.find(element => (element.width <= 640))) {
            returnImage = images.find(element => (element.width <= 640));
        } else if (window.innerWidth <= 720 && images.find(element => (element.width <= 720))) {
            returnImage = images.find(element => (element.width <= 720));
        }
        returnImage = images[images.length - 1];
        return returnImage;
    }

    static getSingleVideoDate(date){
        return moment(date).format("MMM DD, YYYY");
    }

    static assembleRouterSearchPayload(Router, newQuery, newTags, newSort, newPaging){
        let tags, query, sort, paging;

        let parametersString = window.location.href.split("?")[1];
        let parameters = {};
        if(parametersString){
            parameters = qs.parse(parametersString)
        }

        if(newTags){
            tags = newTags;
        }else{
            tags = this.parseTags(parameters.tags || []);
        }

        if(newQuery){
            query = newQuery;
        }else{
            query = parameters.q || null;
        }

        if(newPaging){
            paging = newPaging;
        }else{
            paging = parameters.paging || null;
        }

        if(newSort){
            sort = newSort;
        }else{
            sort = parameters.sort || null;
        }

        return {query, tags, sort, paging};
    }

    static assembleRouterSearchURL(Router, newQuery, newTags, newSort, newPaging){
        let {tags, query, sort, paging} = this.assembleRouterSearchPayload(Router, newQuery, newTags, newSort, newPaging);
        let url = this.getVideoSearchUrl(query, tags, sort, paging);
        return url;
    }

    static asembleRelativeSearchURL(Router, newQuery, newTags, newSort, newPaging){
        let {tags, query, sort, paging} = this.assembleRouterSearchPayload(Router, newQuery, newTags, newSort, newPaging);
        let url = this.getRealtiveSearchUrl(query, tags, sort, paging);
        return url;
    }

    static getSortObject(Router){
        let {sort} = Router.query;
        const allowedSort = {
            "asc": 1, "dsc": 1
        }
        let resultingSort = null;
        if(sort && Array.isArray(sort.split(":"))){
            if(sort.split(":").length == 2){
                resultingSort = {
                    attribute:sort.split(":")[0],
                    dir: allowedSort[sort.split(":")[1]] ? sort.split(":")[1] : 'dsc'
                }
            }
        }
        return resultingSort;
    }

    static getSearchQuery(queryStr, tags, sort, paging){
        let arrayTags = [];
        if(tags){
            if(Array.isArray(tags)){
                arrayTags = arrayTags.concat(tags);
            }else{
                arrayTags.push(tags);
            }
        }
        let payload = {};
        if(queryStr){
            payload.q = queryStr;
        }
        if(tags && tags.length > 0){
            payload.tags = JSON.stringify(arrayTags);
        }
        if(sort){
            payload.sort = sort;
        }
        if(paging){
            payload.paging = paging;
        }
        let query = qs.stringify(payload);
        return query;
    }

    static getVideoSearchUrl(queryStr, tags, sort, paging){
        let query = this.getSearchQuery(queryStr, tags, sort, paging)
        return `${ROUTES.VIDEO}/search?${query}`;
    }

    static getRealtiveSearchUrl(queryStr, tags, sort, paging){
        let query = this.getSearchQuery(queryStr, tags, sort, paging);
        let currentURL = [
            window.location.origin,
            window.location.pathname,
        ].join("");
        return `${currentURL}?${query}`;
    }

    static getVideoViewUrl(videoID){
        return `${ROUTES.VIDEO}/${videoID}`;
    }

    static parseTags(tagsString, Router){
        if(Router){
            //Get from router
            tagsString = Router.query.tags;
        }
        let tags = [];
        try{
            let newTags = JSON.parse(tagsString);
            if(Array.isArray(newTags)){
                tags = newTags;
            }
        }catch(e){
            tags = [];
        }
        return tags;
    }

    /**
     * @description Calls the API for registering an email for the newsletter
     * @param {string} email The email to sign-up
     * @param {object} additionalOptions The additional options for the email sign-up
     */
    static async signUpNewsletterEmail(email, additionalOptions = {}){
        let response = {
            ok: false,
            reason: 'failed'
        }
        try{
            let result = await post(ROUTES.SIGNUP_NEWSLETTER_API, {
                email,
                ...additionalOptions
            });
            switch(result.status){
                case 200:
                    response.ok = true;
                    response.reason = "success";
                break;
                case 409:
                    response.reason = "existing"
                break;
                default:
                    response.reason = "unknown"
                break;
            }
        }catch(e){
            switch(e ? e.response.status : 9){
                case 200:
                    response.ok = true;
                    response.reason = "success";
                break;
                case 409:
                    response.reason = "existing"
                break;
                default:
                    response.reason = "unknown"
                break;
            }
        }

        return response;
    }

}