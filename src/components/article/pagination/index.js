import { ArticleDataFetcher } from "@components/common/ArticleDataFetcher";
import { LoadingManager } from "@components/common/loadingManager";
import { Utils } from "@components/common/util";
import { Pagination } from "@components/video/pagination";
import { Router } from "next/router";
import { PAGINATION_TYPE } from "src/const";

export class ArticlePagination extends Pagination {

    constructor(props){
        super(props);
        console.log({ArticlePagination_props: props});
    }

    async goToPage(page){
        console.log({ goToPage_page: page });
        let newUrl = Utils.asembleRelativeSearchURL(Router, null, null, null, page);
        switch(this.props.type || PAGINATION_TYPE.PAGINATION){
            case PAGINATION_TYPE.LAZY:
                let query = newUrl.split("?")[1];
                console.log({query});
                this.setState({
                    loading: true
                });
                LoadingManager.showLoading();
                try{
                    let new_items = await ArticleDataFetcher.searchEndpoint(query);
                    console.log({new_items});
                    this.props.load_listener(new_items.searchResults);
                    this.setPaging(new_items.resultingPaging);
                }catch(e){
                    console.log({e});
                }
                this.setState({
                    loading: false
                })
                setTimeout(()=>{
                    LoadingManager.hideLoading();
                }, 1000);
            break;
            case PAGINATION_TYPE.PAGINATION:
                Router.push(newUrl);
            break;
        }
    }
}