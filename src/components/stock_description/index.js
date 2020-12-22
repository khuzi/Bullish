import React, { Component } from "react";
import { StockDataFetcher } from '@components/common/StockDataFetcher';
const marked = require("marked");


export class StockDescription extends Component {

    state = {
        description: "<p>Loading...</p>",
        loading: null,
        current: null
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.stockDataFetcher = new StockDataFetcher(this.props.STOCK_ENDPOINTS);
    }

    componentDidUpdate(){
        if(this.props.ticker && (this.props.ticker !== this.state.current)){
            if(!this.state.loading){
                this.loadDescription();
            }
        }
    }

    loadDescription(){
        this.setState({
            loading: true
        });
        console.log("Loading description...");
        this.stockDataFetcher.getStockDescription(this.props.ticker)
        .then(element => {
            console.log("Description loaded correctly...",{element});
            this.setState({
                loading: false,
                current: this.props.ticker,
                description: marked(element.description)
            })
        })
        .catch(e => {
            console.log("Description loaded Incorrectly...",{e});
            this.setState({
                loading: false,
                current: this.props.ticker,
                description: "<p>No description found...</p>"
            })
        });
    }

    render(){
        return (
            <>
                {
                    this.state.description ? 
                        <div className="demo-card-wide mdl-card mdl-shadow--2dp">
                            <div className="mdl-card__supporting-text" dangerouslySetInnerHTML={{__html:this.state.description}}>
                            </div>
                        </div>
                         : <></>
                }
                
            </>
        )
    }
}