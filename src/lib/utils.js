const { ROUTES } = require("../const");

const {get} = require("axios").default;

module.exports.ServerUtils = class ServerUtils {


    static redirectTo(res, Location =ROUTES.VIDEO, code = 302){
        res.setHeader('Location', Location); // Replace <link> with your url link
        res.statusCode = code;
        res.end();
    }

    /**
     * 
     * @param {number} retryCount The max. ammount of retries.
     * @param {(failedResponse) => boolean} retryCondition The special condition to evaluate the request to.
     * @param {'post'|'get'} requestType The type of request to make.
     * @param {object} options The options object to use with the request.
     * @param {object} body The body to be used for this.
     * @param {number} waitTimeout The waiting timeout after an error has ocurred
     * @param {string} url The requested URL
     */
    static async retryRequest(url, requestType, options, body, retryCount, retryCondition, waitTimeout=1500){

        /**
         * @type {Promise<any>}
         */
        let requestPromise = null;

        if(requestType === 'get'){
            requestPromise = get(url, options);
        }else if(requestType === 'post'){
            requestPromise = post(url, options, body)
        }

        try{
            let result = await requestPromise;
            return result;
        }catch(e){
            //console.log({retryRequest_e: e});
            if(retryCondition(e)){
                retryCount--;
                if(retryCount == 0){
                    console.log(`retryGet failed: retryCounted-out.`);
                    throw e;
                }else{
                    await new Promise((accept)=>{
                        setTimeout(accept, waitTimeout)
                    });
                }
                return this.retryRequest(requestType, options, body, retryCount, retryCondition);
            }else{
                console.log(`retryGet failed. Not mached the retry condition.`);
                throw e;
            }
        }

    }
}