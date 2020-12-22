import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

class StackedBar extends React.Component {
    render() {
        return (
          <BarChart
            width={500}
            height={300}
            data={this.props.tickers}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="netflix" stackId="a" fill="#8884d8" />
            <Bar dataKey="google" stackId="a" fill="#82ca9d" />
          </BarChart>
        );
      }
    }
    export default StackedBar;