import React from 'react';
import Footer from '../footer';
import MarketGraph from './marketGraph';
import MDLiteLayout from '../layout/mdlite';
import MDLTabs from '../tabs';
import TablesComponent from './tablesComponent';

class Market extends React.Component {
    render(){
        return(
            <MDLiteLayout className="market">
                <MDLTabs active="market"/>
                <div className="content-grid mdl-grid">
                    <div className="mdl-cell mdl-cell--12-col market-graph-container">
                        <div id='m-graph-cont'>
                            <div>
                                <h1>Daily Tweets Collected</h1>
                            </div>
                            <div id='m-graph'>
                                <MarketGraph API_ENDPOINT={this.props.API_ENDPOINT}/>
                            </div>
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-phone">
                    </div>
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-phone stock-table-container">
                        <TablesComponent API_ENDPOINT={this.props.API_ENDPOINT}/>
                    </div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-phone">
                    </div>
                </div>
                <Footer />
            </MDLiteLayout>
        )
    }
}
export default Market;