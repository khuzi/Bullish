import React, { Component } from "react";
import axios from "axios";
import DropdownList from "react-widgets/lib/DropdownList";
import { Styles, Table } from "../common/table_def";
import log from "../common/logger";
import Formatter from "../common/formatter";
import { CountFilter } from "./countFilter";
import Router from 'next/router';
import moment from 'moment-timezone';

class TableWeekly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {
          Header: 'Rank',
          accessor: 'rank'
        },
        {
          Header: "Ticker",
          accessor: "ticker",
        },
        {
          Header: "Count",
          accessor: "count",
        },{
          Header: "% Change",
          accessor: "percent_change"
        }/*,
        {
          Header: "Week",
          accessor: "week"
        }*/
      ],
      week: "",
      week_id: "",
      weeks: [],
      options: [],
      value: "",
      filters: {
        "count": 0
      },
      sort: {rank: 'asc', "count":"none", "percent_change":"none"}
    };
    this.onCellClicked = this.onCellClicked.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.onSortRequested = this.onSortRequested.bind(this);
    this.onChangeWeek = this.onChangeWeek.bind(this);

  }
  componentDidMount = () => {
    axios
      .get(this.props.API_ENDPOINT + "/weekly_occurence_weeks")
      .then((response) => {
        log("week", response.data);
        let weeks = new Set();
        var week_id = {};
        var options = [];
        for (var i = 0; i < response.data.length; ++i) {
          weeks.add(response.data[i]);
          log(response.data[i]);

          let year = response.data[i][0], week = response.data[i][1];
          let weekMoment = moment().year(year).week(week).day(0);
          let additional = weekMoment.format("MMM, Do");
          const weekId = `Week of ${additional}`;

          options.push(weekId);
          week_id[options[options.length - 1]] = response.data[i];
        }
        this.setState({
          weeks: Array.from(weeks),
          week_id: week_id,
          options: options,
          value: options[0],
        });
        this.onChangeWeek(this.state.options[0],this)
        log(this.state.week_id);
      })
      .catch((err) => {
        log(err);
      });
  };
  onChangeWeek(value, par) {
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    log(par.state.week_id[value]);
    axios
      .post(this.props.API_ENDPOINT + "/weekly_occurences", {
        week: par.state.week_id[value][1],
        year: par.state.week_id[value][0],
      })
      .then((response) => {
        log("week data", response.data);
        var data = [];
        for (var i = 0; i < response.data.length; ++i) {
          log(response.data[i][1]);
          data.push({
            rank: i+1,
            ticker: response.data[i][2],
            count: parseInt(response.data[i][3]),
            percent_change: response.data[i][4]+"%"
          });
        }
        par.setState({ data: data });
      })
      .catch((err) => {
        console.error({err});
        log(err);
      });
  }

  onCellClicked({columnId, value}){
    try{
      if(columnId === "ticker" && value){
        Router.push(Formatter.getStockDeepLink(value));
      }
    }catch(e){
      console.error({"table_weekly.onCellClicked":e});
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
        <Table columns={this.state.columns} 
        onSortRequested={this.onSortRequested} sort={this.state.sort}
        data={Formatter.sort(Formatter.filterDaily(this.state.data, this.state.filters['count'] || 0), this.state.sort)}
        onCellClicked={this.onCellClicked}/>
      </Styles>
    );
  }

  handleFilterChange(newVal){
    //console.log("handleFilterChange: ",newVal);
    newVal = parseInt(newVal);
    this.setState((state)=>{
      state.filters['count'] = newVal == 0 ? "" : newVal;
      return state;
    });
  }

  render() {
    return (
      <div>
        <div className="weekly_filters">
          <CreateDropdownList
            weeks={this.state.options}
            par={this}
            value={this.state.value}
            onChangeWeek={this.onChangeWeek}
          />
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
export default TableWeekly;

class CreateDropdownList extends Component {
  constructor(props) {
    super(props);

    log("okay", this.props.value);
    this.state = {
      value: this.props.value,
      weeks: this.props.weeks,
    };
    this.onChangeOption = this.onChangeOption.bind(this);
  }
  componentWillMount() {
    this.setState({ weeks: this.props.weeks,value: this.props.value });
  }

  handleCreate(name) {
    let { weeks } = this.state;

    let newOption = {
      name,
      id: weeks.length + 1,
    };

    this.setState({
      value: newOption,
      week: [...weeks, newOption],
    });
  }
  onChangeOption(event) {
    log(event);
    this.setState({ week: event, value: event });
    this.props.onChangeWeek(event, this.props.par);
  }

  render() {
    let { value } = this.state;

    value = value ? value : this.props.weeks[0];

    return (
      <DropdownList
        filter
        data={this.props.weeks}
        value={value}
        allowCreate="onFilter"
        onCreate={(name) => this.handleCreate(name)}
        onChange={this.onChangeOption}
        textField="name"
      />
    );
  }
}
