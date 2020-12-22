import React from 'react';
import TableDaily from './table_daily';
import TableWeekly from './table_weekly';

export default class TablesComponent extends React.Component {

    state = {
        current: 1
    }

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(wichOne = 1){
        this.setState({
            current: wichOne
        })
    }

    render(){

        const {current} = this.state;
        const class1 = (current == 1) ? "show" : "hidden";
        const class2 = (current == 2) ? "show" : "hidden";

        const tabClass1 = (current == 1) ? "active" : "";
        const tabClass2 = (current == 2) ? "active" : "";

        return (
            <div className="mdl-tabs mdl-js-tabs table-components">
                
               <div className="mdl-tabs__tab-bar">
                  <span className={`mdl-tabs__tab ${tabClass1}`} onClick={()=>this.handleChange(1)}>Daily Stock Occurrences Ranked</span>
                  <span className={`mdl-tabs__tab ${tabClass2}`} onClick={()=>this.handleChange(2)}>Weekly Stock Occurrences Ranked</span>
               </div>

               <div className={`mdl-tabs__panel ${class1}`}>
                    <TableDaily API_ENDPOINT={this.props.API_ENDPOINT} />
               </div>

               <div className={`mdl-tabs__panel ${class2}`}>
                    <TableWeekly API_ENDPOINT={this.props.API_ENDPOINT} />
               </div>
            </div>
        );
    }
}