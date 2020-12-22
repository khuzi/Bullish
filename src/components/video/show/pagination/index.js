import { Utils } from '@components/common/util';
import Router from 'next/router';
import React from 'react';
import { isEmpty } from 'lodash';
import { ROUTES } from 'src/const';

export class Pagination extends React.Component {
    state = {}

    constructor(props){
        super(props);
        this.goNext = this.goNext.bind(this);
        this.goPrev = this.goPrev.bind(this);
    }

    componentDidMount(){
        this.setPaging(this.props.paging);
    }

    setPaging(paging){
        let {page, page_length, total} = paging;
        let pagesAmmount = Math.ceil(total/page_length);
        this.setState({
            page, pagesAmmount, paging
        })
    }

    goToPage(page){
      const query= isEmpty(this.props.query.search) ? "" : this.props.query.search;

      Router.push(`${ROUTES.VIDEO_PARTICULAR}?search=${query}&page=${page}`);
    }

    componentDidUpdate(){
        if(JSON.stringify(this.state.paging) !== JSON.stringify(this.props.paging)){
            this.setPaging(this.props.paging);
            window.document.scrollingElement.scroll(0,0);
        }
    }

    goNext(){
        if(!this.isLast){
            this.goToPage(this.state.page + 1);
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

    render(){

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