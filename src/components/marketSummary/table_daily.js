import React, { Component} from "react";
import axios from "axios";
import { Styles, Table } from "../common/table_def";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import log from "../common/logger"
import Formatter from "../common/formatter";
import { CountFilter } from "./countFilter";
import numeral from 'numeral';
import { Utils } from "../common/util";
//import { useRouter } from 'next/router'
import Router from 'next/router';


class TableDaily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {
          Header: "Rank",
          accessor: "rank",
        },
        {
          Header: "Ticker",
          accessor: "ticker",
        },
        {
          Header: "Count",
          accessor: "count",
        },
        {
          Header: "% Change",
          accessor: "daily_percent_change",
        },
        {
          Header: "7-day Average",
          accessor: "seven_day_avg",
        },{
          Header: '% Change over 7 day period',
          accessor: "seven_day_change_percentage"
        }
      ],
      date: "",
      dates: [],
      date_map: [],
      filters: {
        "count": 0
      },
      sort: {rank: 'asc', "count":"none", "daily_percent_change":"none", "seven_day_avg": "none", "seven_day_change_percentage":"none"}
    };
    this.onCellClicked = this.onCellClicked.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.onSortRequested = this.onSortRequested.bind(this);
  }
  componentDidMount = () => {
    axios
      .get(this.props.API_ENDPOINT + "/daily_occurence_days")
      .then((response) => {
        var dates = [];
        for (var i = 0; i < response.data.length; ++i) {
          //dates.push(new Date(response.data[i]));
          dates.push(new Date(response.data[i][0].replace(" GMT", "")));
        }
        this.setState({
          dates: dates,
          date: dates[0],
          date_map: response.data,
        });
        this.onChangeDate(dates[0])
      })
      .catch((err) => {
        log(err);
      });
  };
  onChangeDate(date) {
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    var reqDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1) +
      "-" +
      date.getDate();

    Utils.fetchDailyOccurences(reqDate)
    .then((response) => {
      var data = [];
      for (var i = 0; i < response.length; ++i) {
        log(response[i][1]);
        //HERE
        data.push({
          ticker: response[i][0],
            count: response[i][2]//numeral(response[i][2]).format("0,0"),
            ,rank: (i + 1)
            ,daily_percent_change: numeral(response[i][4]).format("0,0")+"%"//numeral(response[i][4]).format("0,0")+"%",
            ,seven_day_avg: numeral(response[i][5]).format("0,0")//numeral(response[i][5]).format("0,0"),
            ,seven_day_change_percentage: numeral(response[i][6]).format("0,0")+"%"
        });
      }
      //console.log({data});
      this.setState({ data: data });
    })
    .catch((err) => {
      log(err);
    });
  }

  setStartDate(date) {
    this.setState({ date: date });
    this.onChangeDate(date);
  }

  picker() {
    return (
      <DatePicker
        selected={this.state.date}
        onChange={(date) => this.setStartDate(date)}
        includeDates={this.state.dates}
        placeholderText="This only includes todate and tomorrow"
      />
    );
  }

  handleFilterChange(newValue){
    let newVal = newValue;
    newVal = parseInt(newVal);
    this.setState((state)=>{
      state.filters['count'] = newVal == 0 ? "" : newVal;
      return state;
    });
  }

  onCellClicked({columnId, value}){
    try{
      if(columnId === "ticker" && value){
        //this.props.history.push(Formatter.getStockDeepLink(value));
        //const router = useRouter();
        Router.push(Formatter.getStockDeepLink(value));
      }
    }catch(e){
      console.error({"table_daily.onCellClicked":e});
    }
  }

  onSortRequested(columnKey){
    this.setState({
      sort: Formatter.updateSortObject(columnKey, this.state.sort)
    })
  }

  returnTable() {
    return (
      <Styles>
        <Table columns={this.state.columns} onSortRequested={this.onSortRequested} sort={this.state.sort} 
        data={Formatter.sort(Formatter.filterDaily(this.state.data, this.state.filters['count'] || 0), this.state.sort)}
        onCellClicked={this.onCellClicked} />
      </Styles>
    );
  }

  render() {
    return (
      <div>
        <div className="daily_filters">
          {this.picker()}
          <CountFilter
            value={this.state.filters['count']}
            placeholder="Min. count"
            onChange={this.handleFilterChange}
          />
        </div>
        {this.returnTable()}
      </div>
    );
  }
}
export default TableDaily;
