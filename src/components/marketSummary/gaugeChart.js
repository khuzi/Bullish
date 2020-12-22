import React from 'react';
import ReactSpeedometer from "react-d3-speedometer"
import { AverageData } from '../common/AverageDataFactory';


export default class GaugeChart extends React.Component {
    state = {
        date: null, averageData: [], client: false
    };

    constructor(props){
        super(props);
        this.chartReference = null;
    }

    componentDidMount(){
        this.setState({
            client: true
        })
    }

    render(){
        const {date, averageData} = this.props;

        let sevenDayAvg = 500;
        let currentValue = 0;

        if(date && averageData && averageData.length > 0){
            let averageElement = averageData.find((element)=>{
                return (element.date.getTime() == date.getTime())
            });
            if(averageElement){
                sevenDayAvg = parseInt(averageElement.sevendayAverage);
                currentValue = parseInt(averageElement.occurrences);
            }
        }
        let sevenDayAvgHalf = Math.floor(sevenDayAvg/2);
        let sevenDayAvg150 = Math.floor(sevenDayAvg*1.5);
        let aboveAvg = Math.floor(sevenDayAvg*2);
        const maxValue = currentValue > aboveAvg ? currentValue : aboveAvg;
        //const maxValue = currentValue * 2;
        let customSegmets = [0, sevenDayAvgHalf, sevenDayAvg, sevenDayAvg150, maxValue];
        const colors = ["firebrick", "tomato", "gold", "limegreen"];
        //const colors = ["limegreen", "limegreen", "limegreen", "limegreen"];
        const textColor = "var(--client_palette_secondary)";
        const needleColor = textColor;
        
        if(currentValue > 0 && this.state.client){
            return (
                <div style={{height:'95%',
                width:'100%',
                display:'flex', 
                justifyContent:'center',
                paddingBottom: "1em",
                alignItems:'center'}}>
                    <ReactSpeedometer
                        ref={(ref) => (this.chartReference = ref)}
                        customSegmentStops={customSegmets}
                        segmentColors={colors}
                        value={currentValue}
                        textColor={textColor}
                        fluidWidth={true}
                        forceRender={true}
                        segments={4}
                        labelFontSize={"10px"}
                        currentValueText={`${currentValue}`}
                        maxValue={maxValue}
                        customSegmentLabels={[
                            {
                                text: "Below the Average",
                                position: "OUTSIDE",
                            },
                            {
                                text: "7-Days Occurrence",
                                position: "OUTSIDE",
                            },
                            {
                                text: "150%",
                                position: "OUTSIDE",
                            },
                            {
                                text: "Above the Average",
                                position: "OUTSIDE",
                            }
                        ]}
                        needleColor={needleColor}
                    />
                </div>
            )  
        }
        return (
            <h3>Loading gauge chart...</h3>
        )
    }
}