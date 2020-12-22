import React from 'react';
import { Helmet } from 'react-helmet';
import { Utils } from '../common/util';
import { TEST_DATA } from './testData';


export class RangeSliderFilter extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            items: TEST_DATA.reverse()
        }
        this.utils = new Utils();
    }

    getItems(){
        const items = this.props.elements ? this.props.elements : [];

        return items;
    }

    initializeSlider(){
        const items = this.getItems();
        document.querySelector("#slider-container").innerHTML = "";
        var slider = window['createD3RangeSlider'](0, items.length-1, "#slider-container", null, items);

        slider.onTouchEnd((data) => {
            if(this.props.onTouchEnd){
                this.props.onTouchEnd(data);
            }
        })

        slider.range(0,items.length-1);
        this.setState({
            slider: slider
        })
    }

    componentDidMount(){
        //Initialize slider
        Utils.WaitForCondition(()=>(window['d3'] && window['createD3RangeSlider']))
        .then(()=>{
            this.initializeSlider();
        })
        .catch((err)=>{
            console.error({err});
        })
    }

    shouldComponentUpdate(data){
        const newElements = data.elements;
        const currentElements = this.props.elements;

        let shouldUpdate;

        if(newElements && currentElements){
            if(JSON.stringify(newElements) === JSON.stringify(currentElements)){
                shouldUpdate = false;
            }else{
                shouldUpdate = true;
            }
        }else{
            if((newElements && !currentElements) || (!newElements && currentElements)){
                shouldUpdate = true;
            }else{
                shouldUpdate = false;
            }
        }

        //console.log({ shouldUpdate, newElements, currentElements });
        
        return shouldUpdate;
    }

    componentDidUpdate(){
        const max = this.props.elements ? this.props.elements.length - 1 : 0;
        const min = 0;
        const elements = this.props.elements ? this.props.elements : [];
        //console.log({ slider: this.state.slider, max,min,elements });
        //this.state.slider.setRange(0, 7, elements);
        this.initializeSlider();
    }


    render(){
        return (
            <>
                <div id="slider-box">
                    <div id="slider-container"></div>
                    <div id="range-label"></div>
                </div>
            </>
        );
    }
}