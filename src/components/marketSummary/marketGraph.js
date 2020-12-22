import React from 'react';
import { Bar, BarChart,ComposedChart, LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import Graph from './graph';





export default class MarketGraph extends React.Component {

  state = {
    client: false,
    graphData: [],
    datas: [{date:'9/12',coords:20000},{date:'9/13',coords:30000},{date:'9/14',coords:40000},{date:'9/15',coords:50000}]
  }

    constructor(props){
        super(props)
    }

    componentDidMount(){
      var plots = [];
      var groups = [];
      this.setState({
        client: true
      })
      axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      axios.post(`${this.props.API_ENDPOINT}/daily_tweet_totals`)
      .then((response) => {
          for(let a=0;a<response.data.length;a++){
              var dat = response.data[a];
              var month = dat[1].split(' ')[2];
              var day = dat[1].split(' ')[1];
              //console.log('month: '+month+" day: "+day)
              var plot = {date: `${dat[3]}/${dat[2]}`, coords: parseInt(dat[0])};
              groups.push({ coords: parseInt(dat[0]) })
              //console.log('plot: ' + JSON.stringify(plot));
              plots.push(plot);

          }

          this.setState({ graphData: plots });
          //console.log("after set state");
          //console.log(JSON.stringify(this.state.graphData));
      })
    }

    getGraphWidth(){
      const offsetMarginRight = 60;
      let graphWidth = Math.floor(window.innerWidth - offsetMarginRight);
      return graphWidth;
    }

    getGraphHeight(){
      let graphHeight = Math.floor(window.innerHeight*0.50);
      return graphHeight;
    }
      
    
    render(){
        //console.log('graph data: ' + JSON.stringify(this.state.graphData));
        //console.log('datas ' + JSON.stringify(this.state.datas));
        if(!this.state.client){
          return (<></>);
        }
        return (
          <LineChart
            width={this.getGraphWidth()}
            height={this.getGraphHeight()}
            data={this.state.graphData}
            style={{ backgroundColor: 'white'}}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              strokeWidth={10}
              name="Total Daily Tweets"
              type="monotone"
              data={this.state.graphData}
              dataKey="coords"
              stroke="green"
            />
          </LineChart>
        );
        
    }
}

