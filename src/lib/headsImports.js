export class HeadsImport {

    static get pageImports(){
        return {
            css: {
                "index": [...this.mdlImports, ...this.marketCSS, ...this.globalCustomCSS],
                "market": [...this.mdlImports, ...this.marketCSS, ...this.globalCustomCSS],
                "stock": [...this.mdlImports, ...this.sliderCSS, ...this.globalCustomCSS],
                "stock_new": [...this.articleCss, "/styles/charts.css", "/styles/influencerTweet/index.css"],
                "article_main": [...this.articleCss],
                "article_particular": [...this.articleCss],
                "video_index": [...this.videoCSS],
                "video_show": [...this.showCSS]
            }
        }
    }

    static get mdlImports(){
        return [
            "/styles/mdl-layout/dist/css/application.min.css",
            "/styles/mdl-refatoring.css",
            "/styles/bootstrap.grids.min.css"
        ];
    }

    static get globalCustomCSS(){
        return [
            "/styles/globals.css",
            "/styles/App.css",
            "/styles/charts.css"
        ]
    }

    static get marketCSS(){
        return [
            "/styles/components/marketSummary/countFilter.css",
            "/styles/components/marketSummary/market.css",
            "/styles/components/marketSummary/tablesComponent.css",
            "/styles/components/marketSummary/countFilter.css",
        ]
    }

    static get sliderCSS(){
        return [
            "/styles/components/range_slider/index.css"
        ]
    }

    static get articleCss(){
        return [
            "/vidoe_template/vendor/bootstrap/css/bootstrap.min.css",
            "/vidoe_template/vendor/fontawesome-free/css/all.min.css",
            "/vidoe_template/css/osahan_dark.css",
            "/vidoe_template/css/no-sidebar.css",
            "/vidoe_template/vendor/owl-carousel/owl.carousel.css",
            "/vidoe_template/vendor/owl-carousel/owl.theme.css",
            "/styles/components/article/article.css",
            "/styles/components/shows/shows.css",
            "/styles/components/shows/show-card.css"
        ]
    }

    static get videoCSS(){
        return [
            "/vidoe_template/vendor/bootstrap/css/bootstrap.min.css",
            "/vidoe_template/vendor/fontawesome-free/css/all.min.css",
            "/vidoe_template/css/osahan_dark.css",
            "/vidoe_template/css/no-sidebar.css",
            "/vidoe_template/vendor/owl-carousel/owl.carousel.css",
            "/vidoe_template/vendor/owl-carousel/owl.theme.css",
            "/styles/components/shows/shows.css",
            "/styles/components/shows/show-card.css"
        ]
    }

    static get showCSS(){
        return [
            "/styles/components/shows/shows.css",
            "/styles/components/shows/show-card.css"
        ]
    }

    static get stockCSS(){
        return [
            "/styles/components/stockPage/stockPage.css",
        ]
    }

}