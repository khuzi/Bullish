import { LoadingManager } from '@components/common/loadingManager';
import { Utils } from '@components/common/util';
import { VideoDataFetcher } from '@components/common/VideoDataFetcher';
import Router from 'next/router';
import React from 'react';
import { PAGINATION_TYPE } from 'src/const';


export class Pagination extends React.Component {
    state = {
        loading: false
    }

    constructor(props){
        super(props);
        this.goNext = this.goNext.bind(this);
        this.goPrev = this.goPrev.bind(this);

        //this.props.video_template     //The reference to comunicate the video load events
        //this.props.video_template.onNewVideosLoaded()
    }

    componentDidMount(){
        this.setPaging(this.props.paging);
    }

    setPaging(paging){
        console.log("setPaging");
        let {page, page_length, total} = paging;
        let pagesAmmount = Math.ceil(total/page_length);
        console.log({ page, page_length, total, pagesAmmount });
        this.setState({
            page, pagesAmmount, paging
        })
    }

    async goToPage(page){
        console.log("goToPage");
        console.log({ goToPage_page: page });
        let newUrl = Utils.asembleRelativeSearchURL(Router, null, null, null, page);
        switch(this.props.type || PAGINATION_TYPE.PAGINATION){
            case PAGINATION_TYPE.LAZY:
                if(this.props.showData){    //Is a show page search
                    newUrl = Utils.asembleRelativeSearchURL(Router, null, [
                        this.props.showData.meta['show_dedicated_tag']
                    ], null, page);
                }
                let query = newUrl.split("?")[1];
                this.setState({
                    loading: true
                });
                LoadingManager.showLoading();
                try{
                    let newVideos = await VideoDataFetcher.searchEndpoint(query);
                    this.props.video_load_listener(newVideos.searchResults);
                    this.setPaging(newVideos.resultingPaging);
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

    componentDidUpdate(){
        if(JSON.stringify(this.state.paging) !== JSON.stringify(this.props.paging)){
            switch(this.props.type || PAGINATION_TYPE.PAGINATION){
                case PAGINATION_TYPE.PAGINATION:
                    this.setPaging(this.props.paging);
                    window.document.scrollingElement.scroll(0,0);
                break;
            }
        }
    }

    goNext(){
        if(!this.isLast){
            let next = this.state.page+1;
            console.log({page:this.state.page, next});
            this.goToPage(next);
        }
    }

    goPrev(){
        if(!this.isFirst){
            this.goToPage(this.state.page - 1);
        }
    }

    get items(){
        if(!process.browser){
            return [];
        }

        if(!this.state.page){
            return [];
        }
        let elements = [];
        for(let i = 1; (i <= this.state.pagesAmmount); i++){
            elements.push(
                <li onClick={()=>{
                    this.goToPage(i)
                }} className={`page-item ${this.state.page === i ? 'active disabled' : ''}`} key={i}>
                    <a className="page-link">{i}</a>
                </li>
            );
        }
        return elements;
    }

    get isFirst(){
        if(!process.browser){
            return false;
        }
        if(!this.state.page){
            return false;
        }
        if(this.state.page === 1){
            return true;
        }
    }

    get isLast(){
        if(!process.browser){
            return false;
        }
        if(!this.state.page){
            return false;
        }
        if(this.state.page === this.state.pagesAmmount){
            return true;
        }
    }

    get hasPages(){
        return this.state.pagesAmmount && (this.state.pagesAmmount > 0);
    }

    get reachedEnd(){

    }

    render(){
        switch(this.props.type || PAGINATION_TYPE.PAGINATION){
            case PAGINATION_TYPE.LAZY:
                return (
                    <nav
                    onClick={this.goNext}
                    aria-label="Page navigation example"
                    className="lazy-pagination">
                        <button className="btn btn-dark btn-full" disabled={this.state.loading || this.isLast}>More</button>
                    </nav>
                );
            case PAGINATION_TYPE.PAGINATION:
                return (
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center pagination-sm mb-0">
                            <li className={`page-item ${(this.isFirst || !this.hasPages) ? 'disabled' : ''}`} onClick={this.goPrev}>
                                <a tabIndex="-1" className="page-link">Previous</a>
                            </li>
                            {
                                this.items
                            }
                            <li className={`page-item ${(this.isLast || !this.hasPages) ? 'disabled' : ''}`} onClick={this.goNext}>
                                <a className="page-link">Next</a>
                            </li>
                        </ul>
                    </nav>
                );
        }

        
    }
}