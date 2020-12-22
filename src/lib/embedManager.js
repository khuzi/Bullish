

module.exports.EmbedManager = class EmbedManager {
    static async getVideoPlayerEmbed(query, base){

        const {container_id, partnerID, testing, fit_content} = query, enable = process.env.ENABLE_PLAYER_JS_EMBED || 0;
        let embedURL = process.env.PLAYER_EMBED_URL || "";
        if(!container_id || !partnerID || !embedURL){
            return base;
        }
        
        embedURL = embedURL.replace(":partnerID", partnerID);
        
        base = base
            .replace("${__CONTAINER__}", container_id.replace(/'/g, ''))
            .replace("${__URL__}", embedURL)
            .replace("${__ENABLE__}", enable)
            .replace("${__TESTING__}", testing || 0)
            .replace("${__FIT_CONTENT__}", fit_content || 0);
        return base;
    }

}