const axios = require("axios").default;

module.exports.AuthManager = class AuthManager {
    userData = null;

    static async signIn(){
        const { data } = await axios.post(`${process.env.STRAPI_ENDPOINT}/auth/local`, {
            identifier: process.env.STRAPI_READER_EMAIL,
            password: process.env.STRAPI_READER_PASSWORD,
        });
        this.userData = data;
    }

    static async getCredentials(){
        if(!this.userData){
            await this.signIn();
        }
        return this.userData;
    }

    static async getJWT(){
        const {jwt} = this.getCredentials();
        return jwt;
    }

    static getAuthOptions(){
        return {
            headers: {
                "Authorization": `Bearer ${this.userData.jwt}`
            }
        }
    }

    /**
     * @description Helper for authenticated get call.
     */
    static async authGet(url, options = {}){
        await this.getCredentials();
        return await axios.get(url, Object.assign(options, this.getAuthOptions()));
    }
}