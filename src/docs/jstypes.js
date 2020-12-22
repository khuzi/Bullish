/**
 * @typedef {{
    "file": string,
    "kind": string
}} JWPlayerTrack The track object gotten for a video
*/
module.exports.JWPlayerTrack = {};

/**
*  @typedef {{

}} JWPlayerVariation A video file variation
*/
module.exports.JWPlayerVariation = {};

/**
* @typedef {{
    "file": string,
    "type": string,
    "height": number | undefined,
    "width": number | undefined,
    "label": string | undefined
}} JWPlayerResource A playable resource gotten from a video
*/
module.exports.JWPlayerResource = {};

/**
* @typedef {{
    src: string,
    width: number,
    type: string
}} JWPlayerImage The JWPlayer image gotten for the video
*/
module.exports.JWPlayerImage = {};

/**
* @typedef {{
    title: string
    mediaid: string
    link: string
    image: string
    images: JWPlayerImage[]
    duration: number
    pubdate: number
    description: number
    tags: string
    sources: JWPlayerResource[]
    tracks: JWPlayerTrack[]
    variations: JWPlayerVariation
}} JWPVideo The video object from JWPlayer
*/
module.exports.JWPVideo = {};

/**
 * @typedef {{
 *  page: number
    page_length: number
    total: number
 * }} VideoPagingResult
 */
module.exports.VideoPagingResult = {};




/**
 * @typedef {{
 *  title: string,
    description: string,
    kind: string,
    feedid: string,
    links: {
        first: string,
        last: string,
        next: string
    },
    playlist: JWPVideo[],
    feed_instance_id: string
 * }} JWPPlaylistResult
*/
module.exports.JWPPlaylistResult = {};






/**
 * @typedef {{
    "id": number,
    "name": string,
    "description": string,
    "poster_image_url": string,
    "profile_picture_url": string,
    "meta": {
        "show_dedicated_tag": string[],
        "portrait_image": string,
        "social": {
            "twitter": string[],
            "instagram": string[],
            "tiktok": string[],
            "facebook": string[],
            "youtube": string[]
        }
    },
    "created_at": string,
    "updated_at": string,
    "showId": string
}}  ShowRecord
*/
module.exports.ShowRecord = {};