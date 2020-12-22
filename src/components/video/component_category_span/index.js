import React from 'react';
import { Utils } from '@components/common/util';
import Link from 'next/link';
import Router from 'next/router';

export default class CategoryComponent extends React.Component{

    getSearchCategoryRoute(element){
        if(!process.browser){
            return "";
        }
        let tags = Utils.parseTags(null, Router);
        tags = [...new Set([...tags, element])] //We remove repeated tags if existing
        let url = Utils.assembleRouterSearchURL(Router, null, tags, null, 1);
        return url;
    }

    render(){
        const {element} = this.props;

        return (
            <span>
                <Link href={this.getSearchCategoryRoute(element)}>{element}</Link>
                {
                    this.props.removeCategory ?
                    <span className="badge badge-secondary" onClick={()=>{this.props.removeCategory(element)}}>X</span> : <></>
                }
            </span>
        )
    }
}