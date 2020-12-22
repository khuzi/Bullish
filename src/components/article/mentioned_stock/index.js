import StockWidget from '@components/stock_widget';
import React from 'react';

export class MentionedStockInArticle extends React.Component {

    state = {
        showMore: false
    }


    render(){
        const { showMore } = this.state;
        const { tweetTickers } = this.props;
        const max = 4;

        const toggleShowMore = () => {
            this.setState({showMore: !showMore});
        };

        const stockWidgets = {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            fontFamily: "'Open Sans', sans-serif"
        }

        return (
            <div className="mentioned-stock-in-article">
                <div style={stockWidgets}>
                    { this.props.tweetTickers.length ?
                        <h4 style={{fontFamily: "'Open Sans', sans-serif"}} >Stocks mentioned in this video</h4>
                        : ""
                    }
                    {
                        tweetTickers.map((ticker, index) =>
                            <StockWidget
                                tag={ticker} 
                                key={ticker.ticker}
                                className={(index > (max - 1) && !showMore) ? 'hidden' : ''}
                            />
                        )
                    }
                </div>
                {
                    Array.isArray(tweetTickers) && tweetTickers.length > max ? 
                    <h6 onClick={toggleShowMore} className="show-more">{showMore ? "Show less" : "Show more"}</h6> : <></>
                }
                
            </div>
        );
    }
}