import React, { Component } from "react";
import * as d3 from "d3";
import axios from "axios";
import moment from 'moment-timezone';

export default class RidgelineChart extends React.Component {

    state = {
        rangeSelected: "Quarter",
        startDateLabel: "",
        endDateLabel: "",
        client: true,
        valuesLabel: "",
        ticker: "",
        avgOcc: []
    };



    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.draw_init();
    }

    draw_init() {
        axios.get(this.props.API_ENDPOINT + "/weekly_ridgeline")
            .then((response) => {
                console.log(response.data)
                var data = this.preprocess_data(response.data)
                this.draw(data)
            });
    }

    preprocess_data(data) {
        /**
        * preprocesses the data from api.
        * @param  {array} data  data from api.
        * @return {object} with weeks for Y axis and tickers 
        * and corresponding map for weeks.
        */
        // max no of tickers to display in graph
        var max_tickers = 50

        // last n weeks to consider 
        var no_weeks = 7

        var tickers = {}
        var weeks = []
        var weeks_array = []
        var visited = new Array(60).fill(0);
       
        // get all unique weeks
        for(var i = 0; i < data.length; ++i) {
            if (visited[data[i][4]]==0) {

                let year = data[i][3], week = data[i][4];
                let weekMoment = moment().year(year).week(week).day(0);
                let additional = weekMoment.format("MMM, Do");
                const weekId = `Week of ${additional}`;
                weeks.push([data[i][4], weekId])
                weeks_array.push(data[i][4])
                visited[data[i][4]] = 1
            }
        }

        weeks = weeks.sort()
        weeks = weeks.slice(weeks.length - no_weeks, weeks.length)

        // get all tickers and their total mentions 
        for(var i = 0; i < data.length; ++i) {
            if(weeks_array.includes(data[i][4])) {

                if (data[i][0] in tickers) {
                    tickers[data[i][0]] += data[i][1]
                }
                else {
                    tickers[data[i][0]] = 0
                    tickers[data[i][0]] += data[i][1]
                }
            }
        }

        var tmp = []
        for(var i = 0; i < weeks.length; ++i) {
            tmp.push(weeks[i][1])
        }
        weeks = tmp

        // pick to max_tickers after sorting
        var items = Object.keys(tickers).map(function(key) {
            return [key, tickers[key]];
        });

        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        var sorted_tickers = items.slice(0,max_tickers)
        var tickers  = []
        var data_final = {}
        data_final["tickers"] = []
        data_final["weeks"] = weeks

        // populate the final table
        // takes into consideration the the api returns data
        // sorted by ticker and week
        for(var i = 0; i < sorted_tickers.length; ++i) {
            tickers.push(sorted_tickers[i][0])
            data_final["tickers"].push({})
            data_final["tickers"][i]['ticker'] = sorted_tickers[i][0] 
            data_final["tickers"][i]["weeks_mentions"] = []
        }

        for(var i = 0; i < data.length; ++i) { 
            if ( tickers.includes(data[i][0]) ) {
                data_final["tickers"][tickers.indexOf(data[i][0])]["weeks_mentions"].push(data[i][1])
            }
        }
        for(var i = 0; i < max_tickers; ++i) {

            data_final["tickers"][i]["weeks_mentions"] = data_final["tickers"][i]["weeks_mentions"].slice(weeks.length - no_weeks, weeks.length)
            data_final["tickers"][i]["weeks_mentions"] = data_final["tickers"][i]["weeks_mentions"].reverse()

        }
        return data_final

    }

    draw(data) {
        /**
        * draws the graph.
        * @param  {array} data  data from preprocess_data().
        * @return {None}         
        */
        var margin = ({top: 100, right: 20, bottom: 30, left: 40});
        var height = 1000;
        var width = this.svgContainerWidth || 700;

        // higher the value of overlap more overlap between each graph
        var overlap = 8;

        // pallette for graphs, increase size for more variety 
        var palette = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];

        var svg = d3.select("#weekly_ridge")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        var x = d3.scalePoint()
            .domain(data['weeks'])
            .range([margin.left, width - margin.right])

        var y = d3.scalePoint()
            .domain(data['tickers'].map(d => d['ticker']))
            .range([margin.top, height - margin.bottom])

        var z = d3.scaleLinear()
            .domain([0, d3.max(data['tickers'], d => d3.max(d['weeks_mentions']))]).nice()
            .range([0, -overlap * y.step()])
        var xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x)
                .ticks(width / 80)
                .tickSizeOuter(0))

        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
            .call(g => g.select(".domain").remove())

        var area = d3.area()
            .curve(d3.curveBasis)
            .defined(d => !isNaN(d))
            .x((d, i) => x(data['weeks'][i]))
            .y0(0)
            .y1(d => z(d))

        var line = area.lineY1()

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        const group = svg.append("g")
            .selectAll("g")
            .data(data['tickers'])
            .join("g")
            .attr("transform", d => `translate(0,${y(d['ticker']) + 1})`);

        group.append("path")
            .attr("fill", d => palette[data['tickers'].indexOf(d)%palette.length])
            .attr("opacity", 0.4)
            .attr("d", d => area(d['weeks_mentions']));

        group.append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", d => line(d['weeks_mentions']));
    }

    get svgContainerWidth(){
        if (!this.state.client) {
            return null;
        }
        if (!document.querySelector("#weekly_ridge")) {
            return null;
        }
        let width = document.querySelector("#weekly_ridge").clientWidth;
        return width;
    }

    getWidth() {
        if (!this.state.client) {
            return null;
        }
        if (!document.querySelector(".chart-container.ridge")) {
            return null;
        }
        let width = document.querySelector(".chart-container.ridge").parentElement.clientWidth;
        return width;
    }

    render() {

        const { avgOcc } = this.props;

        return (
            <>
            {
                this.state.client ?
                <div style={{ width: '100%', maxWidth: '100vw' }}>
                <h4 className="ridgeline-title"> Weekly Ridge</h4>
                <div id="weekly_ridge"></div>
                </div> : <div></div>
            }

            </>
        );
    }
}
