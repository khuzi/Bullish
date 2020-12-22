const {post} = require("axios").default;

const { AuthManager } = require("./authManager");

const axios = require("axios").default;

module.exports.WriterAuthManager = class WriterAuthManager extends AuthManager {
    userData = null;

    static async signIn(){
        const { data } = await axios.post(`${process.env.STRAPI_ENDPOINT}/auth/local`, {
            identifier: process.env.STRAPI_EDITOR_EMAIL,
            password: process.env.STRAPI_EDITOR_PASSW,
        });
        this.userData = data;
    }
    
    static async post(url, body, options={}){
        await this.getCredentials();
        return await axios.post(url, body, Object.assign(options, this.getAuthOptions()));
    }
}