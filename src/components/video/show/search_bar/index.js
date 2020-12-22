

import React from 'react';
import { Utils } from "@components/common/util";
import Router from "next/router";
import { set } from 'numeral';
import { ROUTES } from 'src/const';
const {get} = require("axios").default;

export class ShowSearchBar extends React.Component {
    state = {
        query: null
    }

    constructor(props){
        super(props);
        this.inputChanged = this.inputChanged.bind(this);
        this.search = this.search.bind(this);
    }

    inputChanged(event){
        const {target} = event;
        const {name, value} = target;
        this.setState({
            [name]: value
        })
    }

    search(ev){
        if(ev){
            ev.preventDefault();
        }

        if(!this.state.query){
            Router.push(`${ROUTES.SERIES}`);
        }else{
            Router.push(`${ROUTES.SERIES}?search=${this.state.query}`);
        }
    }

    render(){
        return (
            <form onSubmit={this.search} className={`${this.props.formClass || ''}`}>
                <div className="input-group">
                    <input type="text" className={`form-control ${this.props.className || ''}`}
                        name="query"
                        onChange={this.inputChanged}
                        placeholder={this.props.placeholder || "Search for..."} />
                    <div className="input-group-append">
                        <button type="button" className="btn btn-dark" onClick={()=>{ this.search(); }}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}