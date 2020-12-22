module.exports.ROUTES = {
    HOME: "/home",
    TWEET: "/stock",    // /tweet
    TWEET_WEEKLY: "/tweet_weekly",
    TWEET_DAILY: "/tweet_daily",
    LOGIN: "/login",
    MARKET: "/market",
    MARKET_GRAPH: "/marketGraph",
    TICKER_PAGE: "/stock/*",

    DEFAULT: "/market",
    SERIES: "/series",
    VIDEO: "/videos",
    VIDEO_PARTICULAR: "/videos/:video-slug",
    SERIES_PARTICULAR: "/series/:serie-slug",
    ARTICLE: "/articles",
    ARTICLE_PARTICULAR: "/articles/:article-slug",
    STOCK: "/stocks",
    STOCK_PARTICULAR: "/stocks/:stock_ticker",

    SIGNUP_NEWSLETTER_API: "/api/sign-up-newsletter",


    VIDEO_SEARCH_API: "/api/videos",
    ARTICLE_SEARCH_API: "/api/articles"
}

module.exports.SORT_DIR = {
    ASCENDENT: 'asc',
    DESCENDENT: 'des',
    NONE: 'none'
}

module.exports.SORT_MICONS = {
    ASCENDENT: 'expand_less',
    DESCENDENT: 'expand_more',
    NONE: 'expand_less'
}

module.exports.PAGINATION_TYPE = {
    PAGINATION: 1,
    LAZY: 2
}

module.exports.PAGING_NUMBER_OF_SHOWS = 10;