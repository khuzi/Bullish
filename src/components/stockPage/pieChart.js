import React, { PureComponent } from 'react';
import {
  PieChart, Pie, Sector, Cell,
} from 'recharts';

const data = [
  { name: 'Group A', value: 400 }
]

export default class Radial extends React.Component {

  render() {
      //console.log(this.props.angle)
    return (
      <PieChart width={400} height={400}>
        <Pie dataKey='value' startAngle={0} endAngle={this.props.angle} data={data} cx={200} cy={200} outerRadius={80} fill="#8884d8"  />
      </PieChart>
    );
    }}