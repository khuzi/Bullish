import React from 'react';
import { SearchBar } from '../search_bar';

export class TopMobileSearch extends React.Component {

    render(){
        return (
            <div className="top-mobile-search">
                <div className="row">
                    <div className="col-md-12">
                        <SearchBar formClass={"mobile-search"}/>
                    </div>
                </div>
            </div>
        )
    }
}