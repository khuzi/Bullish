/**
 * @typedef {{
 *  email: string
 * }} NewsletterData The data to execute a subscription
 */

/**
 * @typedef {{
    stored: boolean,
    reason: string,
    data: object
 * }} SignUpResult The result for the data
 */

const QueryString = require("qs");
const { SyntaxValidationManager } = require("./syntaxValidatorManager");
const { WriterAuthManager } = require("./writerAuthManager");

module.exports.NewsletterManager = class NewsletterManager {

    /**
     * @description Subscribes to the newsletter manager
     * @param {NewsletterData} data The data to use for the subscription proceedure
     * @returns {Promise<SignUpResult>} The sign up result
     */
    static async subscribe(data){
        let result = {
            stored: false,
            reason: "WIP",
            data: {},
            status_code: 400
        }
        if(!SyntaxValidationManager.validEmail(data.email)){
            result.stored = false;
            result.reason = "Invalid Email Provided";
            result.status_code = 400;
            return result;
        }

        let checkQs = QueryString.stringify({
            email: data.email.toLowerCase()
        });
        let checkUrl = `${process.env.STRAPI_ENDPOINT}/newsletter-registereds/count?${checkQs}`;
        let exists = false;
        try{
            let {data} = await WriterAuthManager.authGet(checkUrl);
            exists = (data > 0);
        }catch(e){
            console.log({e});
            result.stored = false;
            result.reason = "Internal Error (#1)";
            result.status_code = 500;
            return result;
        }
        if(exists){
            result.stored = false;
            result.reason = "Email Already Exists";
            result.status_code = 409;
            return result;
        }
        try{
            let createUrl = `${process.env.STRAPI_ENDPOINT}/newsletter-registereds`;
            let storeResult = (await WriterAuthManager.post(createUrl, {
                email: data.email.toLowerCase()
            })).data;
            result.stored = true;
            result.reason = "Success";
            result.data = storeResult || null;
            result.status_code = 200;
            return result;
        }catch(e){
            result.stored = true;
            result.reason = "Internal error (#2)";
            result.data = {};
            result.status_code = 500;
            return result;
        }
    }
}