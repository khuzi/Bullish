import React from 'react';
import { Bar, BarChart,ComposedChart, LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default class Graph extends React.Component{
    constructor(props){
        super (props)
    }
    handleUpdate = () => {
        this.setState({})
    }
    render(){
        //console.log(this.props.plots)
        return (
            <LineChart
                 width={800}
                 height={600}
                 >
                <CartesianGrid stroke="black" />
                <Line type="monotone" name='date' stroke="red" />
            </LineChart>
        )
    }
}