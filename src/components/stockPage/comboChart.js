import React from 'react';
import { ComposedChart,ReferenceArea, Line,Bar,Area, Brush, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RangeSliderFilter } from '../range_slider';
import moment from 'moment';

class Combo extends React.Component {
  constructor(props){
    super(props)
    this.state={
      data: [],
      left: '',
      right: '',
      client: false,
      toDisplay: null
    }
    this.handleUpdate.bind(this);
    this.onChangeRangeFilter = this.onChangeRangeFilter.bind(this);
    this.getFilteredAverage = this.getFilteredAverage.bind(this);
    this.getAverageDates = this.getAverageDates.bind(this);
  }
  handleUpdate = () => {
    console.log("handleUpdate");
    //by calling this method react re-renders the component    
    this.setState({ data: this.props.average });
    //console.log(this.props.average)
  };

  getGraphWidth(){
    return window.innerWidth <= 1200 ? window.innerWidth*0.95 : window.innerWidth * .55;
  }
  getGraphHeight(){
    return window.innerWidth >= 1200 ? window.innerHeight * 0.50 : window.innerHeight * .40;
  }


  onChangeRangeFilter({begin, end}){
    this.setState({
      averageDataFilter: {
        from: begin,
        to: end
      }
    });
    const filtered = this.getFilteredAverage();
    this.setState({
      data: filtered
    })
  }

  getFilteredAverage(){
    if(!this.props.average || !this.state.averageDataFilter){
      return [];
    }
    const {from, to} = this.state.averageDataFilter;

    const data = this.props.average.filter((element, index)=>{
      return (index  >= from) && (index <= to);
    });

    return data;
  }

  getAverageDates(){
    return this.props.average.map(element => (element.date))
  }
    

  zoom(){
    
      const {left, right, data } = this.state;
      var dats = [];
      //console.log(right)
      for(let i=0;i<data.length;i++){
          if(data[i]['date']===left){
              for(let b=i;b<data.length;b++){
                if(data[b]['date']===right){
                    dats.push(data[b]);
                    break
                }
                dats.push(data[b])
              }
          }
      }
      this.setState({ data: dats })
      
  }
  zoomOut(){
      this.setState({ data: this.props.average })
  }
  zoom(){
    
      const {left, right, data } = this.state;
      var dats = [];
      //console.log(right)
      for(let i=0;i<data.length;i++){
          if(data[i]['date']===left){
              for(let b=i;b<data.length;b++){
                if(data[b]['date']===right){
                    dats.push(data[b]);
                    break
                }
                dats.push(data[b])
              }
          }
      }
      this.setState({ data: dats,left: '', right: '' })
      
  }
  zoomOut(){
      this.setState({ data: this.props.average })
  }
  handleClick(e){
    if(e!=null){
      if(e.which===3){
        this.zoomOut()
      }
      else{
        this.setState({ left: e.activeLabel })
      }
    }

  }

  componentDidMount(){
    this.setState({
      client: true
    });
  }

  getFirstTickerItem(){
    if(this.state.data && this.state.data.length > 0){
      let found = this.state.data[0];
      return found;
    }else{
      return null;
    }
  }

  get mainTickerTitle(){
    let item = this.getFirstTickerItem();
    return item ? item.ticker : item;
  }

  getStockItem(date){
    return this.props.stockPrices.find(element => {
      return (element.date === date)
    })
  }

  getFirstStockItem(){
    return this.props.stockPrices[0];
  }

  getDisplayStockItem(){
    if(!this.props.stockPrices || this.props.stockPrices.length < 1){
      return null;
    }
    let stockItem;
    if(!this.state.toDisplay){
      stockItem = this.getFirstStockItem();
    }else{
      let date = moment(this.state.toDisplay.date, "MM/DD").format("YYYY-MM-DD");
      stockItem = this.getStockItem(date);
      if(!stockItem){
        //stockItem = this.getFirstStockItem();
      }
    }
    return stockItem;
  }

  get mainTickerDate(){
    let stockItem = this.getDisplayStockItem();
    if(!stockItem){
      if(this.state.toDisplay && this.state.toDisplay.date){
        return moment(this.state.toDisplay.date, "MM/DD").format("YYYY-MM-DD");
      }else{
        return ""
      }
    }
    return `${stockItem.date}`;
  }

  get mainTickerSub(){
    let stockItem = this.getDisplayStockItem();
    if(!stockItem){
      return "";
    }
    return `Low: ${stockItem.low}`;
  }

  get mainTickerSub2(){
    let stockItem = this.getDisplayStockItem();
    if(!stockItem){
      return "";
    }
    return `High: ${stockItem.high}`;
  }

  get mainTickerSub3(){
    let stockItem = this.getDisplayStockItem();
    if(!stockItem){
      return "";
    }
    return `Open: ${stockItem.open}`;
  }

  render() {
    //console.log(this.state.data)
    const {
        data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2,
    } = this.state;
    if(!this.state.client){
      return (<></>);
    }
    return (
        <div className="highlight-bar-charts stock-combochart" style={{ userSelect: 'none' }}>
          <div style={{color:'white', padding:'10px'}}>
              <h3 className="combo-chart-title">{this.mainTickerTitle}
                  <br/>
                  <small><small>{this.mainTickerDate}</small></small>
                  <small>&nbsp; {this.mainTickerSub}</small>
                  <small>&nbsp; {this.mainTickerSub2}</small>
                  <small>&nbsp; {this.mainTickerSub3}</small>
              </h3>
          </div>
         <ComposedChart
           width={this.getGraphWidth()}
           height={this.getGraphHeight()}
           data={this.state.data}
           onMouseDown={ e => this.handleClick(e) }
           onMouseLeave={()=>{
            this.setState({
              toDisplay: null
            })
           }}
           onMouseMove={(e)=>{
              //e!==null ? this.state.left && this.setState({ right: e.activeLabel }) : this.setState({ left: ''})
              if(e!==null && e.activePayload){
                if( this.state.toDisplay 
                  && (this.state.toDisplay['ticker'] === e.activePayload[0].payload['ticker'])
                  && (this.state.toDisplay['date'] === e.activePayload[0].payload['date'])
                ){
                  return;
                }
                this.setState({
                  toDisplay: e.activePayload[0].payload
                })
              }else{
                this.setState({
                  toDisplay: null
                })
              }
           }}
           //onMouseUp={left !=='' ? this.zoom.bind(this): this.zoomOut.bind(this)}
           style={{ backgroundColor: 'white' }}
           margin={{
             top: 20, right: 20, bottom: 20, left: 20,
           }}
         >
           <CartesianGrid stroke="#f5f5f5" />
           <XAxis
           dataKey='date'/>
             <YAxis
             />
             <Tooltip wrapperStyle={{
               display:'none'
             }}/>
             <Legend style={{ backgroundColor: 'white', color: 'white'}} />
             <Area name='7 Day Rolling Avg.' type="natural" dataKey="avg" stroke="#82ca9d" animationDuration={300} />

             <Bar style={{ color: 'white' }} name='Daily Occurrences' dataKey="daily" barGap={0} barSize={20} fill="#4941E6" />
             <Brush dataKey="date" height={25} stroke="grey" />
        </ComposedChart>
        <button
          // href="javascript: void(0);"
          className="btn-update"
          onClick={this.zoomOut.bind(this)}
          style={{display:'none'}}
        >
          Zoom Out

        </button>
    </div>
    );
  }
}
export default Combo;