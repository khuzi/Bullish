import React, { Component } from "react";
import { Styles, Table } from "../common/table_def";
import axios from "axios";
import Combo from "./comboChart";
import Formatter from "../common/formatter";
import moment from 'moment-timezone';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from "../common/searchBar";
import GaugeChart from "../marketSummary/gaugeChart";
import RidgelineChart from './ridgelineChart';
import { AverageDataFactory, AverageData } from "../common/AverageDataFactory";
import Router from 'next/router';
import { StockDataFetcher } from "../common/StockDataFetcher";
import { StockPrice } from "src/lib/stockPrice";
import { StockDescription } from "@components/stock_description";

class TweetTable extends Component {
  state = {
    data: [],
    columns: [
      {
        Header: "Tweet Link",
        accessor: "tweet_link",
      },
      {
        Header: "Tweet",
        accessor: "tweet",
      },{
        Header: "Time",
        accessor: "time",
      },
    ],
    ticker: "",
    ticker_id: "",
    tickers: [],
    dailyOcc: [],
    avgOcc: [],
    todaysOcc: "",
    todaysAvg: "",
    todaysDec: "",
    color: "",
    info: "no-show",
    graph: "no-show",
    instruct: "instruct",
    stockPage: "",
    fangPage: "no-show",
    fangDaily: [],
    apple: [],
    tesla: [],
    facebook: [],
    dates: [],
    percent: '',
    date: null,
    /**
     * @type {AverageData}
     */
    tableElement: null,  //The date to show on the table
    loadingDate: false,
    loadingTicker: false,
    /**
     * @type {AverageData[]}
    */
    averageData: [],
    averageDataFilter: {
      from: 0,
      to: 0
    },
    client: false,
    /**
     * @type {StockPrice[]}
     */
    stockPrices: []
  };
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.child = React.createRef();
    this.ridgelineChart = React.createRef();

    this.onChangeDate = this.onChangeDate.bind(this);
    this.populateDate = this.populateDate.bind(this);
    this.returnDetailsTable = this.returnDetailsTable.bind(this);
    this.onChangeRangeFilter = this.onChangeRangeFilter.bind(this);
    this.getDatesFromOcc = this.getDatesFromOcc.bind(this);
    this.getFilteredAverage  = this.getFilteredAverage.bind(this);
    this.onChangeTicker = this.onChangeTicker.bind(this);
  }

  gaugeChartRef;
  searchComponent;
  componentDidMount = () => {
    this.setState({
      client: true
    })
    const params = new URLSearchParams(window.location.search); 
    const ticker = (()=>{
      let ticker = params.get('ticker');
      if(!ticker && Router.query && Router.query.stockID){
          ticker = Router.query.stockID[0]
      }
      return (ticker || 'TSLA').toUpperCase();
    })();
    setTimeout(()=>{
      this.searchComponent.setSearchbarInput(ticker);
      axios
        .get(this.props.API_ENDPOINT + "/tweet_tickers")
        .then((response) => {
          let tickers = new Set();
          var ticker_id = {};
          for (var i = 0; i < response.data.length; ++i) {
            tickers.add(response.data[i][0]);
            ticker_id[response.data[i][0]] = response.data[i][1];
          }
          this.setState({ tickers: Array.from(tickers), ticker_id: ticker_id });
          this.onChangeTicker(ticker, this)
          .catch((err)=>{
            //console.log({err});
          });
        })
        .catch((err) => {
          //console.log(err);
        });
    }, 300)
  };


  populateDate(){
    if(this.state.loadingDate){
      return;
    }

    return new Promise((accept, reject)=>{
      this.setState({loadingDate: true})
      const {ticker_id} = this.state;
      const {ticker} = this.state;
      console.log({ticker});
      const stock_id = ticker_id[ticker];
      axios
      .post(this.props.API_ENDPOINT + "/daily_occurence_days_id", {
        stock_id: stock_id
      })
      .then((response)=>{
        let dates = response.data.map(element => {
          return new Date(element[0].replace("GMT", ""));
        });

        const stockDataFetcher = new StockDataFetcher(this.props.STOCK_ENDPOINTS);
        let to = moment(dates[0]), from = dates[dates.length - 1];
        stockDataFetcher.getStockPrice(ticker, from, to)
        .then(element => {
          this.setState({
            stockPrices: element
          })
        })
        .catch(error => {
          console.log({error});
        });

        this.setState((state)=>{
          state.dates =  dates;
          state.loadingDate =  false;
          state.date =  dates[0];
          return state;
        });
        accept();
      })
      .catch((err)=>{
        reject(err);
      })
    });
  }

  onChangeDate(date){
    if(!(date instanceof Array)){
      this.setState({loadingTicker: true});
      return;  
    }else{
      this.setState({loadingTicker: true});
    }

    date = date[0];
    
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    let {stock_id} = this.state;
    stock_id = this.state.ticker_id[this.state.ticker] || 1425;  //TSLA: 1425

    let searchDate = moment(date);
    searchDate = searchDate.format("YYYY-MM-DD");

    axios.post(this.props.API_ENDPOINT+"/tweets_by_stock_id_and_date", {
      stock_id: stock_id,
      date: searchDate
    })
    
    .then((response)=>{
      var data = [];
      for (var i = 0; i < response.data.length; ++i) {
        let tweet_link = Formatter.getTweetLink(response.data[i][2], response.data[i][4]);
        let date = Formatter.getDate(response.data[i][3]);
        data.push({
          rank: i+1,
          time: date,
          tweet: response.data[i][5],
          user_id: response.data[i][4],
          tweet_link: tweet_link
        });
      }
      this.setState({data: data, date:date, loadingTicker:false});
    })
    .catch((err)=>{
      console.error(err);
      this.setState({loadingTicker: false});
    })
  }

  onChangeTicker(value, par) {
    console.log({value, par});
    return new Promise((accept, reject)=>{
      par.setState({loadingTicker: true});
      axios
        .post(this.props.API_ENDPOINT + "/tweets_by_stock_id", {
          stock_id: par.state.ticker_id[value],
        })
        .then((response) => {
          var data = [];
          for (var i = 0; i < response.data.length; ++i) {
            let tweet_link = Formatter.getTweetLink(response.data[i][2], response.data[i][5]);
            let date = Formatter.getTweetDate(new Date(response.data[i][4]));
            data.push({
              rank: i+1,
              time: date,
              tweet: response.data[i][3],
              user_id: response.data[i][2],
              tweet_link: tweet_link
            });
          }
          par.setState({ data: data , ticker:value});
          par.onChangeGraphAvg(value, par);
          return par.populateDate();
        })
        .then(()=>{
          par.setState({loadingTicker: false});
          accept();
        })
        .catch((err) => {
          //console.log(err);
          par.setState({loadingTicker: false});
          reject(err);
        });
    });
  }
  
  onChangeGraphAvg(value, par) {
    //calls api by stock_id from above to get daily avg tweet occs
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios
      .post(this.props.API_ENDPOINT + "/get_avg_occ_data", [
        par.state.ticker_id[value],
      ])
      .then((response) => {
        let parsedData = AverageDataFactory.parseFromDataArray(response.data);
        console.log({
          "value": value,
          "par.state.ticker_id[value]": par.state.ticker_id[value],
          parsedData
        });
        let {dats, stateProps} = AverageDataFactory.parseDataForStock(parsedData);

        par.setState((state)=>{
          Object.assign(state, stateProps);
          state.avgOcc = dats;
          state.ticker = value;
          state.averageData = parsedData;
          state.tableElement = parsedData.length > 1 ? parsedData[parsedData.length - 1] : parsedData[parsedData.length - 1];
          return state;
        });
        try{
          this.child.current.handleUpdate();
          this.ridgelineChart.current.chart();
        }catch(e){
          console.error({"stockPage_table": e});
        }
      });
  }

  onChangeRangeFilter({begin, end}){
    this.setState({
      averageDataFilter: {
        from: begin,
        to: end
      }
    });
    this.child.current.handleUpdate();
  }

  getFilteredAverage(){
    if(!this.state.averageDataFilter){
      return [];
    }
    const {from, to} = this.state.averageDataFilter;

    return this.state.avgOcc.filter((element, index)=>{
      return (index  >= from) && (index <= to);
    })
  }

  getDatesFromOcc(){
    return this.state.avgOcc ? this.state.avgOcc.map(element => {
      return element.date
    }): [];
  }
  
  toggle() {
    this.setState({ stockPage: "no-show",fangPage: 'show' });
  }
  toggleBack() {
    this.setState({ stockPage: "show",fangPage: 'no-show' });
  }
  returnTable() {
    return (
      <Styles>
        <Table columns={this.state.columns} data={this.state.data} />
      </Styles>
    );
  }

  returnDetailsTable(){

    if(this.state.tableElement){
      return (
        <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp deep-dive-table-a">
          <thead>
            <tr>
              <th className="mdl-data-table__cell--non-numeric">
                <div id="deep-cont">
                  <h1 id="deep">Stock Deep Dive: </h1>
                  <h1 id="deep-b"> {this.state.tableElement.ticker}</h1>
                </div>
              </th>
            </tr>
            <tr>
              <th className="mdl-data-table__cell--non-numeric">
                <span style={{fontSize:'16px'}}>Date: {this.state.tableElement.getDate(Formatter.basicDateFormat)}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mdl-data-table__cell--non-numeric">
                Occurrence Vs. 7 Day Avg:
              </td>
              <td className={`bolder ${this.state.color}`}>
                {Math.round(this.state.tableElement.sevendayAverage)}%
              </td>
            </tr>
            <tr>
              <td className={`mdl-data-table__cell--non-numeric`}>
                Total Tweet Occurrences:
              </td>
              <td className={`bolder ${this.state.color}`}>
                {this.state.tableElement.occurrences}
              </td>
            </tr>
            <tr>
              <td className={`mdl-data-table__cell--non-numeric`}>
                7-Day Rolling Occurrences Avg:{" "}
              </td>
              <td className={`bolder ${this.state.color === "green" ? "red" : "green"}`}>
                {this.state.tableElement.occurrenceVs7dayAvg}
              </td>
            </tr>
            <tr>
              <td className={`mdl-data-table__cell--non-numeric`} style={{width:'30em', height:'20em'}} colSpan={2}>
                <GaugeChart
                  ref={(ref)=>(this.gaugeChartRef = ref)}
                  date={this.state.tableElement ? this.state.tableElement.date : ""}
                  averageData={this.state.averageData}
                />
              </td>
            </tr>
          </tbody>
        </table>
      );

    }else{
      return (
        <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp deep-dive-table-a">
          <tbody>
            <tr>
              <td className="mdl-data-table__cell--non-numeric">Loading...</td>
            </tr>
          </tbody>
        </table>
      )
    }
  }

  render() {
    return (
      <div>
          <div id={this.state.stockPage}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div><RidgelineChart ticker={this.state.ticker} avgOcc={this.state.avgOcc} ref={this.ridgelineChart} /></div> 
              </div>
              <div id="graph-cont">
                  <div id={this.state.graph} className="graph-container">
                    <Combo
                        average={this.state.avgOcc}
                        daily={this.state.dailyOcc}
                        ticker={this.state.ticker}
                        days={this.state.days}
                        stockPrices={this.state.stockPrices}
                        ref={this.child}
                    />
                  </div>
                  
                  <div id={this.state.info} className="graph-ddtc">
                    {
                      this.returnDetailsTable()
                    }
                  </div>
              </div>
              <div className="row stock-info-row">
                <div className="col-xs-12 col-sm-8 col-md-6">
                  <StockDescription STOCK_ENDPOINTS={this.props.STOCK_ENDPOINTS} ticker={this.state.ticker}/>
                </div>
              </div>
              <div className="dropdown-container">
                <div className="row">
                  <div className="mdl-cell mdl-cell--12-col">
                  </div>
                  <div className="col-xs-12 col-sm-8">
                    <div>
                      <h1 className="dd" id={this.state.instruct}>
                        Choose Ticker From Drop Down Menu
                      </h1>
                      <div className="row stock-filters">
                        <div className="col-xs-12 col-sm-6 filter">
                          <div className="stockpage-dropdown">
                            {
                              this.state.client ? <CreateDropdownList
                                ref={(ref)=>{this.searchComponent = ref;}}
                                disabled={this.state.loadingDate || this.state.loadingTicker}
                                tickers={this.state.tickers}
                                value={this.state.ticker}
                                par={this}
                                onChangeTicker={this.onChangeTicker}
                              /> : <></>
                            }
                            
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 filter">
                          <div className="stock-datepicker">
                            <DatePicker
                              disabled={this.state.loadingDate || this.state.loadingTicker}
                              selected={this.state.date}
                              includeDates={this.state.dates}
                              onChange={(...data) => this.onChangeDate(data)}
                              placeholderText="This only includes todate and tomorrow"
                            />
                      </div>
                    </div>
                  </div>
                  {this.returnTable()}
                </div>
              </div>
              <div className="col-xs-12 col-sm-2"></div>
            </div>
          </div>
        </div>
        <div id={this.state.fangPage}>
        <div>
        </div>
        </div>
      </div>
    );
  }
}
export default TweetTable;

class CreateDropdownList extends Component {
  searchBarRef = null;
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      tickers: this.props.tickers,
    };
    this.onChangeOption = this.onChangeOption.bind(this);
    //console.log({props});
  }
  componentWillMount() {
    this.setState({ tickers: this.props.tickers });
  }

  handleCreate(name) {
    let { tickers } = this.state;

    let newOption = {
      name,
      id: tickers.length + 1,
    };

    this.setState({
      value: newOption,
      ticker: [...tickers, newOption],
    });
  }

  onChangeOption(event) {
    //console.log(event);
    //console.log(this.props.par);
    this.setState({ ticker: event, value: event });
    this.props.onChangeTicker(event, this.props.par);
  }

  setSearchbarInput(stringData){
    this.searchBarRef.setInputText(stringData);
  }

  render() {
    let { value } = this.state;

    return (
      <SearchBar 
      ref={(ref)=>{this.searchBarRef = ref;}}
      disabled={this.props.disabled} 
      data={this.props.tickers} 
      value={value} 
      onChange={this.onChangeOption}/>
    );
  }
}
